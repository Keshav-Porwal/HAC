
// Placeholder for MongoDB service

// Replace with your MongoDB URI when deploying
const MONGODB_URI = "YOUR_MONGODB_URI";

// This service will handle connections to MongoDB for storing:
// - User recipes
// - Conversion history
// - Frequently used ingredients

export const saveConversion = async (conversionData) => {
  // Placeholder - In a real app, this would save to MongoDB
  console.log("Would save to MongoDB:", conversionData);
  console.log("MongoDB URI:", MONGODB_URI);
  
  // For now, we'll just store in localStorage as a demo
  try {
    const history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
    history.push({
      ...conversionData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("conversionHistory", JSON.stringify(history));
    return { success: true };
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return { success: false, error: error.message };
  }
};

export const getConversionHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("conversionHistory")) || [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};
