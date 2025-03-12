import { Router } from "express";
import { connectMongodb } from "../database/connectMongodb.js";
import { ObjectId } from "mongodb";

const parentCategoryrouter = Router();

// Get All Parent Categories
parentCategoryrouter.get("/", async (req, res) => {

  try {
    const db = await connectMongodb(); 

    const collection = db.collection("parent_category"); 

    const result = await collection.find({}).toArray();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parent categories" });
  }
});

// Add New Parent Category
parentCategoryrouter.post("/add", async (req, res) => {
  try {
    const db = await connectMongodb();

    const collection = db.collection("parent_category");

    const { title, slug } = req.body;

    if(!title || !slug) {
      return res.status(400).json({ message: "Please provide title and slug" });
    }

    let ifExist = await collection.findOne({ slug });

    if(ifExist) {
      return res.status(400).json({ message: "Parent Category already exist" });
    }

    const result = await collection.insertOne({ title, slug, createdAt : new Date() });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error adding parent category" });
  }
});

// Update Parent Category
parentCategoryrouter.put("/upate/:id", async (req, res) => {
  try {
    const db = await connectMongodb();

    const collection = db.collection("parent_category");

    const { title, slug } = req.body;

    if(!title || !slug) {
      return res.status(400).json({ message: "Please provide title and slug" });
    }

    let isExist = await collection.findOne({ slug });

    if(!isExist) {
      return res.status(400).json({ message: "Parent Category not found" });
    }

    const result = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { title, slug, updatedAt: new Date() } });

    res.status(200).json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error updating parent category" });
  }
});

// Delete Parent Category
parentCategoryrouter.delete("/delete/:id", async (req, res) => {
  try {
    const db = await connectMongodb();

    const collection = db.collection("parent_category");

    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting parent category" });
  }
});

export default parentCategoryrouter;
