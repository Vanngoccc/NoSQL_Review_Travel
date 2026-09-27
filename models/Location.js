const mongoose = require('mongoose');

// Schema cho mảng review lồng nhau
const reviewSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Schema chính cho Location
const locationSchema = new mongoose.Schema({
  custom_id: { type: Number },
  name: { type: String, required: true },
  category: { type: String },
  city: { type: String, required: true },
  // Cấu trúc GeoJSON 2dsphere chuẩn MongoDB
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [Longitude, Latitude]
  },
  rating_avg: { type: Number, default: 0 },
  total_reviews: { type: Number, default: 0 },
  reviews: [reviewSchema]
}, { timestamps: true });

// Đánh Geospatial Index cho SV2
locationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);