import mongoose from "mongoose";

const busOperatorSchema=new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    supportPhone: {
      type: String,
      trim: true,
      default: null,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const BusOperator=
  mongoose.models.BusOperator||mongoose.model("BusOperator", busOperatorSchema);

export default BusOperator;
