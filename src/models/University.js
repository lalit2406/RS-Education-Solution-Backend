import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  specialization: { type: String, default: 'General' },
  semesters: { type: Number },
  academicFeesPerSem: { type: Number },
  academicFeesYearly: { type: Number },
  examFeesPerSem: { type: Number },
  examFeesYearly: { type: Number },
  registrationFee: { type: Number },
  courseFeesPerYear: { type: Number },
  totalPerSem: { type: Number }
});

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  shortName: { type: String, required: true },
  logo: { type: String, default: null }, // Static file path or URL
  mode: { type: String, enum: ['Online', 'Distance'], required: true },
  coursesListSummary: { type: String, default: null }, // e.g., "MBA • MCA • BCA • BBA • B.Com"
  approvedBadges: [{ type: String }], // e.g., ["UGC Approved", "NAAC A+ Rated"]
  registrationNote: { type: String }, // e.g., "Rs. 1,000 Registration Fee — Non Refundable"
  pdfFile: {
  type: String,
  required: true
},
  courses: [courseSchema]
}, {
  timestamps: true
});

const University = mongoose.model('University', universitySchema);

export default University;
