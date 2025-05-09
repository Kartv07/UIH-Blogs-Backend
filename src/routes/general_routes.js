import Router from "express";
import ParentCategoryCollection from "../database/schemas/parent_category.js";
import CategoryCollection from "../database/schemas/category.js";
import mongoose from "mongoose";
import BlogCollection from "../database/schemas/blogs.js";
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

GeneralRouter.get("/categories-parent", async (req, res) => {
  try {
    let categories = await CategoryCollection.aggregate([
      {
        $lookup: {
          from: "parent_categories",
          localField: "parent_category",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $unwind: "$parentCategory",
      },
      {
        $project: {
          title: 1,
          slug: 1,
          desc: 1,
          parentCategory: {
            title: 1,
            slug: 1,
          },
        },
      },
      {
        $sort: {
          "parentCategory.slug": 1,
        },
      },
    ]);

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json(error);
  }
});

GeneralRouter.get("/all-categories-parent-categories", async (req, res) => {
  try {
    let [categories, parentCategories] = await Promise.all([
      CategoryCollection.find({}, { title: 1, slug: 1 }),
      ParentCategoryCollection.find({}, { title: 1, slug: 1 }),
    ]);

    return res.status(200).json({ categories, parentCategories });
  } catch (error) {
    return res.status(400).json(error);
  }
});

GeneralRouter.post("/add-blog", async (req, res) => {
  try {
    let { category, parentCategory } = req.body;
    let parentCategoryObj = parentCategory;
    let categoryObj = category;
    if (parentCategory && !parentCategory?._id) {
      parentCategoryObj = await ParentCategoryCollection.create(parentCategory);
    }

    if (!category?._id) {
      categoryObj = await CategoryCollection.create({
        title: category.title,
        slug: category.slug,
        desc: category.desc,
        parent_category: new mongoose.Types.ObjectId(parentCategoryObj?._id),
      });
    }
    let slugVal = req.body.heading.trim().toLowerCase().replace(/\s+/g, "-");
    let createNewBlog = await BlogCollection.create({
      heading: req.body.heading,
      slug: slugVal,
      smallDesc: req.body.smallDesc,
      desc: req.body.desc,
      category: new mongoose.Types.ObjectId(categoryObj?._id),
    });

    if (createNewBlog) {
      return res
        .status(201)
        .json({ message: "Blog Added Successfully", slug: slugVal });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

GeneralRouter.put("/update-blog/:id", async (req, res) => {
  try {
    let { category, parentCategory } = req.body;
    let parentCategoryObj = parentCategory;
    let categoryObj = category;
    if (parentCategory && !parentCategory?._id) {
      parentCategoryObj = await ParentCategoryCollection.create(parentCategory);
    }

    if (!category?._id) {
      categoryObj = await CategoryCollection.create({
        title: category.title,
        slug: category.slug,
        desc: category.desc,
        parent_category: new mongoose.Types.ObjectId(parentCategoryObj?._id),
      });
    }

    let isBlogExist = await BlogCollection.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
    });

    if (!isBlogExist) {
      return res.status(404).json({ message: "Blog not found" });
    }

    let slugVal = req.body.heading.trim().toLowerCase().replace(/\s+/g, "-");

    let updateBlog = await BlogCollection.updateOne(
      {
        _id: new mongoose.Types.ObjectId(req.params.id),
      },
      {
        $set: {
          heading: req.body.heading,
          slug: slugVal,
          smallDesc: req.body.smallDesc,
          desc: req.body.desc,
          category: new mongoose.Types.ObjectId(categoryObj?._id),
        },
      }
    );

    if (updateBlog?.acknowledged) {
      return res
        .status(200)
        .json({ message: "Blog Updated Successfully", slug: slugVal });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

GeneralRouter.get("/get-blogs", async (req, res) => {
  try {
    let { _id, parentCategory, category, ...otherQuery } = req.query;
    let pipeline = [
      {
        $match: otherQuery ?? {},
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categories",
        },
      },
      { $unwind: "$categories" },
      {
        $lookup: {
          from: "parent_categories",
          localField: "categories.parent_category",
          foreignField: "_id",
          as: "parentCategories",
        },
      },
      { $unwind: "$parentCategories" },
      {
        $sort : {
          createdAt : -1
        }
      }
    ];

    // 🔹 Filter based on `parentCategory` if provided
    if (parentCategory) {
      pipeline.push({
        $match: { "parentCategories.slug": parentCategory },
      });
    }

    // 🔹 Filter based on `category` if provided
    if (category) {
      pipeline.push({
        $match: { "categories.slug": category },
      });
    }

    let projectObj = {
      heading: 1,
      slug: 1,
      smallDesc: 1,
      createdAt : 1,
      categories: {
        title: 1,
        slug: 1,
      },
      parentCategories: {
        title: 1,
        slug: 1,
      },
    }

    if(otherQuery?.slug){
      projectObj.desc = 1
    }

    // 🔹 Select required fields
    pipeline.push({
      $project: {
        ...projectObj
      },
    });

    let blogs = await BlogCollection.aggregate(pipeline);

    if (blogs) {
      return res.status(200).json(blogs);
    }
  } catch (error) {
    console.log(error);
  }
});

GeneralRouter.get("/static-paths", async (req, res) => {
  try {
    let {slug} = req?.query;

    let paths = [];
    if(slug == 'parentCategory'){
      paths = await ParentCategoryCollection.find({}, {slug : 1, _id : 0});
      paths = paths.map(path => ({params: {parentSlug: path.slug}}))
    }
    else if(slug == 'category'){
      paths = await CategoryCollection.aggregate([
        {
          $lookup: {
            from: "parent_categories",
            localField: "parent_category",
            foreignField: "_id",
            as: "parent_category",
          },
        },
        { $unwind: "$parent_category" },
        {
          $project: {
            slug: 1,
            parent_category: {
              slug: 1,
            },
          },
        }
      ]);
      paths = paths.map(path => ({params: {categorySlug: path.slug, parentSlug: path.parent_category.slug}}))
    }
    else if(slug == 'slug'){
      paths = await BlogCollection.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categories",
          },
        },
        { $unwind: "$categories" },
        {
          $lookup: {
            from: "parent_categories",
            localField: "categories.parent_category",
            foreignField: "_id",
            as: "parentCategories",
          },
        },
        { $unwind: "$parentCategories" },
        {
          $project: {
            slug: 1,
            categories: {
              slug: 1,
            },
            parentCategories: {
              slug: 1,
            },
          },
        },
      ])

      paths = paths.map(path => ({params: {slug: path.slug, categorySlug: path.categories.slug, parentSlug: path.parentCategories.slug}}))
    }
      
    return res.status(200).json({paths})
  } catch (error) {}
});

export default GeneralRouter;
