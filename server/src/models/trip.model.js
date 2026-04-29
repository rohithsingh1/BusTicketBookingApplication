import mongoose from "mongoose";

const pickupTimeSchema=new mongoose.Schema(
  {
    point: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "PickupPoint",
    },
    time: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const dropTimeSchema=new mongoose.Schema(
  {
    point: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "DropPoint",
    },
    time: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const tripSchema=new mongoose.Schema(
  {
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
      index: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
      index: true,
    },
    departureTime: {
      type: Date,
      required: true,
      index: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "CANCELLED", "COMPLETED"],
      default: "SCHEDULED",
      index: true,
    },
    pickupTimes: [pickupTimeSchema],
    dropTimes: [dropTimeSchema],
  },
  {
    timestamps: true,
  }
);

tripSchema.index({route: 1, departureTime: 1, status: 1});

tripSchema.pre("validate", function validateTripTimes() {
  if (this.departureTime&&this.arrivalTime&&this.arrivalTime<=this.departureTime) {
    throw new Error("arrivalTime must be after departureTime.");
  }
});

const Trip=mongoose.models.Trip||mongoose.model("Trip", tripSchema);

export default Trip;
