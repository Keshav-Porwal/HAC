
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIngredientSuggestions } from '../api/geminiApi';

// Baking tips for the home page
const BAKING_TIPS = [
  "Room temperature eggs incorporate better into batters than cold ones.",
  "Weighing ingredients provides more consistent results than using measuring cups.",
  "Let your dough rest in the refrigerator to develop deeper flavors.",
  "Always preheat your oven at least 10-15 minutes before baking.",
  "For flaky pastry, keep your ingredients and tools as cold as possible.",
  "Don't overmix your batter - stop when ingredients are just combined.",
  "Use light-colored baking sheets to prevent over-browning on the bottom.",
  "Rotate your pans halfway through baking for even cooking."
];

const Home = () => {
  const [bakingItem, setBakingItem] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [randomTips, setRandomTips] = useState([]);
  const navigate = useNavigate();
  
  // Get random baking tips on component mount
  useEffect(() => {
    // Select 3 random tips for display
    const shuffled = [...BAKING_TIPS].sort(() => 0.5 - Math.random());
    setRandomTips(shuffled.slice(0, 3));
  }, []);
  
  const handleInputChange = (e) => {
    setBakingItem(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bakingItem.trim()) return;
    
    setIsLoading(true);
    try {
      const ingredients = await getIngredientSuggestions(bakingItem);
      setSuggestions(ingredients);
    } catch (error) {
      console.error("Error getting suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddIngredients = () => {
    navigate('/ingredient-input');
  };
  
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--babyPink)' }}>Bake Mate</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--lavender)' }}>Your smart baking assistant</p>
      </header>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>What are you baking today?</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            className="input-field"
            value={bakingItem}
            onChange={handleInputChange}
            placeholder="e.g., Chocolate chip cookies, Banana bread..."
            style={{ marginBottom: '1rem' }}
          />
          <button 
            type="submit" 
            className="btn"
            disabled={isLoading}
            style={{ marginRight: '1rem' }}
          >
            {isLoading ? "Getting suggestions..." : "Get Ingredients"}
          </button>
          <button 
            type="button" 
            className="btn"
            onClick={handleAddIngredients}
            style={{ backgroundColor: 'var(--lavender)' }}
          >
            Add My Own Ingredients
          </button>
        </form>
      </div>
      
      {suggestions.length > 0 && (
        <div className="section" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#333' }}>Suggested Ingredients for {bakingItem}</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {suggestions.map((item, index) => (
              <li key={index} style={{ margin: '0.5rem 0', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                <strong>{item.name}:</strong> {item.quantity} {item.unit}
              </li>
            ))}
          </ul>
          <button 
            className="btn" 
            onClick={handleAddIngredients} 
            style={{ marginTop: '1rem' }}
          >
            Convert & Get Tips
          </button>
        </div>
      )}
      
      <div className="section" style={{ backgroundColor: 'var(--babyPink)', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Baking Tips</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {randomTips.map((tip, index) => (
            <li key={index} style={{ margin: '0.5rem 0', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
              {tip}
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--lavender)' }}>
        <p>Bake with confidence and precision!</p>
        <small style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--babyPink)' }}>
          All conversions are approximate and may vary by ingredient.
        </small>
      </div>
    </div>
  );
};

export default Home;
