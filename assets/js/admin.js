
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

  openForm("lessonForm"); // Use the correct ID here
}
function openForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
      form.style.display = "block"; // Show the form
  } else {
      console.error(`Form with ID "${formId}" not found.`);
  }
}

// دالة لإضافة درس جديد

// function addLesson() {
//   const courseId = document.getElementById("lesson-course").value;
//   const title = document.getElementById("lesson-title").value;
//   const videoUrl = document.getElementById("lesson-video-url").value;
//   const description = document.getElementById("lesson-desc").value;

//   if (!courseId || !title || !videoUrl || !description) {
//       alert("Please fill all fields!");
//       return;
//   }

//   const lessonsRef = database.ref(`courses/${courseId}/lessons`);

//   // التحقق من عدم وجود نفس الدرس مسبقًا
//   lessonsRef.once("value", (snapshot) => {
//       const lessons = snapshot.val();
//       let isDuplicate = false;

//       if (lessons) {
//           Object.values(lessons).forEach((lesson) => {
//               if (lesson.title === title || lesson.videoUrl === videoUrl) {
//                   isDuplicate = true;
//               }
//           });
//       }

//       if (isDuplicate) {
//           alert("Lesson with the same title or video URL already exists!");
//       } else {
//           const lesson = { title, videoUrl, description };
//           lessonsRef.push(lesson)
//               .then(() => {
//                   alert("Lesson added successfully!");
//                   closeForm("addLessonForm");
//               })
//               .catch((error) => {
//                   alert("Error adding lesson: " + error.message);
//               });
//       }
//   });
// }

function addLesson() {
  const courseId = document.getElementById("lesson-course").value;
  const title = document.getElementById("lesson-title").value.trim();
  const videoUrl = document.getElementById("lesson-video-url").value.trim();
  const description = document.getElementById("lesson-desc").value.trim();

  if (!courseId || !title || !videoUrl || !description) {
      alert("Please fill all fields!");
      return;
  }

  const lessonsRef = database.ref(`courses/${courseId}/lessons`);

  // التحقق من عدم وجود نفس الدرس مسبقًا
  lessonsRef.once("value", (snapshot) => {
      const lessons = snapshot.val();
      let isDuplicate = false;

      if (lessons) {
          Object.values(lessons).forEach((lesson) => {
              if (lesson.title === title || lesson.videoUrl === videoUrl) {
                  isDuplicate = true;
              }
          });
      }

      if (isDuplicate) {
          alert("Lesson with the same title or video URL already exists!");
      } else {
          const lesson = { title, videoUrl, description };
          lessonsRef.push(lesson)
              .then(() => {
                  alert("Lesson added successfully!");
                  closeForm("lessonForm");
                  fetchLessons(); // تحديث الجدول مباشرة بعد الإضافة
              })
              .catch((error) => {
                  alert("Error adding lesson: " + error.message);
              });
      }
  });
}

// دالة لجلب الدروس وعرضها في الجدول
function fetchLessons(courseId) {
  const lessonsRef = database.ref(`courses/${courseId}/lessons`);
  const tbody = document.querySelector("#lessons tbody");
  tbody.innerHTML = ""; // مسح المحتوى القديم

  lessonsRef.once("value", (snapshot) => {
      const lessons = snapshot.val();
      if (lessons) {
          Object.keys(lessons).forEach((lessonId) => {
              const lesson = lessons[lessonId];
              const row = `
                  <tr>
                      <td>${lesson.lessonNumber}</td>
                      <td>${lesson.title}</td>
                      <td>${lesson.videoUrl}</td>
                      <td>${lesson.description}</td>
                      <td>
                          <button class="edit" onclick="openEditLessonForm('${courseId}', '${lessonId}')">Edit</button>
                          <button class="delete" onclick="deleteLesson('${courseId}', '${lessonId}')">Delete</button>
                      </td>
                  </tr>
              `;
              tbody.innerHTML += row;
          });
      }
  });
}

// دالة لفتح نموذج تعديل الدرس
function openEditLessonForm(courseId, lessonId) {
  const lessonRef = database.ref(`courses/${courseId}/lessons/${lessonId}`);

  lessonRef.once("value", (snapshot) => {
      const lesson = snapshot.val();
      console.log("Lesson data:", lesson);
      document.getElementById("edit-lesson-title").value = lesson.title;
      document.getElementById("edit-lesson-video-url").value = lesson.videoUrl;
      document.getElementById("edit-lesson-desc").value = lesson.description;

      const submitButton = document.querySelector("#editLessonForm .submit-btn");
      submitButton.onclick = () => editLesson(courseId, lessonId);

      openForm("editLessonForm");
  });
}

// دالة لتحديث بيانات الدرس
function editLesson(courseId, lessonId) {
  const title = document.getElementById("edit-lesson-title").value;
  const videoUrl = document.getElementById("edit-lesson-video-url").value;
  const description = document.getElementById("edit-lesson-desc").value;

  if (!title || !videoUrl || !description) {
      alert("Please fill all fields!");
      return;
  }

  const lessonsRef = database.ref(`courses/${courseId}/lessons`);

  lessonsRef.once("value", (snapshot) => {
      const lessons = snapshot.val();
      let isDuplicate = false;

      if (lessons) {
          Object.keys(lessons).forEach((key) => {
              if (key !== lessonId && (lessons[key].title === title || lessons[key].videoUrl === videoUrl)) {
                  isDuplicate = true;
              }
          });
      }

      if (isDuplicate) {
          alert("Lesson with the same title or video URL already exists!");
      } else {
          const updatedLesson = { title, videoUrl, description };

          database.ref(`courses/${courseId}/lessons/${lessonId}`).update(updatedLesson)
              .then(() => {
                  alert("Lesson updated successfully!");
                  closeForm("editLessonForm");
                  fetchLessons(courseId);
              })
              .catch((error) => {
                  alert("Error updating lesson: " + error.message);
              });
      }
  });
}


// دالة لحذف الدرس
function deleteLesson(courseId, lessonId) {
  if (confirm("Are you sure you want to delete this lesson?")) {
      database.ref(`courses/${courseId}/lessons/${lessonId}`).remove()
          .then(() => {
              alert("Lesson deleted successfully!");
              fetchLessons(courseId); // تحديث الجدول بعد الحذف
          })
          .catch((error) => {
              alert("Error deleting lesson: " + error.message);
          });
  }
}
// دالة لجلب الدروس وعرضها في الجدول مع عناوين الكورسات
function fetchLessons() {
  const lessonsTable = document.getElementById("lessons-table-body");
  lessonsTable.innerHTML = ""; // تفريغ الجدول قبل تعبئته مجددًا

  const coursesRef = database.ref("courses");
  coursesRef.once("value", (coursesSnapshot) => {
      const courses = coursesSnapshot.val();
      if (courses) {
          Object.keys(courses).forEach((courseId) => {
              const course = courses[courseId];
              const lessonsRef = database.ref(`courses/${courseId}/lessons`);

              lessonsRef.once("value", (lessonsSnapshot) => {
                  const lessons = lessonsSnapshot.val();
                  if (lessons) {
                      Object.keys(lessons).forEach((lessonId) => {
                          const lesson = lessons[lessonId];
                          const row = `
                              <tr>
                                  <td>${course.title}</td> 
                                  <td>${lesson.title}</td>
                                
                                  <td><a href="${lesson.videoUrl}" target="_blank">Watch Video</a></td>
                                  <td>
                                      <button class="edit" onclick="openEditLessonForm('${courseId}', '${lessonId}')">Edit</button>
                                      <button class="delete" onclick="deleteLesson('${courseId}', '${lessonId}')">Delete</button>
                                  </td>
                              </tr>
                          `;
                          lessonsTable.innerHTML += row;
                      });
                  }
              });
          });
      }
  });
}

// تحميل الدروس تلقائيًا عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
  fetchLessons();
});

// دالة لإضافة كورس جديد
// function addCourse() {
//   const title = document.getElementById("course-title").value;
//   const category = document.getElementById("course-category").value;
//   const instructor = document.getElementById("instructor-name").value;
//   const description = document.getElementById("course-desc").value;
//   const price = document.getElementById("course-price").value;
//   const duration = document.getElementById("course-duration").value;

//   if (!title || !category || !instructor || !description || !price || !duration) {
//       alert("Please fill all fields!");
//       return;
//   }

//   const coursesRef = database.ref("courses");
//   coursesRef.orderByChild("title").equalTo(title).once("value", (snapshot) => {
//       if (snapshot.exists()) {
//           alert("Course with this title already exists!");
//           return;
//       }

//       const newCourse = {
//           title,
//           category,
//           instructor,
//           description,
//           price,
//           duration
//       };

//       coursesRef.push(newCourse)
//           .then(() => {
//               alert("Course added successfully!");
//               closeForm("courseForm");
//               fetchCourses(); // تحديث الجدول بعد الإضافة
//           })
//           .catch((error) => {
//               alert("Error adding course: " + error.message);
//           });
//   });
// }

function addCourse() {
  const title = document.getElementById("course-title").value;
  const category = document.getElementById("course-category").value;
  const instructor = document.getElementById("instructor-name").value;
  const description = document.getElementById("course-desc").value;
  const price = document.getElementById("course-price").value;
  const duration = document.getElementById("course-duration").value;
  const image = document.getElementById("course-image").value; // Get image URL

  // Validate input fields
  if (
    !title ||
    !category ||
    !instructor ||
    !description ||
    !price ||
    !duration ||
    !image
  ) {
    alert("Please fill all fields!");
    return;
  }

  const coursesRef = database.ref("courses");

  // Check for duplicate course title
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
        image, // Add image to the data
      };

      // Create a new reference for the course
      const newCourseRef = coursesRef.push();
      newCourse.id = newCourseRef.key; // Set the ID for the new course

      // Push the new course to the database
      newCourseRef
        .set(newCourse)
        .then(() => {
          alert("Course added successfully!");
          closeForm("courseForm");
          fetchCourses(); // Update the table after addition
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

      // جلب الفئات وتحديث القائمة المنسدلة قبل تعبئة البيانات
      const categorySelect = document.getElementById("edit-course-category");
      categorySelect.innerHTML = ""; // مسح الخيارات القديمة

      const categoriesRef = database.ref("categories");
      categoriesRef.once("value", (snapshot) => {
          const categories = snapshot.val();
          if (categories) {
              Object.keys(categories).forEach((key) => {
                  const option = document.createElement("option");
                  option.value = categories[key].name;
                  option.textContent = categories[key].name;
                  if (categories[key].name === course.category) {
                      option.selected = true;
                  }
                  categorySelect.appendChild(option);
              });
          }

          // بعد ملء الفئات، نضع باقي بيانات الكورس في النموذج
          document.getElementById("edit-course-title").value = course.title;
          document.getElementById("edit-instructor-name").value = course.instructor;
          document.getElementById("edit-course-desc").value = course.description;
          document.getElementById("edit-course-price").value = course.price;
          document.getElementById("edit-course-duration").value = course.duration;

          openForm("editCourseForm");
      });

      // حفظ التحديثات
      document.querySelector("#editCourseForm .submit-btn").onclick = () => {
          const updatedCourse = {
              title: document.getElementById("edit-course-title").value,
              category: document.getElementById("edit-course-category").value,
              instructor: document.getElementById("edit-instructor-name").value,
              description: document.getElementById("edit-course-desc").value,
              price: document.getElementById("edit-course-price").value,
              duration: document.getElementById("edit-course-duration").value
          };

          courseRef.update(updatedCourse)
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
      courseRef.remove()
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
  categoriesRef.push({ name: categoryName })
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
              name: document.getElementById("edit-category-name").value
          };

          categoryRef.update(updatedCategory)
              .then(() => {
                  // تحديث الكورسات المرتبطة بهذه الفئة
                  const coursesRef = database.ref("courses");
                  coursesRef.once("value", (snapshot) => {
                      const courses = snapshot.val();
                      if (courses) {
                          Object.keys(courses).forEach((key) => {
                              if (courses[key].category === category.name) {
                                  coursesRef.child(key).update({ category: updatedCategory.name });
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

          categoryRef.remove()
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


document.addEventListener("DOMContentLoaded", () => {
  fetchCourses();
  fetchCategories();
  loadPendingRequests(); // تحميل الطلبات المعلقة عند فتح الصفحة
});

function enrollStudent(studentId, courseId) {
  console.log("Received studentId:", studentId);
  console.log("Received courseId:", courseId);

  if (!studentId || !courseId) {
      console.error("Error: studentId or courseId is missing!");
      return;
  }

  try {
      const studentCourseRef = database.ref(`students-courses/${studentId}_${courseId}`);

      studentCourseRef.set({
          student_id: studentId,
          course_id: courseId,
          status: "pending",
          progress: 0
      })
      .then(() => {
          console.log(`Student ${studentId} requested to enroll in course ${courseId}`);
          loadPendingRequests(); // تحديث الطلبات بعد التسجيل
      })
      .catch((error) => {
          console.error("Error enrolling student:", error);
      });
  } catch (error) {
      console.error("Error enrolling student:", error);
  }
}

function loadPendingRequests() {
  const requestsTable = document.getElementById("requests-table-body");
  database.ref("students-courses").orderByChild("status").equalTo("pending").once("value")
      .then(snapshot => {
          console.log("Fetched pending requests:", snapshot.val());
          requestsTable.innerHTML = ""; // تنظيف الجدول قبل إعادة تعبئته

          if (snapshot.exists()) {
              snapshot.forEach(childSnapshot => {
                  const data = childSnapshot.val();
                  const row = `
                      <tr>
                          <td>${data.student_id}</td>
                          <td>${data.course_id}</td>
                          <td>${data.status}</td>
                          <td>
                              <button class="accept-btn" onclick="approveEnrollment('${data.student_id}', '${data.course_id}')">Accept</button>
                              <button class="reject-btn" onclick="rejectEnrollment('${data.student_id}', '${data.course_id}')">Reject</button>
                          </td>
                      </tr>
                  `;
                  requestsTable.innerHTML += row;
              });
          } else {
              requestsTable.innerHTML = "<tr><td colspan='4'>No pending requests</td></tr>";
          }
      })
      .catch(error => {
          console.error("Error fetching pending requests:", error);
      });
}

function approveEnrollment(studentId, courseId) {
  try {
      const studentCourseRef = database.ref(`students-courses/${studentId}_${courseId}`);

      studentCourseRef.update({
          status: "enrolled",
          progress: 0
      })
      .then(() => {
          alert(`Student ${studentId} has been enrolled in course ${courseId}`);
          loadPendingRequests(); // تحديث الطلبات بعد الموافقة
      })
      .catch((error) => {
          console.error("Error approving enrollment:", error);
      });
  } catch (error) {
      console.error("Error approving enrollment:", error);
  }
}

function rejectEnrollment(studentId, courseId) {
  try {
      const studentCourseRef = database.ref(`students-courses/${studentId}_${courseId}`);

      studentCourseRef.remove()
      .then(() => {
          alert(`Enrollment request for student ${studentId} has been removed.`);
          loadPendingRequests(); // تحديث الطلبات بعد الرفض
      })
      .catch((error) => {
          console.error("Error rejecting enrollment:", error);
      });
  } catch (error) {
      console.error("Error rejecting enrollment:", error);
  }
}

// جلب الطلبات pending
// function loadPendingRequests() {
//   const requestsTable = document.getElementById("requests-table-body");
//   database.ref("students-courses").orderByChild("status").equalTo("pending").once("value", snapshot => {
//       requestsTable.innerHTML = "";  // تنظيف الجدول قبل إعادة تعبئته
//       snapshot.forEach(childSnapshot => {
//           const data = childSnapshot.val();
//           const row = `
//               <tr>
//                   <td>${data.student_id}</td>
//                   <td>${data.course_id}</td>
//                   <td>${data.status}</td>
//                   <td>
//                       <button onclick="approveEnrollment('${data.student_id}', '${data.course_id}')">Accept</button>
//                       <button onclick="rejectEnrollment('${data.student_id}', '${data.course_id}')">Reject</button>
//                   </td>
//               </tr>
//           `;
//           requestsTable.innerHTML += row;
//       });
//   });
// }
// // في حاله الموافقه
// function approveEnrollment(studentId, courseId) {
//   try {
//       const studentCourseRef = database.ref(`students-courses/${studentId}_${courseId}`);

//       studentCourseRef.update({
//           status: "enrolled",
//           progress: 0
//       })
//       .then(() => {
//           alert(`Student ${studentId} has been enrolled in course ${courseId}`);
//       })
//       .catch((error) => {
//           console.error("Error approving enrollment:", error);
//       });
//   } catch (error) {
//       console.error("Error approving enrollment:", error);
//   }
// }
// //reject
// function rejectEnrollment(studentId, courseId) {
//   try {
//       const studentCourseRef = database.ref(`students-courses/${studentId}_${courseId}`);

//       studentCourseRef.remove()
//       .then(() => {
//           alert(`Enrollment request for student ${studentId} has been removed.`);
//       })
//       .catch((error) => {
//           console.error("Error rejecting enrollment:", error);
//       });
//   } catch (error) {
//       console.error("Error rejecting enrollment:", error);
//   }
// }


// تحميل البيانات عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
  fetchCourses();
  fetchCategories();
});
