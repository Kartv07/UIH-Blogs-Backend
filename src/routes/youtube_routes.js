import { Router } from "express";
import YoutubeCollection from "../database/schemas/youtube.js";
import mongoose from "mongoose";

const YoutubeRouter = Router();

// Get All Youtube Data
YoutubeRouter.get("/", async (req, res) => {
  try {
    const fetchedData = await YoutubeCollection.find({}, { title: 1, slug: 1, youtubeId : 1, desc : 1 });

    return  res.status(200).json(fetchedData);
  } catch (error) {
    return  res.status(500).json({ message: "Error While Fetching Youtube Data !" });
  }
});

// Add New Youtube Data
YoutubeRouter.post("/add", async (req, res) => {
  try {

    const { title, slug, youtubeId } = req.body;

    if(!title || !slug || !youtubeId) {
      return res.status(400).json({ message: "Please provide title and slug !" });
    }

    let ifExist = await YoutubeCollection.findOne({slug})

    if(ifExist) {
      return res.status(400).json({ message: "Youtube Data already exist !" });
    }

    const result = await YoutubeCollection.create(req.body);

    if(result?._id){
      return res.status(201).json({message : "Youtube Data added successfully !", _id : result?._id});
    }

  } catch (error) {
    return res.status(500).json({ message: "Error While Adding Youtube Data !" });
  }
});

// Update Youtube Data
YoutubeRouter.put("/upate/:id", async (req, res) => {
  try {

    if(!req?.params?.id) {  
      return res.status(404).json({ message: "Please Provide Youtube Data id !" });
      }

    const updatedObj = req.body;

    let existAndUpdate = await YoutubeCollection.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.params.id)}, updatedObj, {new: true});

    if(existAndUpdate){
      return res.status(202).json({message : "Youtube Data Updated Successfully !"});
    }

    return res.status(404).json({ message: "Youtube Data Not Found !" });
  } catch (error) {
    res.status(500).json({ message: "Error While Updating Youtube Data !" });
  }
});

// Delete Youtube Data
YoutubeRouter.delete("/delete/:id", async (req, res) => {
  try {
    if(!req?.params?.id) {  
      return res.status(404).json({ message: "Please Provide Youtube Data id !" });
    }

    const result = await YoutubeCollection.findOneAndDelete({_id : new mongoose.Types.ObjectId(req?.params?.id)}, {new : true});

    if(result){
      return res.status(200).json({message : "Youtube Data Deleted successfully !"});
    }
    
    return res.status(404).json({ message: "Youtube Data Not Found !" });
  } catch (error) {
    return res.status(500).json({ message: "Error While Deleting Youtube Data !" });
  }
});

export default YoutubeRouter;
