
const express = require('express');
const router = express.Router();

// Replace with your Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";

/**
 * Endpoint to get ingredient suggestions
 * Expected request body: { bakingItem: string }
 */
router.post('/suggestions', async (req, res) => {
  try {
    const { bakingItem } = req.body;
    
    if (!bakingItem) {
      return res.status(400).json({ error: 'Missing bakingItem parameter' });
    }
    
    // If no API key, return mock data
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
      return res.json({ 
        source: 'mock',
        suggestions: getMockIngredients(bakingItem)
      });
    }
    
    // Call Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a professional baker's assistant. Please provide a list of ingredients needed for ${bakingItem}. Format the response as a JSON array of objects with 'name', 'quantity', and 'unit' properties. Example: [{"name": "flour", "quantity": 200, "unit": "g"}, {"name": "sugar", "quantity": 100, "unit": "g"}]`
          }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]) {
      throw new Error('Invalid API response');
    }
    
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Find and parse the JSON array from the text response
    const jsonMatch = textResponse.match(/\[.*\]/s);
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      return res.json({ 
        source: 'gemini',
        suggestions 
      });
    }
    
    throw new Error('Could not parse ingredient list from API response');
  } catch (error) {
    console.error('Error getting suggestions:', error);
    
    // Fallback to mock data
    res.json({ 
      source: 'mock (fallback)',
      error: error.message,
      suggestions: getMockIngredients(req.body.bakingItem || 'cookies')
    });
  }
});

/**
 * Endpoint to get baking tips and substitutions
 * Expected request body: { ingredient: string }
 */
router.post('/tips', async (req, res) => {
  try {
    const { ingredient } = req.body;
    
    if (!ingredient) {
      return res.status(400).json({ error: 'Missing ingredient parameter' });
    }
    
    // If no API key, return mock data
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
      return res.json({ 
        source: 'mock',
        data: getMockTipsAndSubstitutions(ingredient)
      });
    }
    
    // Call Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a professional baker's assistant. Provide 3 baking tips for using ${ingredient} and 2 possible substitutions for ${ingredient}. Format the response as a JSON object with 'tips' (array) and 'substitutions' (array) properties. Example: {"tips": ["Tip 1", "Tip 2", "Tip 3"], "substitutions": [{"name": "alt ingredient 1", "ratio": "1:1"}, {"name": "alt ingredient 2", "ratio": "2:1"}]}`
          }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]) {
      throw new Error('Invalid API response');
    }
    
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Find and parse the JSON object from the text response
    const jsonMatch = textResponse.match(/{.*}/s);
    if (jsonMatch) {
      const tips = JSON.parse(jsonMatch[0]);
      return res.json({ 
        source: 'gemini',
        data: tips
      });
    }
    
    throw new Error('Could not parse tips and substitutions from API response');
  } catch (error) {
    console.error('Error getting tips:', error);
    
    // Fallback to mock data
    res.json({ 
      source: 'mock (fallback)',
      error: error.message,
      data: getMockTipsAndSubstitutions(req.body.ingredient || 'flour')
    });
  }
});

// Mock data for development/fallback (same as in frontend)
const getMockIngredients = (bakingItem) => {
  const mockData = {
    "chocolate chip cookies": [
      { name: "all-purpose flour", quantity: 280, unit: "g" },
      { name: "baking soda", quantity: 1, unit: "tsp" },
      // ... (same as in frontend)
    ],
    "banana bread": [
      // ... (same as in frontend)
    ],
    "vanilla cake": [
      // ... (same as in frontend)
    ]
  };

  // Default to chocolate chip cookies if no match found
  const lowercaseBakingItem = bakingItem.toLowerCase();
  const itemKey = Object.keys(mockData).find(key => lowercaseBakingItem.includes(key));
  return itemKey ? mockData[itemKey] : mockData["chocolate chip cookies"];
};

const getMockTipsAndSubstitutions = (ingredient) => {
  const mockData = {
    "flour": {
      // ... (same as in frontend)
    },
    "butter": {
      // ... (same as in frontend)
    },
    "eggs": {
      // ... (same as in frontend)
    }
  };

  // Convert ingredient to lowercase and just use the first word
  const ingredientKey = ingredient.toLowerCase().split(' ')[0];
  
  // Return specific ingredient tips or default
  return mockData[ingredientKey] || {
    // ... (same as in frontend)
  };
};

module.exports = router;
