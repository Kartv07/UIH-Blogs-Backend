import { Schema, model } from "mongoose";

const parentCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true
  }
);

const ParentCategoryCollection = model("parent_category", parentCategorySchema);

export default ParentCategoryCollection;
