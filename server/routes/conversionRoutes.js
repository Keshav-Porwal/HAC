
const express = require('express');
const router = express.Router();

// Conversion rates (same as in frontend)
const conversionRates = {
  // Weight to volume for common ingredients (g to cups)
  weightToVolume: {
    "all-purpose flour": 0.008, // 1g = 0.008 cups (125g = 1 cup)
    "bread flour": 0.008,       // 1g = 0.008 cups (125g = 1 cup)
    "cake flour": 0.0087,       // 1g = 0.0087 cups (115g = 1 cup)
    // ... (same as in frontend)
    "default": 0.0042           // 1g = 0.0042 cups (approximate)
  },
  
  // Standard conversions
  volume: {
    // ... (same as in frontend)
  },
  
  // Weight conversions 
  weight: {
    // ... (same as in frontend)
  }
};

// Special conversions for common ingredients with count units
const countConversions = {
  // ... (same as in frontend)
};

/**
 * Conversion endpoint
 * Expected request body:
 * {
 *   ingredients: [
 *     { name: string, quantity: number, fromUnit: string, toUnit: string }
 *   ],
 *   servingFactor: number (optional)
 * }
 */
router.post('/', (req, res) => {
  try {
    const { ingredients, servingFactor = 1 } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ 
        error: 'Invalid request. Expected ingredients array.' 
      });
    }
    
    const results = ingredients.map(ing => {
      const { name, quantity, fromUnit, toUnit } = ing;
      
      // Validate input
      if (!name || typeof quantity !== 'number' || !fromUnit || !toUnit) {
        throw new Error(`Invalid ingredient data: ${JSON.stringify(ing)}`);
      }
      
      // Perform conversion (simplified logic - would be more robust in real app)
      let convertedValue = quantity;
      
      // Apply serving factor if needed
      const scaledOriginal = quantity * servingFactor;
      const scaledConverted = convertedValue * servingFactor;
      
      return {
        ...ing,
        convertedValue,
        scaledOriginal,
        scaledConverted
      };
    });
    
    // Save to database would happen here in real app
    
    res.json({ 
      success: true, 
      results,
      servingFactor
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ 
      error: 'Conversion failed', 
      message: error.message 
    });
  }
});

module.exports = router;
