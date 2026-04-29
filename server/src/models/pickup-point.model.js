import mongoose from "mongoose";

const pickupPointSchema=new mongoose.Schema(
  {
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

pickupPointSchema.index({city: 1, name: 1}, {unique: true});

const PickupPoint=
  mongoose.models.PickupPoint||mongoose.model("PickupPoint", pickupPointSchema);

export default PickupPoint;
