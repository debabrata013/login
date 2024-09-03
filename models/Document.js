const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filePath: { type: String, required: true },
  email:{type:String , required :true},
  status: { type: String, enum: ['Processing', 'Verified'], default: 'Processing' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
