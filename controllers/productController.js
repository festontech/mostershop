const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /s
exports.getAllHomeProducts = async (req, res, next) => {
    try {
        const featuredProducts = await Product.find({ featured: true }).limit(8).lean();
        const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(8).lean();
        const discountedProducts = await Product.find({ discount: { $gt: 0 } }).limit(8).lean();
        res.render('shop/index', {
            title: 'MonsterShop',
            featuredProducts: featuredProducts,
            latestProducts: latestProducts,
            discountedProducts: discountedProducts,
        });
    } catch (error) {
        next(error);
    }
};



// GET /shop/product/:id
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name').lean();
        if (!product) {
            return res.status(404).render('error', {
                title: 'Product Not Found',
                error_msg: 'The requested product could not be found.'
            });
        }

        res.render('shop/product-details', {
            title: product.name,
            product,
            pageJS: 'detail'
        });
    } catch (error) {
        next(error);
    }
};

// ===========================================
// PAGE RENDER CONTROLLER
// ===========================================

// Main page render - loads initial view
exports.getProductsPage = async (req, res, next) => {
  try {
    console.log('Query Parameters:', req.query);
    const {
      sort = '',
      category = '',
      subcategory = '',
      search = '',
    } = req.query;

    const categories = await getAllCategoriesForNav();

    let categoryIds = [];
  
    if (category && !subcategory) {
      console.log('Fetching products for category:', category);
      // Get parent category and all its children
      const categories = await Category.find({ 
        $or: [
          { _id: category },
          { parent: category }
        ]
      }).select('_id');
      console.log('Categories:', categories);
      categoryIds = categories.map(cat => cat._id.toString());
    }
  
  

    // Build sort and filter options
    const sortOption = buildSortOption(sort);
    const filter = buildProductFilterSync({ 
    category, 
    subcategory, 
    search, 
    allCategoryIds: categoryIds 
    });

   
    // Count total products
    const totalProducts = await Product.countDocuments(filter);

    // Get filtered & sorted products
    const products = await Product.find(filter)
      .sort(sortOption)
      .populate('category')
      .lean();

    // console.log('Transformed Products:', products);
    // Render EJS page with products and filters
    res.render('shop/product', {
      title: 'All Products',
      categories,
      products: products,
      sort,
      category,
      subcategory,
      search,
      totalProducts,
      pageJS: 'product',
    });

  } catch (error) {
    next(error);
  }
};


// API: Get categories for navigation
exports.getCategoriesAPI = async (req, res, next) => {
  try {
    console.log('Fetching categories for navigation');
    const categories = await getAllCategoriesForNav();
    console.log(JSON.stringify(categories, null, 2));

    res.json({
      success: true,
      data: {
        categories
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// API: Get product suggestions for search
exports.getProductSuggestionsAPI = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    
    if (q.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }
    
    const suggestions = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name category')
    .populate('category', 'name')
    .limit(8)
    .lean();
    
    const transformedSuggestions = suggestions.map(product => ({
      id: product._id,
      name: product.name,
      category: product.category?.name || 'Uncategorized'
    }));
    
    res.json({
      success: true,
      data: {
        suggestions: transformedSuggestions
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
      error: error.message
    });
  }
};

// API: Get category tree with product counts
exports.getCategoryTreeAPI = async (req, res, next) => {
  try {
    // Get categories with product counts
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      {
        $unwind: '$categoryData'
      },
      {
        $project: {
          _id: 1,
          count: 1,
          name: '$categoryData.name',
          parent: '$categoryData.parent'
        }
      }
    ]);
    
    const categoryTree = buildCategoryTreeWithCounts(categoryStats);
    
    res.json({
      success: true,
      data: {
        categoryTree
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category tree',
      error: error.message
    });
  }
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

// Build sort option from query parameter
function buildSortOption(sort) {
  const sortOptions = {
    'price_asc': { price: 1 },
    'price_desc': { price: -1 },
    'name_asc': { name: 1 },
    'name_desc': { name: -1 },
    'newest': { createdAt: -1 },
    'oldest': { createdAt: 1 },
    'popular': { views: -1 }
  };
  
  return sortOptions[sort] || {};
}

// Build product filter
function buildProductFilterSync({ category, subcategory, search, allCategoryIds = [] }) {
  const filter = {};
  
  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  // Category filter
  if (category) {
    // If allCategoryIds is provided (pre-fetched subcategories), use them
    if (allCategoryIds.length > 0) {
      console.log('Using pre-fetched category IDs:', allCategoryIds);

      filter.category = { $in: allCategoryIds };
    } else {
      // Direct category match only
      filter.category = category;
    }
  }
  
  // Specific subcategory filter
  if (subcategory) {
    filter.category = subcategory;
  }
  
  return filter;
}



// Check if product is new (within last 30 days)
function isProductNew(createdAt) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(createdAt) > thirtyDaysAgo;
}

// Get all categories formatted for navigation
async function getAllCategoriesForNav() {
  try {
    const categories = await Category.find().lean();
    return buildNameTree(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    return {};
  }
}

// Build category tree with product counts
function buildCategoryTreeWithCounts(categoryStats) {
  const tree = {};
  
  categoryStats.forEach(stat => {
    if (!stat.parent) {
      // Root category
      if (!tree[stat.name]) {
        tree[stat.name] = { count: 0, children: {} };
      }
      tree[stat.name].count += stat.count;
    } else {
      // Child category - you'll need to implement based on your schema
      // This is a simplified version
      const parentName = stat.parent.name || 'Unknown';
      if (!tree[parentName]) {
        tree[parentName] = { count: 0, children: {} };
      }
      tree[parentName].children[stat.name] = {
        count: stat.count,
        children: {}
      };
      tree[parentName].count += stat.count;
    }
  });
  
  return tree;
}
function buildNameTree(categories) {
  // Map category by stringified ID
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat._id.toString()] = {
      ...cat,
      id: cat._id.toString(),
      children: {}
    };
  });

  const tree = {};

  // Build tree by linking children to their parents
  categories.forEach(cat => {
    const id = cat._id.toString();
    const parentId = cat.parent ? cat.parent.toString() : null;

    const node = {
      id: id,
      children: categoryMap[id].children
    };

    if (!parentId) {
      // Top-level node
      tree[cat.name] = node;
    } else {
      const parent = categoryMap[parentId];
      if (parent) {
        parent.children[cat.name] = node;
      }
    }
  });

  return tree;
}