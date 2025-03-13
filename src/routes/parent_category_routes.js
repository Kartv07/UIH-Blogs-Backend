import { Router } from "express";
import ParentCategoryCollection from "../database/schemas/parent_category.js";
import mongoose, {ObjectId} from "mongoose";

const ParentCategoryrouter = Router();

// Get All Parent Categories
ParentCategoryrouter.get("/", async (req, res) => {
  try {
    const fetchedData = await ParentCategoryCollection.find({}, { title: 1, slug: 1 });

    return  res.status(200).json(fetchedData);
  } catch (error) {
    return  res.status(500).json({ message: "Error fetching parent categories" });
  }
});

// Add New Parent Category
ParentCategoryrouter.post("/add", async (req, res) => {
  try {

    const { title, slug } = req.body;

    if(!title || !slug) {
      return res.status(400).json({ message: "Please provide title and slug" });
    }

    let ifExist = await ParentCategoryCollection.findOne({slug})

    if(ifExist) {
      return res.status(400).json({ message: "Parent Category already exist" });
    }

    const result = await ParentCategoryCollection.create({title,slug});

    if(result?._id){
      return res.status(201).json({message : "Parent Category added successfully", _id : result?._id});
    }

  } catch (error) {
    return res.status(500).json({ message: "Error adding parent category" });
  }
});

// Update Parent Category
ParentCategoryrouter.put("/upate/:id", async (req, res) => {
  try {

    const { title, slug } = req.body;

    if(!title || !slug) {
      return res.status(400).json({ message: "Please provide title and slug" });
    }

    let existAndUpdate = await ParentCategoryCollection.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.params.id)}, {title, slug}, {new: true});

    if(existAndUpdate){
      return res.status(202).json({message : "Parent Category updated successfully"});
    }

    return res.status(404).json({ message: "Parent Category not found" });
  } catch (error) {
    res.status(500).json({ message: "Error updating parent category" });
  }
});

// Delete Parent Category
ParentCategoryrouter.delete("/delete/:id", async (req, res) => {
  try {

    const result = await ParentCategoryCollection.findOneAndDelete({_id : new mongoose.Types.ObjectId(req?.params?.id)}, {new : true});

    if(result){
      return res.status(200).json({message : "Parent Category deleted successfully"});
    }
    
    return res.status(404).json({ message: "Parent Category not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting parent category" });
  }
});

export default ParentCategoryrouter;
