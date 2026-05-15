import React from 'react'

const posts = [
  { id: 1, category: "Design", title: "The Art of Negative Space", excerpt: "Why the world's best designers embrace emptiness.", author: "Aria Chen", date: "May 12, 2026" },
  { id: 2, category: "Technology", title: "Building AI That Listens", excerpt: "The next frontier isn't smarter — it's more human.", author: "Marcus Webb", date: "May 10, 2026" },
  { id: 3, category: "Culture", title: "Slow Reading Is Revolutionary", excerpt: "Choosing depth over speed is the most radical act.", author: "Priya Nair", date: "May 8, 2026" },
]

const catColors = { Design: "#C4512A", Technology: "#4A6741", Culture: "#C8960C" }

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;600&display=swap');
        .home { font-family:'DM Sans',sans-serif; background:#FAF7F0; min-height:100vh; color:#1A1209; }
        .hero { background:#1A1209; color:#FAF7F0; padding:72px 40px; text-align:center; }
        .hero-tag { font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:#C4512A; margin-bottom:16px; }
        .hero h1 { font-family:'Playfair Display',serif; font-size:clamp(36px,6vw,64px); font-weight:700; line-height:1.1; margin-bottom:20px; }
        .hero h1 em { font-style:italic; color:#C8960C; }
        .hero p { font-size:16px; color:rgba(250,247,240,.6); max-width:480px; margin:0 auto 32px; line-height:1.7; }
        .hero-btns { display:flex; gap:12px; justify-content:center; }
        .btn { padding:12px 28px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; border-radius:2px; transition:all .2s; }
        .btn-p { background:#C4512A; color:#fff; border:none; }
        .btn-p:hover { background:#b04024; }
        .btn-g { background:transparent; color:#FAF7F0; border:1.5px solid rgba(250,247,240,.3); }
        .btn-g:hover { border-color:#FAF7F0; }
        .section { max-width:1100px; margin:0 auto; padding:56px 40px; }
        .section-label { font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:#8A7F70; margin-bottom:28px; }
        .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .card { background:#fff; border:1px solid #E0D8C8; border-radius:3px; padding:28px; cursor:pointer; transition:transform .2s,box-shadow .2s; position:relative; overflow:hidden; }
        .card::after { content:''; position:absolute; top:0;left:0;right:0; height:3px; }
        .card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(26,18,9,.09); }
        .card-cat { font-size:10px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; margin-bottom:12px; display:block; }
        .card h3 { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; line-height:1.3; margin-bottom:10px; }
        .card p { font-size:13.5px; color:#8A7F70; line-height:1.65; margin-bottom:20px; }
        .card-meta { font-size:12px; color:#8A7F70; border-top:1px solid #E0D8C8; padding-top:14px; display:flex; justify-content:space-between; }
        .newsletter { background:#F5EDD8; border-top:1px solid #E0D8C8; text-align:center; padding:56px 40px; }
        .newsletter h2 { font-family:'Playfair Display',serif; font-size:32px; font-weight:700; margin-bottom:10px; }
        .newsletter p { font-size:15px; color:#8A7F70; margin-bottom:28px; }
        .nl-form { display:flex; max-width:420px; margin:0 auto; }
        .nl-form input { flex:1; background:#fff; border:1px solid #E0D8C8; border-right:none; padding:12px 18px; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; }
        .nl-form button { background:#1A1209; color:#FAF7F0; border:none; padding:12px 22px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; }
        .nl-form button:hover { background:#C4512A; }
        @media(max-width:700px){ .grid{grid-template-columns:1fr;} .hero{padding:48px 20px;} .section{padding:40px 20px;} }
      `}</style>

      <div className="home">
        <div className="hero">
          <div className="hero-tag">✦ The Modern Writers' Platform</div>
          <h1>Where <em>great</em> ideas<br />find their voice.</h1>
          <p>PenPal is a home for curious minds — writers and readers who believe one good idea can change everything.</p>
        </div>

        <div className="section">
          <div className="section-label">Latest Stories</div>
          <div className="grid">
            {posts.map(post => (
              <div key={post.id} className="card">
                <style>{`.card:nth-child(${post.id})::after { background: ${catColors[post.category]}; }`}</style>
                <span className="card-cat" style={{ color: catColors[post.category] }}>{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="card-meta">
                  <span>{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="newsletter">
          <h2>Never miss a story.</h2>
          <p>Weekly picks from editors, every Sunday morning.</p>
          <div className="nl-form">
            <input type="email" placeholder="your@email.com" />
            <button>Subscribe →</button>
          </div>
        </div>
      </div>
    </>
  )
}