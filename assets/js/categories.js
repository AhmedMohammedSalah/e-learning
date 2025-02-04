// assets/js/categories.js
function fetchCategories() {
  database.ref("categories").on("value", (snapshot) => {
    const categories = snapshot.val();
    const categorySelect = document.getElementById("course-category");
    const tbody = document.querySelector("#categories tbody");
    tbody.innerHTML = "";
    categorySelect.innerHTML = "";

    if (categories) {
      Object.keys(categories).forEach((key) => {
        const category = categories[key];
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);

        const row = `
                    <tr>
                        <td>${category.name}</td>
                        <td>
                            <button class="edit" onclick="editCategory('${key}')">Edit</button>
                            <button class="delete" onclick="deleteCategory('${key}')">Delete</button>
                        </td>
                    </tr>
                `;
        tbody.innerHTML += row;
      });
    }
  });
}

function addCategory() {
  const categoryName = document.getElementById("category-name").value;

  if (!categoryName) {
    alert("Please enter a category name!");
    return;
  }

  database
    .ref("categories")
    .push({ name: categoryName })
    .then(() => {
      alert("Category added successfully!");
      closeForm("categoryForm");
      fetchCategories();
    })
    .catch((error) => {
      alert("Error adding category: " + error.message);
    });
}

function editCategory(categoryId) {
  database
    .ref(`categories/${categoryId}`)
    .once("value")
    .then((snapshot) => {
      const category = snapshot.val();
      document.getElementById("edit-category-name").value = category.name;

      openForm("editCategoryForm");

      document.querySelector("#editCategoryForm .submit-btn").onclick = () => {
        const updatedCategory = {
          name: document.getElementById("edit-category-name").value,
        };

        database
          .ref(`categories/${categoryId}`)
          .update(updatedCategory)
          .then(() => {
            alert("Category updated successfully!");
            closeForm("editCategoryForm");
            fetchCategories();
          })
          .catch((error) => {
            alert("Error updating category: " + error.message);
          });
      };
    });
}

function deleteCategory(categoryId) {
  if (confirm("Are you sure you want to delete this category?")) {
    database
      .ref(`categories/${categoryId}`)
      .remove()
      .then(() => {
        alert("Category deleted successfully!");
        fetchCategories();
      })
      .catch((error) => {
        alert("Error deleting category: " + error.message);
      });
  }
}
