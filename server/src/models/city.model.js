import mongoose from "mongoose";

const citySchema=new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
      default: null,
    },
    country: {
      type: String,
      trim: true,
      default: "India",
    },
  },
  {
    timestamps: true,
  }
);

const City=mongoose.models.City||mongoose.model("City", citySchema);

export default City;
