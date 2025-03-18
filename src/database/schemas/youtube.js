import { Schema, model } from "mongoose";

const YoutubeSchema = new Schema(
  {
    youtubeId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const YoutubeCollection = model("youtubes", YoutubeSchema);

export default YoutubeCollection;