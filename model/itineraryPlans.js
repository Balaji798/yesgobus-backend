const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const destinationSchema = new mongoose.Schema(
  {
    hotelId: {
      type: ObjectId,
      required: true,
      ref: "Hotel",
      trim: true,
    },
    plans:[Object]
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItineraryPlans", destinationSchema);
