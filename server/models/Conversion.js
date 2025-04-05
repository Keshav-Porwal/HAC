
const mongoose = require('mongoose');

const ConversionSchema = new mongoose.Schema({
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true
    },
    fromUnit: {
      type: String,
      required: true
    },
    toUnit: {
      type: String,
      required: true
    },
    convertedValue: {
      type: Number,
      required: true
    }
  }],
  tips: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Conversion', ConversionSchema);
