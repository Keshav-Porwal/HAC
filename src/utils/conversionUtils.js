
// Conversion rates for common baking ingredients
// These are approximate conversions as densities vary by ingredients

// Base units: g, ml, cup, tbsp, tsp
const conversionRates = {
  // Weight to volume for common ingredients (g to cups)
  weightToVolume: {
    "all-purpose flour": 0.008, // 1g = 0.008 cups (125g = 1 cup)
    "bread flour": 0.008,       // 1g = 0.008 cups (125g = 1 cup)
    "cake flour": 0.0087,       // 1g = 0.0087 cups (115g = 1 cup)
    "sugar": 0.0047,            // 1g = 0.0047 cups (210g = 1 cup)
    "brown sugar": 0.0046,      // 1g = 0.0046 cups (220g = 1 cup)
    "powdered sugar": 0.0083,   // 1g = 0.0083 cups (120g = 1 cup)
    "butter": 0.0044,           // 1g = 0.0044 cups (225g = 1 cup)
    "cocoa powder": 0.0085,     // 1g = 0.0085 cups (118g = 1 cup)
    "salt": 0.0051,             // 1g = 0.0051 cups (195g = 1 cup)
    "baking powder": 0.0049,    // 1g = 0.0049 cups (205g = 1 cup)
    "baking soda": 0.0049,      // 1g = 0.0049 cups (205g = 1 cup)
    // Default for other ingredients
    "default": 0.0042            // 1g = 0.0042 cups (approximate)
  },
  
  // Standard conversions
  volume: {
    // Teaspoon to other units
    "tsp_to_tbsp": 1/3,         // 1 tsp = 0.333 tbsp
    "tsp_to_cup": 1/48,         // 1 tsp = 0.0208 cup
    "tsp_to_ml": 5,             // 1 tsp = 5 ml
    
    // Tablespoon to other units
    "tbsp_to_tsp": 3,           // 1 tbsp = 3 tsp
    "tbsp_to_cup": 1/16,        // 1 tbsp = 0.0625 cup
    "tbsp_to_ml": 15,           // 1 tbsp = 15 ml
    
    // Cup to other units
    "cup_to_tsp": 48,           // 1 cup = 48 tsp
    "cup_to_tbsp": 16,          // 1 cup = 16 tbsp
    "cup_to_ml": 240,           // 1 cup = 240 ml
    
    // Milliliter to other units
    "ml_to_tsp": 1/5,           // 1 ml = 0.2 tsp
    "ml_to_tbsp": 1/15,         // 1 ml = 0.067 tbsp
    "ml_to_cup": 1/240          // 1 ml = 0.00417 cup
  },
  
  // Weight conversions
  weight: {
    "g_to_oz": 0.035,           // 1 g = 0.035 oz
    "oz_to_g": 28.35,           // 1 oz = 28.35 g
    "g_to_lb": 0.0022,          // 1 g = 0.0022 lb
    "lb_to_g": 453.59           // 1 lb = 453.59 g
  }
};

// Special conversions for common ingredients with count units
const countConversions = {
  "egg": {
    "whole_to_g": 50,           // 1 egg ≈ 50g
    "whole_to_cup": 0.25,       // 1 egg ≈ 1/4 cup
    "whole_to_tbsp": 4          // 1 egg ≈ 4 tbsp
  },
  "banana": {
    "whole_to_g": 120,          // 1 medium banana ≈ 120g
    "whole_to_cup": 0.5         // 1 medium banana ≈ 1/2 cup mashed
  }
};

/**
 * Convert ingredient quantity from one unit to another
 * @param {string} ingredient - Ingredient name
 * @param {number} quantity - Amount to convert
 * @param {string} fromUnit - Source unit (g, cup, tbsp, tsp, ml, whole)
 * @param {string} toUnit - Target unit (g, cup, tbsp, tsp, ml, whole)
 * @returns {number} - Converted quantity
 */
export const convertQuantity = (ingredient, quantity, fromUnit, toUnit) => {
  // If units are the same, no conversion needed
  if (fromUnit === toUnit) {
    return quantity;
  }
  
  // Normalize ingredient name
  const ingredientLower = ingredient.toLowerCase();
  
  // Handle count-based ingredients (eggs, bananas)
  if (fromUnit === "whole" || toUnit === "whole") {
    for (const [item, conversions] of Object.entries(countConversions)) {
      if (ingredientLower.includes(item)) {
        // Convert from 'whole' to another unit
        if (fromUnit === "whole" && conversions[`whole_to_${toUnit}`]) {
          return quantity * conversions[`whole_to_${toUnit}`];
        }
        // Convert from another unit to 'whole' 
        if (toUnit === "whole" && conversions[`whole_to_${fromUnit}`]) {
          return quantity / conversions[`whole_to_${fromUnit}`];
        }
      }
    }
  }
  
  // Weight to volume conversion (g to cup, tbsp, tsp)
  if (fromUnit === "g" && ["cup", "tbsp", "tsp"].includes(toUnit)) {
    // Find the specific conversion rate or use default
    let conversionRate;
    for (const [item, rate] of Object.entries(conversionRates.weightToVolume)) {
      if (ingredientLower.includes(item)) {
        conversionRate = rate;
        break;
      }
    }
    
    // Use default if no specific rate found
    conversionRate = conversionRate || conversionRates.weightToVolume.default;
    
    // Convert to cups first
    let cups = quantity * conversionRate;
    
    // Convert cups to target unit if needed
    if (toUnit === "cup") {
      return cups;
    } else if (toUnit === "tbsp") {
      return cups * conversionRates.volume.cup_to_tbsp;
    } else if (toUnit === "tsp") {
      return cups * conversionRates.volume.cup_to_tsp;
    }
  }
  
  // Volume to weight conversion (cup, tbsp, tsp to g)
  if (["cup", "tbsp", "tsp"].includes(fromUnit) && toUnit === "g") {
    // Find the specific conversion rate or use default
    let conversionRate;
    for (const [item, rate] of Object.entries(conversionRates.weightToVolume)) {
      if (ingredientLower.includes(item)) {
        conversionRate = rate;
        break;
      }
    }
    
    // Use default if no specific rate found
    conversionRate = conversionRate || conversionRates.weightToVolume.default;
    
    // Convert to cups first if needed
    let cups = quantity;
    if (fromUnit === "tbsp") {
      cups = quantity * conversionRates.volume.tbsp_to_cup;
    } else if (fromUnit === "tsp") {
      cups = quantity * conversionRates.volume.tsp_to_cup;
    }
    
    // Convert cups to grams
    return cups / conversionRate;
  }
  
  // Volume to volume conversions
  if (["cup", "tbsp", "tsp", "ml"].includes(fromUnit) && ["cup", "tbsp", "tsp", "ml"].includes(toUnit)) {
    // Convert to ml as base unit
    let valueInMl;
    if (fromUnit === "cup") {
      valueInMl = quantity * conversionRates.volume.cup_to_ml;
    } else if (fromUnit === "tbsp") {
      valueInMl = quantity * conversionRates.volume.tbsp_to_ml;
    } else if (fromUnit === "tsp") {
      valueInMl = quantity * conversionRates.volume.tsp_to_ml;
    } else {
      valueInMl = quantity; // Already in ml
    }
    
    // Convert from ml to target unit
    if (toUnit === "ml") {
      return valueInMl;
    } else if (toUnit === "cup") {
      return valueInMl * conversionRates.volume.ml_to_cup;
    } else if (toUnit === "tbsp") {
      return valueInMl * conversionRates.volume.ml_to_tbsp;
    } else if (toUnit === "tsp") {
      return valueInMl * conversionRates.volume.ml_to_tsp;
    }
  }
  
  // Weight to weight conversions
  if (["g", "oz", "lb"].includes(fromUnit) && ["g", "oz", "lb"].includes(toUnit)) {
    // Convert to g as base unit
    let valueInG;
    if (fromUnit === "oz") {
      valueInG = quantity * conversionRates.weight.oz_to_g;
    } else if (fromUnit === "lb") {
      valueInG = quantity * conversionRates.weight.lb_to_g;
    } else {
      valueInG = quantity; // Already in g
    }
    
    // Convert from g to target unit
    if (toUnit === "g") {
      return valueInG;
    } else if (toUnit === "oz") {
      return valueInG * conversionRates.weight.g_to_oz;
    } else if (toUnit === "lb") {
      return valueInG * conversionRates.weight.g_to_lb;
    }
  }
  
  // If conversion not handled, return original quantity
  console.warn(`Conversion from ${fromUnit} to ${toUnit} for ${ingredient} not supported`);
  return quantity;
};

/**
 * Format the converted value to a reasonable number of decimal places
 * @param {number} value - The value to format
 * @returns {number} - Formatted value
 */
export const formatConvertedValue = (value) => {
  if (value < 0.1) {
    return parseFloat(value.toFixed(3)); // For very small values
  } else if (value < 1) {
    return parseFloat(value.toFixed(2)); // For values < 1
  } else if (value < 10) {
    return parseFloat(value.toFixed(1)); // For values < 10
  } else {
    return Math.round(value); // For values >= 10
  }
};

/**
 * Get available units for conversion
 * @returns {object} Object with unit categories and arrays of units
 */
export const getAvailableUnits = () => {
  return {
    weight: ["g", "oz", "lb"],
    volume: ["cup", "tbsp", "tsp", "ml"],
    count: ["whole"]
  };
};

/**
 * Scale ingredient quantity by a factor
 * @param {number} quantity - Original quantity
 * @param {number} factor - Scale factor (e.g., 2 to double)
 * @returns {number} - Scaled quantity
 */
export const scaleQuantity = (quantity, factor) => {
  return formatConvertedValue(quantity * factor);
};
