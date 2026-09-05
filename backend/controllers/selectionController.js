import Selections from "../models/Selections.js";
import Candidate from "../models/Candidate.js";
import CounselingConfig from "../models/CounselingConfig.js";

export const getSelections = async (req, res) => {
  try {
    // --------------------------------------------------
    // 1. Candidate find
    // --------------------------------------------------
    const candidate = await Candidate.findOne({
      userId: req.user.id
    })
      .select("_id")
      .lean();

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    // --------------------------------------------------
    // 2. Candidate ki selections fetch karo
    // --------------------------------------------------
    const data = await Selections.find({
      candidateId: candidate._id
    })
      .select("employeeId post area subject meritNo rollNo")
      .lean();

    // Agar koi selection nahi hai
    if (data.length === 0) {
      return res.json([]);
    }

    // --------------------------------------------------
    // 3. Unique post + area + subject combinations
    // --------------------------------------------------
    const configKeys = [
      ...new Set(
        data.map(
          (item) =>
            `${item.post}|||${item.area}|||${item.subject}`
        )
      )
    ];

    // --------------------------------------------------
    // 4. CounselingConfig ke liye query create karo
    // --------------------------------------------------
    const configQuery = configKeys.map((key) => {
      const [post, area, subject] = key.split("|||");

      return {
        post,
        area,
        subject
      };
    });

    // --------------------------------------------------
    // 5. Saari required configs ek hi DB query me fetch
    // --------------------------------------------------
    const configs = await CounselingConfig.find({
      $or: configQuery
    })
      .select("post area subject startDate endDate isActive")
      .lean();

    // --------------------------------------------------
    // 6. Config ko Map me convert karo
    // --------------------------------------------------
    const configMap = new Map();

    configs.forEach((config) => {
      const key = `${config.post}|||${config.area}|||${config.subject}`;

      configMap.set(key, config);
    });

    // --------------------------------------------------
    // 7. Har selection ka isOpen calculate karo
    // --------------------------------------------------
    const now = new Date();

    const updateData = data.map((item) => {
      const key = `${item.post}|||${item.area}|||${item.subject}`;

      const config = configMap.get(key);

      let isOpen = false;

      if (config && config.isActive) {
        isOpen =
          now >= new Date(config.startDate) &&
          now <= new Date(config.endDate);
      }

      return {
        ...item,
        isOpen,
        startDate: config?.startDate || null,
        endDate: config?.endDate || null
      };
    });

    // --------------------------------------------------
    // 8. Response
    // --------------------------------------------------
    return res.json(updateData);

  } catch (error) {
    console.error("SELECTION ERROR:", error.message);

    return res.status(500).json({
      error: error.message
    });
  }
};


export const getSelectionWithUser = async (req, res) => {
  try {
    const selection = await Selections.findById(req.params.id);

    if (!selection) {
      return res.status(404).json({
        message: "Selection not found"
      });
    }

    // Candidate fetch
    const candidate = await Candidate.findById(
      selection.candidateId
    );

    return res.json({
      ...selection.toObject(),
      candidateId: candidate
    });

  } catch (error) {
    console.error("ERROR:", error.message);

    return res.status(500).json({
      message: error.message
    });
  }
};
