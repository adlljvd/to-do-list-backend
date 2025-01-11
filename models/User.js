const mongoose = require("mongoose");
const { hash } = require("../helpers/bcrypt");

// Definisi kategori default berdasarkan role
const SELLER_CATEGORIES = ["Listing", "Bidding", "Winner", "Delivery"];
const BUYER_CATEGORIES = ["Wishlist", "Bidding", "Payment", "Review"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [1, "Name must be at least 1 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [5, "Password must be at least 5 characters"],
    },
    role: {
      type: String,
      enum: ["seller", "buyer"],
      required: [true, "Role is required"],
    },
    categories: {
      type: [
        {
          name: String,
          isDefault: {
            type: Boolean,
            default: false,
          },
          color: {
            type: String,
            default: "#000000",
          },
        },
      ],
      default: function () {
        const defaultCategories =
          this.role === "seller" ? SELLER_CATEGORIES : BUYER_CATEGORIES;
        return defaultCategories.map((name) => ({
          name,
          isDefault: false,
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        }));
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password sebelum save
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = hash(this.password);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
