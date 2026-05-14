import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { userRoute } from './APIs/UserAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import cookieParser from 'cookie-parser'
import { commonRouter } from './APIs/commonAPI.js'
import cors from 'cors'

config() // load environment variables

// create express app
const app = exp()

// allow cross origin requests
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blog-app-d1yk.vercel.app/"
  ],
  credentials: true
}))

// body parser
app.use(exp.json())

// cookie parser
app.use(cookieParser())

// connect APIs
app.use('/user-api', userRoute)
app.use('/author-api', authorRoute)
app.use('/admin-api', adminRoute)
app.use('/common-api', commonRouter)

// connect to DB
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL)
    console.log("Connected to DB...")

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () =>
      console.log(`Server started on port ${PORT}`)
    )

  } catch (err) {
    console.log("Err in DB", err)
  }
}

connectDB()

// invalid path middleware
app.use((req, res, next) => {
  console.log(req.url)
  res.status(404).json({
    message: `${req.url} is invalid path`
  })
})

// error handling middleware
app.use((err, req, res, next) => {

  console.log("Error name:", err.name)
  console.log("Error code:", err.code)
  console.log("Full error:", err)

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    })
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    })
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue

  // duplicate key error
  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0]
    const value = keyValue[field]

    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`
    })
  }

  // custom errors
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message
    })
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error"
  })
})