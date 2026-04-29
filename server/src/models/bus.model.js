import mongoose from "mongoose";

const busSchema=new mongoose.Schema(
  {
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusOperator",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    busNumber: {
      type: String,
      trim: true,
      default: null,
    },
    isAc: {
      type: Boolean,
      default: false,
    },
    seatType: {
      type: String,
      enum: ["SEATER", "SLEEPER", "SEATER_SLEEPER"],
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

busSchema.index({operator: 1, busNumber: 1}, {unique: true, sparse: true});

const Bus=mongoose.models.Bus||mongoose.model("Bus", busSchema);

export default Bus;
