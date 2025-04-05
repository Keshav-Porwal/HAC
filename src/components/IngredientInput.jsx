
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableUnits } from '../utils/conversionUtils';

const IngredientInput = () => {
  const [ingredients, setIngredients] = useState([{ 
    name: '', 
    quantity: '', 
    fromUnit: 'g', 
    toUnit: 'cup' 
  }]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const availableUnits = getAvailableUnits();
  
  // Flatten units for selection
  const allUnits = [
    ...availableUnits.weight,
    ...availableUnits.volume,
    ...availableUnits.count
  ];
  
  const handleInputChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
    setError('');
  };
  
  const addIngredientField = () => {
    setIngredients([
      ...ingredients, 
      { name: '', quantity: '', fromUnit: 'g', toUnit: 'cup' }
    ]);
  };
  
  const removeIngredientField = (index) => {
    if (ingredients.length > 1) {
      const updatedIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(updatedIngredients);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    const isValid = ingredients.every(ing => 
      ing.name.trim() !== '' && 
      ing.quantity !== '' && 
      !isNaN(ing.quantity) && 
      parseFloat(ing.quantity) > 0
    );
    
    if (!isValid) {
      setError('Please fill in all fields with valid values');
      return;
    }
    
    // Process and navigate with the data
    const formattedIngredients = ingredients.map(ing => ({
      ...ing,
      quantity: parseFloat(ing.quantity)
    }));
    
    navigate('/results', { state: { ingredients: formattedIngredients } });
  };
  
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--babyPink)' }}>Ingredient Conversion</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--lavender)' }}>
          Enter your ingredients and desired units
        </p>
      </header>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          {ingredients.map((ingredient, index) => (
            <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Ingredient {index + 1}</h3>
                {ingredients.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeIngredientField(index)}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: '#d32f2f',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor={`name-${index}`} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Ingredient Name
                </label>
                <input
                  type="text"
                  id={`name-${index}`}
                  className="input-field"
                  value={ingredient.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  placeholder="e.g., All-purpose flour"
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor={`quantity-${index}`} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  id={`quantity-${index}`}
                  className="input-field"
                  value={ingredient.quantity}
                  onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                  placeholder="e.g., 200"
                  min="0.01"
                  step="any"
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor={`fromUnit-${index}`} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    From Unit
                  </label>
                  <select
                    id={`fromUnit-${index}`}
                    className="select-field"
                    value={ingredient.fromUnit}
                    onChange={(e) => handleInputChange(index, 'fromUnit', e.target.value)}
                    required
                  >
                    {allUnits.map(unit => (
                      <option key={`from-${unit}`} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label htmlFor={`toUnit-${index}`} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    To Unit
                  </label>
                  <select
                    id={`toUnit-${index}`}
                    className="select-field"
                    value={ingredient.toUnit}
                    onChange={(e) => handleInputChange(index, 'toUnit', e.target.value)}
                    required
                  >
                    {allUnits.map(unit => (
                      <option key={`to-${unit}`} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          {error && (
            <div style={{ color: '#d32f2f', marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'rgba(211, 47, 47, 0.1)', borderRadius: '4px' }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              type="button" 
              className="btn" 
              onClick={addIngredientField}
              style={{ backgroundColor: 'var(--lavender)', flex: 1 }}
            >
              Add Another Ingredient
            </button>
            
            <button 
              type="submit" 
              className="btn"
              style={{ flex: 1 }}
            >
              Convert & Get Tips
            </button>
          </div>
          
          <button 
            type="button" 
            className="btn"
            onClick={() => navigate('/')}
            style={{ width: '100%', backgroundColor: 'var(--darkPurple)', color: 'white' }}
          >
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default IngredientInput;
