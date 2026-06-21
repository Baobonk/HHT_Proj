import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    email: {
      type: String,
      lowercase: true,
    },
    fullName: String,
    birthDay: Date,
    sex: String,
    address: String,
    elo: {
      type: Number,
      default: 1000,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },

    // ✅ THÊM 2 FIELD NÀY
    otpCode: String,
    otpExpires: Date,

    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
      role: {
    type: String,
    enum: ["player", "user", "admin"],
    default: "player",
  },

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User = mongoose.model("User", userSchema);
export default User;
