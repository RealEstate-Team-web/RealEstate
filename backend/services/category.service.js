const Category = require("../models/category.model");

function conflict(message) {
  const error = new Error(message);
  error.status = 409;
  return error;
}

function notFound() {
  const error = new Error("Category not found");
  error.status = 404;
  return error;
}

async function listCategories() {
  return Category.list();
}

async function getPublicCategories() {
  return Category.list();
}

async function getCategory(id) {
  const category = await Category.getById(id);
  if (!category) throw notFound();
  return category;
}

async function createCategory({ name, description }) {
  const trimmed = String(name).trim();

  const existing = await Category.findByName(trimmed);
  if (existing) throw conflict("Category name already exists");

  try {
    return await Category.create({ name: trimmed, description });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") throw conflict("Category name already exists");
    throw err;
  }
}

async function updateCategory(id, { name, description }) {
  const category = await Category.getById(id);
  if (!category) throw notFound();

  const nextName =
    name !== undefined && name !== null ? String(name).trim() : category.name;

  if (nextName !== category.name) {
    const existing = await Category.findByName(nextName);
    if (existing) throw conflict("Category name already exists");
  }

  await Category.update(id, {
    name: nextName,
    description: description !== undefined ? description : category.description,
  });

  return Category.getById(id);
}

async function deleteCategory(id) {
  const category = await Category.getById(id);
  if (!category) throw notFound();
  await Category.remove(id);
  return { id: Number(id), deleted: true };
}

module.exports = {
  listCategories,
  getPublicCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
