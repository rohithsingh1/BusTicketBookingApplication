import bcrypt from "bcrypt";
import mongoose from "mongoose";

const BCRYPT_SALT_ROUNDS=12;

const userSchema=new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: null,
      trim: true,
    },
    authProvider: {
      type: String,
      enum: ["google", "local"],
      default: "local",
    },
    passwordHash: {
      type: String,
      select: false,
      required() {
        return this.authProvider==="local";
      },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.hashPassword=async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
};

userSchema.methods.comparePassword=function comparePassword(password) {
  if (!this.passwordHash) {
    return false;
  }

  return bcrypt.compare(password, this.passwordHash);
};

const User=mongoose.models.User||mongoose.model("User", userSchema);

export default User;
