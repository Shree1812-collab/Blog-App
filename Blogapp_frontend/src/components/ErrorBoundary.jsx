import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();

  console.error(error);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '3rem', color: '#ff4d4f' }}>Oops!</h1>
      <p style={{ fontSize: '1.5rem' }}>Something went wrong here.</p>
      
      <p style={{ color: '#666' }}>
        <i>{error.statusText || error.message}</i>
      </p>

      <div style={{ marginTop: '30px' }}>
  
        <p>
          Don't worry, you can always {" "}
          <Link to="/" style={{ color: '#1890ff', textDecoration: 'underline' }}>
            Go back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}