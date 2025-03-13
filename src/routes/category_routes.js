import { Router } from "express";
import mongoose from "mongoose";
import CategoryCollection from "../database/schemas/category.js";

const CategoryRouter = Router();

// Get All Categories
CategoryRouter.get("/", async (req, res) => {
  try {
    const fetchedData = await CategoryCollection.find({}, { title: 1, slug: 1 });

    return  res.status(200).json(fetchedData);
  } catch (error) {
    return  res.status(500).json({ message: "Error fetching  categories" });
  }
});

// Add New Category
CategoryRouter.post("/add", async (req, res) => {
  try {

    const { title, slug, parentCategory } = req.body;

    if(!title || !slug || !parentCategory) {
      return res.status(400).json({ message: "Please provide title and slug" });
    }

    let ifExist = await CategoryCollection.findOne({slug})

    if(ifExist) {
      return res.status(400).json({ message: " Category already exist" });
    }

    const result = await CategoryCollection.create({title,slug, parent_category : parentCategory});

    if(result?._id){
      return res.status(201).json({message : " Category added successfully", _id : result?._id});
    }

  } catch (error) {
    return res.status(500).json({ message: "Error adding  category" });
  }
});

// Update  Category
CategoryRouter.put("/upate/:id", async (req, res) => {
  try {

    const updatedObj = req.body;
    
    if(updatedObj.parentCategory){
      updatedObj.parent_category = updatedObj.parentCategory;
      delete updatedObj.parentCategory;
    }
    let existAndUpdate = await CategoryCollection.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.params.id)}, updatedObj, {new: true});

    if(existAndUpdate){
      return res.status(202).json({message : " Category updated successfully"});
    }

    return res.status(404).json({ message: " Category not found" });
  } catch (error) {
    res.status(500).json({ message: "Error updating  category" });
  }
});

// Delete  Category
CategoryRouter.delete("/delete/:id", async (req, res) => {
  try {

    const result = await CategoryCollection.findOneAndDelete({_id : new mongoose.Types.ObjectId(req?.params?.id)}, {new : true});

    if(result){
      return res.status(200).json({message : " Category deleted successfully"});
    }
    
    return res.status(404).json({ message: " Category not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting  category" });
  }
});

export default CategoryRouter;
