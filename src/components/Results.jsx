
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertQuantity, formatConvertedValue, scaleQuantity } from '../utils/conversionUtils';
import { getBakingTipsAndSubstitutions } from '../api/geminiApi';
import { saveConversion } from '../api/mongoService';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [conversionResults, setConversionResults] = useState([]);
  const [servingFactor, setServingFactor] = useState(1);
  const [tips, setTips] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const processIngredients = async () => {
      if (!location.state?.ingredients) {
        navigate('/ingredient-input');
        return;
      }
      
      const ingredients = location.state.ingredients;
      
      // Process conversions
      const results = ingredients.map(ing => {
        const convertedValue = convertQuantity(
          ing.name,
          ing.quantity,
          ing.fromUnit,
          ing.toUnit
        );
        
        return {
          ...ing,
          convertedValue: formatConvertedValue(convertedValue)
        };
      });
      
      setConversionResults(results);
      
      // Get tips and substitutions for each ingredient
      const tipsPromises = ingredients.map(ing => 
        getBakingTipsAndSubstitutions(ing.name, ing.quantity, ing.fromUnit, ing.toUnit)
      );
      
      const tipsResults = await Promise.all(tipsPromises);
      
      // Create object with ingredient names as keys
      const tipsMap = {};
      ingredients.forEach((ing, index) => {
        tipsMap[ing.name] = tipsResults[index];
      });
      
      setTips(tipsMap);
      setIsLoading(false);
      
      // Save conversion to history
      await saveConversion({
        ingredients: results,
        tips: tipsMap
      });
    };
    
    processIngredients();
  }, [location.state, navigate]);
  
  const handleServingChange = (e) => {
    const factor = parseFloat(e.target.value);
    setServingFactor(factor);
  };
  
  if (isLoading) {
    return (
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
        <div className="card">
          <h2>Processing your ingredients...</h2>
          <p style={{ marginTop: '1rem' }}>Getting conversions and baking tips...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--babyPink)' }}>Conversion Results</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--lavender)' }}>
          Your ingredients with conversions and baking tips
        </p>
      </header>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Adjust Serving Size</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <label htmlFor="servingFactor" style={{ fontWeight: 'bold', minWidth: '80px' }}>
            Scale by:
          </label>
          <input
            type="range"
            id="servingFactor"
            min="0.25"
            max="4"
            step="0.25"
            value={servingFactor}
            onChange={handleServingChange}
            style={{ flex: 1 }}
          />
          <span style={{ minWidth: '60px', textAlign: 'center', fontWeight: 'bold' }}>
            {servingFactor}x
          </span>
        </div>
        
        <div style={{ backgroundColor: 'var(--lavender)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
          {servingFactor < 1 
            ? `Reducing recipe to ${servingFactor * 100}% of original`
            : servingFactor === 1 
              ? 'Original recipe size' 
              : `Scaling recipe to ${servingFactor}x the original`
          }
        </div>
      </div>
      
      <div className="section" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Converted Ingredients</h2>
        {conversionResults.map((ing, index) => (
          <div key={index} style={{ 
            marginBottom: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'rgba(255,255,255,0.7)', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '0.75rem', color: '#333' }}>
              {ing.name}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Original:</span>
                <strong>{ing.quantity} {ing.fromUnit}</strong>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Converted:</span>
                <strong>{ing.convertedValue} {ing.toUnit}</strong>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Adjusted ({servingFactor}x):</span>
                <strong>
                  {scaleQuantity(ing.quantity, servingFactor)} {ing.fromUnit} ➔ {" "}
                  {scaleQuantity(ing.convertedValue, servingFactor)} {ing.toUnit}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="section" style={{ backgroundColor: 'var(--babyPink)', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Baking Tips & Substitutions</h2>
        
        {Object.entries(tips).map(([ingredient, data], index) => (
          <div key={index} style={{ 
            marginBottom: index < Object.keys(tips).length - 1 ? '2rem' : 0,
            padding: '1rem', 
            backgroundColor: 'rgba(255,255,255,0.7)', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>
              For {ingredient}:
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Tips:</h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {data.tips.map((tip, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{tip}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Substitutions:</h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {data.substitutions.map((sub, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <strong>{sub.name}</strong> - {sub.ratio}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          className="btn"
          onClick={() => navigate('/ingredient-input')}
          style={{ flex: 1, backgroundColor: 'var(--lavender)' }}
        >
          Back to Ingredients
        </button>
        
        <button 
          className="btn"
          onClick={() => navigate('/')}
          style={{ flex: 1 }}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Results;
