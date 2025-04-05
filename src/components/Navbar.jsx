
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav style={{
      backgroundColor: 'var(--darkPurple)',
      borderBottom: '1px solid var(--lavender)',
      padding: '1rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div>
          <Link to="/" style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: 'var(--babyPink)',
            textDecoration: 'none',
          }}>
            Bake Mate
          </Link>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1.5rem',
        }}>
          <Link to="/" style={{
            color: location.pathname === '/' ? 'var(--babyPink)' : 'var(--lavender)',
            textDecoration: 'none',
            position: 'relative',
            padding: '0.25rem 0',
            fontWeight: location.pathname === '/' ? 'bold' : 'normal',
          }}>
            Home
            {location.pathname === '/' && (
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                left: '0',
                width: '100%',
                height: '2px',
                backgroundColor: 'var(--babyPink)',
                borderRadius: '2px',
              }}></span>
            )}
          </Link>
          
          <Link to="/ingredient-input" style={{
            color: location.pathname === '/ingredient-input' ? 'var(--babyPink)' : 'var(--lavender)',
            textDecoration: 'none',
            position: 'relative',
            padding: '0.25rem 0',
            fontWeight: location.pathname === '/ingredient-input' ? 'bold' : 'normal',
          }}>
            Conversions
            {location.pathname === '/ingredient-input' && (
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                left: '0',
                width: '100%',
                height: '2px',
                backgroundColor: 'var(--babyPink)',
                borderRadius: '2px',
              }}></span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
