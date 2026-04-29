import mongoose from "mongoose";

const routeSchema=new mongoose.Schema(
  {
    sourceCity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },
    destinationCity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
      index: true,
    },
    distanceKm: {
      type: Number,
      min: 1,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

routeSchema.index({sourceCity: 1, destinationCity: 1}, {unique: true});

routeSchema.pre("validate", function validateDifferentCities() {
  if (
    this.sourceCity&&
    this.destinationCity&&
    this.sourceCity.equals(this.destinationCity)
  ) {
    throw new Error("sourceCity and destinationCity must be different.");
  }
});

const Route=mongoose.models.Route||mongoose.model("Route", routeSchema);

export default Route;
