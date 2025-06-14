const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "SubCategory required"],
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "too short SubCategory name"],
      maxlength: [32, "Too long SubCategory name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "SubCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model(
  "SubCategory",
  subCategorySchema,
  "SubCategories"
);

module.exports = SubCategoryModel;
