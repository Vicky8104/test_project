import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  post: String,
  area: String,
  subject: String,
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });


// INDEX
configSchema.index({
  post: 1,
  area: 1,
  subject: 1
});


export default mongoose.model("CounselingConfig", configSchema);
