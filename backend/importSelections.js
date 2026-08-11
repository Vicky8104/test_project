const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const Selection = require("./models/Selections.js");
const User = require("./models/User.js");
const Candidate = require("./models/Candidate.js");


const startImport = async () => {
  try {
    // 🔥 DB connect
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected ✅");

    const results = [];

    // 🔥 CSV read
    fs.createReadStream("selections.csv")
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        console.log("CSV Loaded ✅");

        for (let row of results) {
          try {
            // 🔥 1. Candidate find by email
             const user = await User.findOne({ employeeId: row.employeeId });
            const candidate = await Candidate.findOne({
              employeeId: row.employeeId,
            });
            console.log("CSV EmployeeId:", row.employeeId);
            if (!candidate) {
              console.log("❌ Candidate not found:", row.employeeId);
              continue;
            }

            // 🔥 2. Team find by teamNumber
            // const teamUser = await User.findOne({
            //   teamNumber: Number(row.teamNumber),
            // });
              
            // if (!teamUser) {
            //   console.log("❌ Team not found:", row.teamNumber);
            //   continue;
            // }

            // 🔥 3. Duplicate check (optional but important)
            const alreadyExists = await Selection.findOne({
                candidateId: candidate._id,
                subject: row.subject,
                post: row.post,
                area:row.area,
                // shift:row.shift,
                // dvDate:row.dvDate,
            });

            if (alreadyExists) {
              console.log("⚠️ Already exists:", row.employeeId, row.subject);
              continue;
            }

            // 🔥 4. Insert Selection
            await Selection.create({
              userId: user._id,
              candidateId: candidate._id,
              employeeId:row.employeeId,
              name:row.name,
              post: row.post,
              area:row.area,
              subject: row.subject,
              rollNo:row.rollNo,
              meritNo:row.meritNo,
              selCategory:row.selCategory,
              splCategory:row.splCategory,
              mobile:row.mobile,
              // shift:row.shift,
              // assignedTeam: teamUser._id,
              // dvDate: new Date(row.dvDate),
              status: "Pending",
              isLocked: "false",
              selectedSchools: [],
              pdfUrl: ""
            });

            console.log("✅ Inserted:", row.employeeId, row.subject);

          } catch (err) {
            console.log("❌ Error:", err.message);
          }
        }

        console.log("🎉 Import Completed Successfully");
        process.exit();
      });

  } catch (err) {
    console.log("❌ DB Error:", err.message);
  }
};

startImport();