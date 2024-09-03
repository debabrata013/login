const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lastRefuelingStopSchema = new Schema({
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const efficiencyInsightsSchema = new Schema({
  mileage: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  rating: {
    type: String,
    required: true
  }
});

const fuelManagementSchema = new Schema({
  fuelConsumption: {
    type: Number,
    required: true
  },
  lastRefuelingStop: {
    type: lastRefuelingStopSchema,
    required: true
  },
  efficiencyInsights: {
    type: efficiencyInsightsSchema,
    required: true
  }
});

module.exports = mongoose.model('FuelManagement', fuelManagementSchema);