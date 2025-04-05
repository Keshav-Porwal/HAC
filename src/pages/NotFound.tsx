
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--babyPink)', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', color: 'var(--lavender)', marginBottom: '2rem' }}>
        Oops! We couldn't find the page you're looking for.
      </p>
      <p style={{ color: 'white', marginBottom: '2rem', textAlign: 'center', maxWidth: '500px' }}>
        Maybe the recipe you're looking for has been moved or doesn't exist.
      </p>
      <a 
        href="/" 
        style={{
          backgroundColor: 'var(--babyPink)',
          color: '#333',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        Back to Home
      </a>
    </div>
  );
};

export default NotFound;
