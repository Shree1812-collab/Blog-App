###-----Backend Development-----###
1. initialize a git repo
    git init
//this creates a hidden .git folder that tracks all your changes.
2. add a .gitignore File
    create a .gitignore file in the root=add node_modules/ & .env
3. set up environment variables
    //create a .env file in the root folder
    //Install the dotenv package to read these values in your code
    npm install dotenv
4. generate package.json
    npm init -y
//update  main to server.js & type to module
5.create express application    
    npm install express
6.connect to DB                 
    npm i mongoose
7.add middlewares
    body parsers,error handlers
8.design schemas and create models
9.design REST APIs for all resources
10.running the server
    npm run dev
    npm install -D nodemon (nodemon server.js)
###