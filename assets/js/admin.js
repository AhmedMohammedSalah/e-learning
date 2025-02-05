// دالة لفتح النماذج
function openForm(formId) {
  document.getElementById(formId).style.display = "block";
}

// دالة لإغلاق النماذج
function closeForm(formId) {
  document.getElementById(formId).style.display = "none";
}

// دالة لفتح نموذج إضافة درس
function openAddLessonForm() {
  const courseSelect = document.getElementById("lesson-course");
  courseSelect.innerHTML = ""; // مسح الخيارات القديمة

  const coursesRef = database.ref("courses");
  coursesRef.once("value", (snapshot) => {
    const courses = snapshot.val();
    if (courses) {
      Object.keys(courses).forEach((key) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = courses[key].title;
        courseSelect.appendChild(option);
      });
    }
  });

  openForm("addLessonForm");
}

// دالة لإضافة درس جديد
function addLesson() {
  const courseId = document.getElementById("lesson-course").value;
  const title = document.getElementById("lesson-title").value;
  const videoUrl = document.getElementById("lesson-video-url").value;
  const description = document.getElementById("lesson-desc").value;

  if (!courseId || !title || !videoUrl || !description) {
    alert("Please fill all fields!");
    return;
  }

  const lesson = {
    title,
    videoUrl,
    description,
  };

  const lessonsRef = database.ref(`courses/${courseId}/lessons`);
  lessonsRef
    .push(lesson)
    .then(() => {
      alert("Lesson added successfully!");
      closeForm("addLessonForm");
    })
    .catch((error) => {
      alert("Error adding lesson: " + error.message);
    });
}

// دالة لإضافة كورس جديد
function addCourse() {
  const title = document.getElementById("course-title").value;
  const category = document.getElementById("course-category").value;
  const instructor = document.getElementById("instructor-name").value;
  const description = document.getElementById("course-desc").value;
  const price = document.getElementById("course-price").value;
  const duration = document.getElementById("course-duration").value;

  if (
    !title ||
    !category ||
    !instructor ||
    !description ||
    !price ||
    !duration
  ) {
    alert("Please fill all fields!");
    return;
  }

  const coursesRef = database.ref("courses");
  coursesRef
    .orderByChild("title")
    .equalTo(title)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        alert("Course with this title already exists!");
        return;
      }

      const newCourse = {
        title,
        category,
        instructor,
        description,
        price,
        duration,
      };
      const newCourseRef = coursesRef.push(); // Generate a new key
      newCourse.id = newCourseRef.key; // Add the generated ID to the course object

      coursesRef
        .push(newCourse)
        .then(() => {
          alert("Course added successfully!");
          closeForm("courseForm");
          fetchCourses(); // تحديث الجدول بعد الإضافة
        })
        .catch((error) => {
          alert("Error adding course: " + error.message);
        });
    });
}

// دالة لجلب الكورسات وعرضها في الجدول
function fetchCourses() {
  const coursesRef = database.ref("courses");
  coursesRef.on("value", (snapshot) => {
    const courses = snapshot.val();
    const tbody = document.querySelector("#courses tbody");
    tbody.innerHTML = ""; // مسح المحتوى القديم

    if (courses) {
      Object.keys(courses).forEach((key) => {
        const course = courses[key];
        const row = `
                    <tr>
                        <td>${course.title}</td>
                        <td>${course.instructor}</td>
                        <td>${course.category}</td>
                        <td>${course.price}</td>
                        <td>${course.duration}</td>
                        <td>
                            <button class="edit" onclick="editCourse('${key}')">Edit</button>
                            <button class="delete" onclick="deleteCourse('${key}')">Delete</button>
                        </td>
                    </tr>
                `;
        tbody.innerHTML += row;
      });
    }
  });
}

// دالة لتحديث كورس
function editCourse(courseId) {
  const courseRef = database.ref(`courses/${courseId}`);
  courseRef.once("value", (snapshot) => {
    const course = snapshot.val();
    document.getElementById("edit-course-title").value = course.title;
    document.getElementById("edit-course-category").value = course.category;
    document.getElementById("edit-instructor-name").value = course.instructor;
    document.getElementById("edit-course-desc").value = course.description;
    document.getElementById("edit-course-price").value = course.price;
    document.getElementById("edit-course-duration").value = course.duration;

    openForm("editCourseForm");

    // حفظ التحديثات
    document.querySelector("#editCourseForm .submit-btn").onclick = () => {
      const updatedCourse = {
        title: document.getElementById("edit-course-title").value,
        category: document.getElementById("edit-course-category").value,
        instructor: document.getElementById("edit-instructor-name").value,
        description: document.getElementById("edit-course-desc").value,
        price: document.getElementById("edit-course-price").value,
        duration: document.getElementById("edit-course-duration").value,
      };

      courseRef
        .update(updatedCourse)
        .then(() => {
          alert("Course updated successfully!");
          closeForm("editCourseForm");
          fetchCourses(); // تحديث الجدول بعد التعديل
        })
        .catch((error) => {
          alert("Error updating course: " + error.message);
        });
    };
  });
}

// دالة لحذف كورس
function deleteCourse(courseId) {
  if (confirm("Are you sure you want to delete this course?")) {
    const courseRef = database.ref(`courses/${courseId}`);
    courseRef
      .remove()
      .then(() => {
        alert("Course deleted successfully!");
        fetchCourses(); // تحديث الجدول بعد الحذف
      })
      .catch((error) => {
        alert("Error deleting course: " + error.message);
      });
  }
}

// دالة لإضافة فئة جديدة
function addCategory() {
  const categoryName = document.getElementById("category-name").value;

  if (!categoryName) {
    alert("Please enter a category name!");
    return;
  }

  const categoriesRef = database.ref("categories");
  categoriesRef
    .push({ name: categoryName })
    .then(() => {
      alert("Category added successfully!");
      closeForm("categoryForm");
      fetchCategories(); // تحديث الجدول بعد الإضافة
    })
    .catch((error) => {
      alert("Error adding category: " + error.message);
    });
}

// دالة لجلب الفئات وعرضها في الجدول
function fetchCategories() {
  const categoriesRef = database.ref("categories");
  categoriesRef.on("value", (snapshot) => {
    const categories = snapshot.val();
    const categorySelect = document.getElementById("course-category");
    const tbody = document.querySelector("#categories tbody");
    tbody.innerHTML = ""; // مسح المحتوى القديم

    // مسح الخيارات القديمة
    categorySelect.innerHTML = "";

    if (categories) {
      Object.keys(categories).forEach((key) => {
        const category = categories[key];
        // إضافة الفئات إلى الـ select
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);

        // إضافة الفئات إلى الجدول
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

// دالة لتحديث فئة
function editCategory(categoryId) {
  const categoryRef = database.ref(`categories/${categoryId}`);
  categoryRef.once("value", (snapshot) => {
    const category = snapshot.val();
    document.getElementById("edit-category-name").value = category.name;

    openForm("editCategoryForm");

    // حفظ التحديثات
    document.querySelector("#editCategoryForm .submit-btn").onclick = () => {
      const updatedCategory = {
        name: document.getElementById("edit-category-name").value,
      };

      categoryRef
        .update(updatedCategory)
        .then(() => {
          // تحديث الكورسات المرتبطة بهذه الفئة
          const coursesRef = database.ref("courses");
          coursesRef.once("value", (snapshot) => {
            const courses = snapshot.val();
            if (courses) {
              Object.keys(courses).forEach((key) => {
                if (courses[key].category === category.name) {
                  coursesRef
                    .child(key)
                    .update({ category: updatedCategory.name });
                }
              });
            }
          });

          alert("Category updated successfully!");
          closeForm("editCategoryForm");
          fetchCategories(); // تحديث الجدول بعد التعديل
        })
        .catch((error) => {
          alert("Error updating category: " + error.message);
        });
    };
  });
}

// دالة لحذف فئة
function deleteCategory(categoryId) {
  if (confirm("Are you sure you want to delete this category?")) {
    const categoryRef = database.ref(`categories/${categoryId}`);
    categoryRef.once("value", (snapshot) => {
      const category = snapshot.val();

      // حذف الكورسات المرتبطة بهذه الفئة
      const coursesRef = database.ref("courses");
      coursesRef.once("value", (snapshot) => {
        const courses = snapshot.val();
        if (courses) {
          Object.keys(courses).forEach((key) => {
            if (courses[key].category === category.name) {
              coursesRef.child(key).remove();
            }
          });
        }
      });

      categoryRef
        .remove()
        .then(() => {
          alert("Category deleted successfully!");
          fetchCategories(); // تحديث الجدول بعد الحذف
        })
        .catch((error) => {
          alert("Error deleting category: " + error.message);
        });
    });
  }
}

// تحميل البيانات عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
  fetchCourses();
  fetchCategories();
});
function currentCourse(courseId, callback) {
  const courseRef = firebase.database().ref("courses").child(courseId);

  courseRef.once("value", (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.key, ...snapshot.val() });
    } else {
      callback(null);
    }
  }).catch((error) => {
    console.error("Error fetching course:", error);
    callback(null);
  });
}
