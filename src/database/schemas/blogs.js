import { Schema, model } from "mongoose";

const BlogSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    smallDesc: {
      type: String,
    },
    desc: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlogCollection = model("blogs", BlogSchema);

export default BlogCollection;
