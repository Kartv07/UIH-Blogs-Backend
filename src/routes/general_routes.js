import Router from "express";
import ParentCategoryCollection from "../database/schemas/parent_category.js";

const GeneralRouter = Router();

GeneralRouter.get("/sidebar-items", async (req, res) => {
  try {
    let sidebarItems = await ParentCategoryCollection.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parent_category",
          as: "categories",
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          slug: 1,
          categories: {
            title: 1,
            slug: 1,
          },
        },
      },
    ]);

    return res.status(200).json(sidebarItems);
  } catch (error) {
    return res.status(400).json(error);
  }
});

export default GeneralRouter;
