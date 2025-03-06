const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  year: { type: Number, required: true },
  financial: { type: String, enum: ['PKR', 'EURO', 'DOLLAR'], required: true },
  type: { type: String, enum: ['Humanitarian', 'Development'], required: true },
  sdg: { type: [String], required: true },
  sector_sdg: { type: [String], required: true },
  province: { type: [String], required: true },
  district: { type: [String], required: true },
  beneficiaries: {
    total_target_benef: { type: Number, default: 0 },
    menAbove18: { type: Number, default: 0 },
    womenAbove18: { type: Number, default: 0 },
    childrenBelow18: { type: Number, default: 0 },
    disable_beneficiaries: { type: Number, default: 0 },
    transgender_beneficiaries: { type: Number, default: 0 },
    refugee_beneficiaries: { type: Number, default: 0 },
    displaced_beneficiaries: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['Ongoing', 'Completed'], required: true },
  projectDuration: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  interventions: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema); 