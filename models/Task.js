const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must be at least 1 characters"],
      maxlength: [50, "Title cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

taskSchema.virtual("formattedDate").get(function () {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    day: this.dueDate.getDate(),
    month: months[this.dueDate.getMonth()],
    year: this.dueDate.getFullYear(),
  };
});

taskSchema.virtual("categoryInfo").get(async function () {
  const user = await mongoose.model("User").findById(this.userId);
  const category = user.categories.find((cat) => cat.name === this.category);
  return {
    name: this.category,
    color: category
      ? category.color
      : "#" + Math.floor(Math.random() * 16777215).toString(16),
  };
});

taskSchema.pre("save", async function (next) {
  const user = await mongoose.model("User").findById(this.userId);
  const categoryExists = user.categories.some(
    (cat) => cat.name === this.category
  );

  if (!categoryExists) {
    user.categories.push({
      name: this.category,
      isDefault: false,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });
    await user.save();
  }
  next();
});

// Indexes
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ category: 1 });

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
