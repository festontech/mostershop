document.addEventListener('DOMContentLoaded', () => {
  const categoryNav = document.getElementById('category-nav');
  const filterForm = document.getElementById('filter-form');
  const activeFilters = document.getElementById('active-filters');


  let currentFilters = {
    category: null,
    subcategory: null,
    search: '',
    sort: '',
  };

  // Utility: get URL parameters as an object
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      category: params.get('category'),
      subcategory: params.get('subcategory'),
      search: params.get('search') || '',
      sort: params.get('sort') || '',
    };
  }

  // Utility: navigate to new URL (reloads page with new parameters)
  function navigateToUrl() {
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([k, v]) => {
      if (v) {
        params.set(k, v);
      }
    });
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    console.log('Navigating to:', newUrl);
    window.location.href = newUrl; // This will reload the page
  }

  // Render categories navigation from API response
function renderCategories(categories) {
  let html = '';
  html += `<div class="category-item">
    <a href="#" data-category="" class="category-link ${!currentFilters.category ? 'active' : ''}">All Products</a>
  </div>`;

  for (const categoryName in categories) {
    const category = categories[categoryName];
    const categoryId = category.id;
    const isActiveCategory = currentFilters.category === categoryId;

    html += `<div class="category-item">
      <a href="#" data-category="${categoryId}" class="category-link ${isActiveCategory ? 'active' : ''}">${categoryName}</a>`;

    const children = category.children;
    if (children && Object.keys(children).length) {
      html += `<div class="subcategory-dropdown">`;
      for (const subcatName in children) {
        const subcat = children[subcatName];
        const subcatId = subcat.id;
        const isActiveSubcat = isActiveCategory && currentFilters.subcategory === subcatId;

        html += `<a href="#" data-category="${categoryId}" data-subcategory="${subcatId}" class="subcategory-link ${isActiveSubcat ? 'active' : ''}">${subcatName}</a>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
  }

  categoryNav.innerHTML = html;

  // Add event listeners for categories and subcategories
  categoryNav.querySelectorAll('a.category-link, a.subcategory-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      currentFilters.category = link.dataset.category || null;
      currentFilters.subcategory = link.dataset.subcategory || null;
      navigateToUrl(); // Reload page with new parameters
    });
  });
}




  // Render active filters badges
  function renderActiveFilters() {
    if (!activeFilters) return;

    let html = '';
    if (currentFilters.category) {
      html += `<span class="badge">Category: ${currentFilters.category} <a href="#" data-clear="category" class="text-white ms-1 text-decoration-none">×</a></span> `;
    }
    if (currentFilters.subcategory) {
      html += `<span class="badge bg-info">Subcategory: ${currentFilters.subcategory} <a href="#" data-clear="subcategory" class="text-white ms-1 text-decoration-none">×</a></span> `;
    }
    if (currentFilters.search) {
      html += `<span class="badge bg-success">Search: "${currentFilters.search}" <a href="#" data-clear="search" class="text-white ms-1 text-decoration-none">×</a></span> `;
    }
    if (currentFilters.sort) {
      html += `<span class="badge bg-warning">Sort: ${currentFilters.sort} <a href="#" data-clear="sort" class="text-white ms-1 text-decoration-none">×</a></span> `;
    }
    if (html) {
      html += `<a href="#" id="clear-all" class="btn btn-sm btn-outline-secondary ms-2">Clear All</a>`;
    }
    activeFilters.innerHTML = html;

    // Clear filter handlers
    activeFilters.querySelectorAll('a[data-clear]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const filterToClear = link.dataset.clear;
        currentFilters[filterToClear] = null;
        if (filterToClear === 'search' || filterToClear === 'sort') {
          currentFilters[filterToClear] = '';
        }
        if (filterToClear === 'category') {
          currentFilters.subcategory = null;
        }
        navigateToUrl(); // Reload page with new parameters
      });
    });

    // Clear all
    const clearAll = document.getElementById('clear-all');
    if (clearAll) {
      clearAll.addEventListener('click', e => {
        e.preventDefault();
        currentFilters = {category: null, subcategory: null, search: '', sort: '',};
        navigateToUrl(); // Reload page with new parameters
      });
    }
  }

  // Handle "No products found" view all button
  function setupViewAllButton() {
    const viewAllBtn = document.getElementById('view-all');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', e => {
        e.preventDefault();
        currentFilters = {category: null, subcategory: null, search: '', sort: ''};
        navigateToUrl(); // Reload page with new parameters
      });
    }
  }

  
  // Fetch categories from API (only for navigation rendering)
  function fetchCategories() {
    fetch('/api/categories')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.categories) {
          renderCategories(json.data.categories);;
          renderActiveFilters();
        } else {
          if (categoryNav) {
            categoryNav.innerHTML = '<p class="text-danger">No categories found.</p>';
          }
        }
      })
      .catch(err => {
        if (categoryNav) {
          categoryNav.innerHTML = '<p class="text-danger">Failed to load categories.</p>';
        }
      });
  }

  // Hook filter form inputs to reload page with new parameters
  if (filterForm) {
    filterForm.addEventListener('change', e => {
      const formData = new FormData(filterForm);
      currentFilters.search = formData.get('search') || '';
      currentFilters.sort = formData.get('sort') || '';
      navigateToUrl(); // Reload page with new parameters
    });

    // Also handle form submission
    filterForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(filterForm);
      currentFilters.search = formData.get('search') || '';
      currentFilters.sort = formData.get('sort') || '';
      navigateToUrl(); // Reload page with new parameters
    });
  }

  // Initialize on page load
  function init() {
    // Set currentFilters from URL parameters
    Object.assign(currentFilters, getUrlParams());

    // Set initial form values from URL parameters
    if (filterForm) {
      const sortSelect = filterForm.querySelector('#sort');
      const searchInput = filterForm.querySelector('#search');

      if (sortSelect) sortSelect.value = currentFilters.sort;
      if (searchInput) searchInput.value = currentFilters.search;
    }

    // Fetch categories for navigation (products are handled by backend)
    fetchCategories();
    
    // Setup existing view all button
    setupViewAllButton();
  }

  // Initialize the application
  init();
});