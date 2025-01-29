// getCategories()
// Fetches all available categories.
function getCategories() {
  // 1. Retrieve categories from local storage.
  // 2. If empty, fetch from Firebase.
  // 3. Return an array of categories.
}

// addCategory(name)
// Adds a new category to storage.
function addCategory(name) {
  // 1. Validate category name.
  // 2. Generate a unique category ID.
  // 3. Save to local storage.
  // 4. Sync with Firebase.
}

// deleteCategory(id)
// Deletes a category by ID.
function deleteCategory(id) {
  // 1. Remove category from local storage.
  // 2. Sync deletion with Firebase.
}

// updateCategory(id, newName)
// Updates an existing category.
function updateCategory(id, newName) {
  // 1. Find category by ID.
  // 2. Update the name.
  // 3. Save changes to local storage & Firebase.
}

// renderCategories()
// Displays categories in the UI.
function renderCategories() {
  // 1. Fetch all categories.
  // 2. Create HTML elements dynamically.
  // 3. Append them to the category section.
}
