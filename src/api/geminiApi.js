
// This file handles all interactions with the Google Gemini API

// Replace with your API key when deploying
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Function to get ingredient suggestions based on what the user is baking
export const getIngredientSuggestions = async (bakingItem) => {
  try {
    // For development, return mock data
    if (!GEMINI_API_KEY || GEMINI_API_KEY === process.env.GEMINI_API_KEY || "") {
      console.log("Using mock data - no API key provided");
      return getMockIngredients(bakingItem);
    }

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
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Find and parse the JSON array from the text response
    const jsonMatch = textResponse.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Could not parse ingredient list from API response");
  } catch (error) {
    console.error("Error fetching ingredient suggestions:", error);
    return getMockIngredients(bakingItem);
  }
};

// Function to get baking tips and substitutions
export const getBakingTipsAndSubstitutions = async (ingredient, quantity, fromUnit, toUnit) => {
  try {
    // For development, return mock data
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
      console.log("Using mock data - no API key provided");
      return getMockTipsAndSubstitutions(ingredient);
    }

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
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Find and parse the JSON object from the text response
    const jsonMatch = textResponse.match(/{.*}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Could not parse tips and substitutions from API response");
  } catch (error) {
    console.error("Error fetching baking tips and substitutions:", error);
    return getMockTipsAndSubstitutions(ingredient);
  }
};

// Mock data for development
const getMockIngredients = (bakingItem) => {
  const mockData = {
    "chocolate chip cookies": [
      { name: "all-purpose flour", quantity: 280, unit: "g" },
      { name: "baking soda", quantity: 1, unit: "tsp" },
      { name: "salt", quantity: 1, unit: "tsp" },
      { name: "butter", quantity: 225, unit: "g" },
      { name: "brown sugar", quantity: 200, unit: "g" },
      { name: "white sugar", quantity: 100, unit: "g" },
      { name: "vanilla extract", quantity: 2, unit: "tsp" },
      { name: "eggs", quantity: 2, unit: "whole" },
      { name: "chocolate chips", quantity: 350, unit: "g" }
    ],
    "banana bread": [
      { name: "ripe bananas", quantity: 3, unit: "whole" },
      { name: "all-purpose flour", quantity: 250, unit: "g" },
      { name: "baking soda", quantity: 1, unit: "tsp" },
      { name: "salt", quantity: 0.5, unit: "tsp" },
      { name: "butter", quantity: 113, unit: "g" },
      { name: "brown sugar", quantity: 150, unit: "g" },
      { name: "eggs", quantity: 2, unit: "whole" },
      { name: "vanilla extract", quantity: 1, unit: "tsp" }
    ],
    "vanilla cake": [
      { name: "all-purpose flour", quantity: 350, unit: "g" },
      { name: "baking powder", quantity: 3, unit: "tsp" },
      { name: "salt", quantity: 0.5, unit: "tsp" },
      { name: "butter", quantity: 170, unit: "g" },
      { name: "sugar", quantity: 300, unit: "g" },
      { name: "eggs", quantity: 3, unit: "whole" },
      { name: "vanilla extract", quantity: 2, unit: "tsp" },
      { name: "milk", quantity: 240, unit: "ml" }
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
      tips: [
        "For the most accurate measurements, weigh flour instead of using measuring cups.",
        "Don't overwork the dough when mixing to avoid tough baked goods.",
        "Store flour in an airtight container to prevent it from absorbing moisture and odors."
      ],
      substitutions: [
        { name: "Almond flour", ratio: "1:1 (note: may change texture)" },
        { name: "Oat flour", ratio: "1:1 (note: may need more binding agent)" }
      ]
    },
    "butter": {
      tips: [
        "Use room temperature butter for creaming with sugar for the best texture.",
        "Cold butter is better for flaky pastries and pie crusts.",
        "Unsalted butter gives you more control over the salt content in recipes."
      ],
      substitutions: [
        { name: "Coconut oil", ratio: "1:1" },
        { name: "Applesauce", ratio: "1:0.5 (use half as much)" }
      ]
    },
    "eggs": {
      tips: [
        "Room temperature eggs incorporate better into batters.",
        "Separate eggs when cold, but use them at room temperature.",
        "One large egg equals about 50g or 3.25 tablespoons."
      ],
      substitutions: [
        { name: "Flax egg (1 tbsp ground flax + 3 tbsp water)", ratio: "1:1" },
        { name: "Applesauce", ratio: "1:4 (4 tbsp per egg)" }
      ]
    }
  };

  // Convert ingredient to lowercase and just use the first word
  const ingredientKey = ingredient.toLowerCase().split(' ')[0];
  
  // Return specific ingredient tips or default
  return mockData[ingredientKey] || {
    tips: [
      "Always measure ingredients precisely for consistent results.",
      "Read the entire recipe before starting to bake.",
      "Preheat your oven for at least 10 minutes before baking."
    ],
    substitutions: [
      { name: "Check a specialized baking substitution chart", ratio: "varies" },
      { name: "Search online for specific substitutions", ratio: "varies" }
    ]
  };
};
