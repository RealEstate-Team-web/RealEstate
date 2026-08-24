const categoryService = require("../services/category.service");

const getPublic = async (req, res, next) => {
  try {
    const data = await categoryService.getPublicCategories();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await categoryService.listCategories();
    res.status(200).json({ success: true, message: "Categories", data });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const data = await categoryService.getCategory(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, message: "Category created", data });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Category updated", data });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const data = await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted", data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublic, list, getOne, create, update, remove };
