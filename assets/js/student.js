document.addEventListener("DOMContentLoaded", function () {
  const student = Storage.fetchLocalData("userData");
  if (!student) {
    console.error("No student data found!");
    return;
  }

  const studentId = student["uid"];
  const studentName = student["name"];
  document.getElementById("student-name").innerHTML = studentName;
  console.log(studentId);

  // ✅ تحميل الدورات الخاصة بالطالب
  function loadMyCourses() {
    myCourses(studentId, (courses) => {
      const container = document.querySelector(
        "#my-courses .courses-container"
      );
      container.innerHTML = "";
      if (courses.length === 0) {
        container.innerHTML = "<p>No enrolled courses.</p>";
        return;
      }
      courses.forEach((course) => {
        const courseCard = `
                <div class="course-card">
                    <img src="${
                      course.image || "../images/fakeimg.png"
                    }" class="course-image">
                    <h3>${course.title}</h3>
                    <p>Instructor: ${course.instructor || "Unknown"}</p>
                    <p>Category: ${course.category || "General"}</p>
                    <p>Duration: ${course.duration || "N/A"} hours</p>
                    <button class="continue-btn" data-id="${
                      course.id
                    }">Continue Course</button>
                    <button class="viewcourse-btn" data-id="${
                      course.id
                    }">View Course</button>
                </div>`;
        container.innerHTML += courseCard;
      });

      addEventListenersToButtons();
    });
  }

  // ✅ تحميل جميع الدورات
  function loadAllCourses() {
    fetchCourses((allCourses) => {
      myCourses(studentId, (enrolledCourses) => {
        const container = document.querySelector(
          "#all-courses .courses-container"
        );
        container.innerHTML = "";
        if (!allCourses) {
          container.innerHTML = "<p>No courses available.</p>";
          return;
        }

        Object.entries(allCourses).forEach(([id, course]) => {
          const isEnrolled = enrolledCourses.some(
            (enrolledCourse) => enrolledCourse.id === id
          );

          const courseCard = `
                    <div class="course-card">
                        <img src="${
                          course.image || "../images/fakeimg.png"
                        }" class="course-image">
                        <h3>${course.title}</h3>
                        <p>Instructor: ${course.instructor || "Unknown"}</p>
                        <p>Category: ${course.category || "General"}</p>
                        <p>Duration: ${course.duration || "N/A"} hours</p>
                        ${
                          isEnrolled
                            ? `<button class="continue-btn" data-id="${id}">Continue Course</button>`
                            : `<button class="enroll-btn" data-id="${id}">Enroll Now</button>`
                        }
                        <button class="viewcourse-btn" data-id="${id}">View Course</button>
                        <button class="wishlist-btn" data-id="${id}">Add to Wishlist</button>
                    </div>`;
          container.innerHTML += courseCard;
        });

        addEventListenersToButtons();
      });
    });
  }

  // ✅ تحميل الفئات في الفلتر
  function loadCategories() {
    fetchCategories((categories) => {
      const select = document.getElementById("filter-category");
      select.innerHTML = '<option value="">All Categories</option>';
      if (!categories) return;

      Object.values(categories).forEach((category) => {
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        select.appendChild(option);
      });
    });
  }

  // ✅ البحث والتصفية حسب الفئة
  document
    .getElementById("search-courses")
    .addEventListener("input", function () {
      const searchTerm = this.value.trim();
      filterByWord(searchTerm, updateCoursesContainer);
    });

  document
    .getElementById("filter-category")
    .addEventListener("change", function () {
      const category = this.value;
      if (category) {
        filterByCategory(category, updateCoursesContainer);
      } else {
        loadAllCourses(); // Reload all courses when no category is selected
      }
    });

  // ✅ تحديث عرض الدورات بعد البحث أو الفلترة
  function updateCoursesContainer(courses) {
    const container = document.querySelector("#all-courses .courses-container");
    container.innerHTML = "";
    if (courses.length === 0) {
      container.innerHTML = "<p>No matching courses found.</p>";
      return;
    }

    myCourses(studentId, (enrolledCourses) => {
      courses.forEach((course) => {
        const isEnrolled = enrolledCourses.some(
          (enrolledCourse) => enrolledCourse.id === course.id
        );

        const courseCard = `
                    <div class="course-card">
                        <img src="${
                          course.image || "../images/fakeimg.png"
                        }" class="course-image">
                        <h3>${course.title}</h3>
                        <p>Instructor: ${course.instructor || "Unknown"}</p>
                        <p>Category: ${course.category || "General"}</p>
                        <p>Duration: ${course.duration || "N/A"} hours</p>
                        ${
                          isEnrolled
                            ? `<button class="continue-btn" data-id="${course.id}">Continue Course</button>`
                            : `<button class="enroll-btn" data-id="${course.id}">Enroll Now</button>`
                        }
                        <button class="viewcourse-btn" data-id="${
                          course.id
                        }">View Course</button>
                        <button class="wishlist-btn" data-id="${
                          course.id
                        }">Add to Wishlist</button>
                    </div>`;
        container.innerHTML += courseCard;
      });

      addEventListenersToButtons();
    });
  }

  // ✅ وظيفة لإضافة الأحداث للأزرار بعد تحميل الدورات
  function addEventListenersToButtons() {
    // زر التسجيل في الدورة
    document.querySelectorAll(".enroll-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const courseId = this.getAttribute("data-id");
        enrollStudent(studentId, courseId);
        alert("Enrollment request sent!");
      });
    });

    // زر إضافة إلى قائمة الأمنيات
    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const courseId = this.getAttribute("data-id");
        console.log(courseId);
        addToWishlist(courseId);
      });
    });

    // زر عرض الدورة
    document.querySelectorAll(".viewcourse-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const courseId = this.getAttribute("data-id");
        window.location.href = `course-details.html?id=${courseId}`;
      });
    });

    // زر متابعة الدورة
    document.querySelectorAll(".continue-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const courseId = this.getAttribute("data-id");
        window.location.href = `course-details.html?id=${courseId}`;
      });
    });
  }

  // ✅ تحميل البيانات الأولية
  loadMyCourses();
  loadAllCourses();
  loadCategories();
});
