import { Link, Outlet } from 'react-router-dom';

function AuthorDashboard() {
  return (
    <div className="flex">
      <nav className="w-1/4 bg-gray-100 h-screen p-5">
        <Link to="add-article" className="block p-2 bg-blue-500 text-white rounded">Add New Article</Link>
      </nav>
      <main className="w-3/4 p-5">
        <Outlet /> {/* This is where AddArticle will render */}
      </main>
    </div>
  );
}

export default AuthorDashboard;