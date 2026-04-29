import mongoose from "mongoose";

const dropPointSchema=new mongoose.Schema(
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

dropPointSchema.index({city: 1, name: 1}, {unique: true});

const DropPoint=mongoose.models.DropPoint||mongoose.model("DropPoint", dropPointSchema);

export default DropPoint;
