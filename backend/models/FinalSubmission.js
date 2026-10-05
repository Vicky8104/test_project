// models/FinalSubmission.js
import mongoose from "mongoose";

const finalSubmissionSchema = new mongoose.Schema({
  selectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Selections",
  },
  name: String,
  fatherName: String,
  dob: String,
  gender: String,
  maritalStatus: String,
  homeDistrict: String,
  category: String,
  employeeId: {
  type: String,
  required: true,
  uppercase: true,
  trim: true,
},
  mobile: String,
  ifOther: String,
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
  },
 
  post: String,
  area: String,
  subject: String,
  rollNo: String,
  meritNo: String,
  selCategory: String,
  splCategory: String,



  choices: [String],

  pdfUrl: String,

  status: {
    type: String,
    default: "submitted",
  },
}, { timestamps: true });

finalSubmissionSchema.index(
  {
    employeeId: 1,
    post: 1,
    area: 1,
    subject: 1,
  },
  {
    unique: true,
  }
);


export default mongoose.model("FinalSubmission", finalSubmissionSchema);
