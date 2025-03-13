import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    title : {
        type : String,
        required : true,
        unique : true
    },
    slug : {
        type : String,
        required : true,
        unique : true
    },
    parent_category : {
        type : Schema.Types.ObjectId,
        ref : "parent_category"
    }
})

const CategoryCollection = model("category", CategorySchema);

export default CategoryCollection;