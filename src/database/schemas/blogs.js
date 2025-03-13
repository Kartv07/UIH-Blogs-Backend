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
  },
  {
    timestamps: true,
  }
);

const BlogCollection = model("blogs", BlogSchema);

export default BlogCollection;
