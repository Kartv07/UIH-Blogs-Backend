import { Router } from "express";
import mongoose from "mongoose";
import BlogCollection from "../database/schemas/blogs.js";

const BlogCollection = Router();

// Get All Blogs
BlogCollection.get("/", async (req, res) => {
  try {
    const fetchedData = await BlogsCategoryCollection.find({}, { heading : 1, slug : 1, smallDesc : 1, desc : 1 });

    return  res.status(200).json(fetchedData);
  } catch (error) {
    return  res.status(500).json({ message: "Error fetching Blog !" });
  }
});

// Add New Blogs
BlogCollection.post("/add", async (req, res) => {
  try {

    const addObject = req.body;

    if(!addObject?.slug) {
      return res.status(400).json({ message: "Please provide slug !" });
    }

    let ifExist = await BlogsCategoryCollection.findOne({slug})

    if(ifExist) {
      return res.status(400).json({ message: "Blog already exist !" });
    }

    const result = await BlogsCategoryCollection.create(addObject);

    if(result?._id){
      return res.status(201).json({message : "Blog added successfully !", _id : result?._id});
    }

  } catch (error) {
    return res.status(500).json({ message: "Error adding Blog !" });
  }
});

// Update Blogs Category
BlogCollection.put("/upate/:id", async (req, res) => {
  try {

    const updateObj  = req.body;

    if(!req?.params?.id) {
      return res.status(400).json({ message: "Please provide blog id !" });
    }

    let existAndUpdate = await BlogsCategoryCollection.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.params.id)}, updateObj , {new: true});

    if(existAndUpdate){
      return res.status(202).json({message : "Blog updated successfully !"});
    }

    return res.status(404).json({ message: "Blog not found !" });
  } catch (error) {
    res.status(500).json({ message: "Error updating Blog !" });
  }
});

// Delete Blogs Category
BlogCollection.delete("/delete/:id", async (req, res) => {
  try {

    if(! req?.params?.id){
        return res.status(404).json({ message: "Please provide blog id !" });
    }

    const result = await BlogsCategoryCollection.findOneAndDelete({_id : new mongoose.Types.ObjectId(req?.params?.id)}, {new : true});

    if(result){
      return res.status(200).json({message : "Blog deleted successfully !"});
    }
    
    return res.status(404).json({ message: "Blog not found !" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting Blog !" });
  }
});

export default BlogCollection;
