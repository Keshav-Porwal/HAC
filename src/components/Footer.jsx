
import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--darkPurple)',
      borderTop: '1px solid var(--lavender)',
      padding: '1.5rem 1rem',
      marginTop: '2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <h3 style={{
          color: 'var(--babyPink)',
          fontFamily: 'Poppins, sans-serif',
          marginBottom: '1rem',
        }}>
          Bake Mate
        </h3>
        
        <p style={{
          color: 'var(--lavender)',
          maxWidth: '500px',
          margin: '0 auto 1rem',
          lineHeight: 1.6,
        }}>
          Your baking assistant for accurate conversions, smart tips, and ingredient substitutions.
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '1.5rem',
        }}>
          <div>
            <h4 style={{ color: 'var(--babyPink)', marginBottom: '0.5rem' }}>Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'center' }}>
              <li style={{ color: 'var(--lavender)', margin: '0.25rem 0' }}>Ingredient Conversion</li>
              <li style={{ color: 'var(--lavender)', margin: '0.25rem 0' }}>AI Baking Tips</li>
              <li style={{ color: 'var(--lavender)', margin: '0.25rem 0' }}>Substitution Ideas</li>
              <li style={{ color: 'var(--lavender)', margin: '0.25rem 0' }}>Serving Size Adjustment</li>
            </ul>
          </div>
        </div>
        
        <small style={{
          color: 'var(--lavender)',
          opacity: 0.8,
        }}>
          © {new Date().getFullYear()} Bake Mate. All conversions are approximate.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
