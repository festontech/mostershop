const Category = require('../models/Category');

const getAllDescendantCategoryIds = async (parentId) => {
  const children = await Category.find({ parent: parentId }).select('_id').lean();
  let ids = children.map(c => c._id);

  for (const child of children) {
    const subIds = await getAllDescendantCategoryIds(child._id);
    ids.push(...subIds);
  }

  return ids;
};