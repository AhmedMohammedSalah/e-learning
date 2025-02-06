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

  function loadMyCourses() {
    myCourses(studentId, (courses) => {
      renderCourses("#my-courses .courses-container", courses, true);
    });
  }

  async function loadAllCourses() {
    try {
      const allCourses = await fetchCoursesAsync();
      const enrolledCourses = await myCoursesAsync(studentId);
      const wishlist = await fetchWishlistAsync();
      console.log(allCourses);
      console.log(enrolledCourses);
      console.log(wishlist);

      const courseArray = Object.entries(allCourses || {}).map(
        ([id, course]) => ({
          ...course,
          id,
          isEnrolled: enrolledCourses.some(
            (enrolled) => enrolled.course_id === id
          ),
          isInWishlist: wishlist.some(
            (wishlistCourse) => wishlistCourse.id === id
          ),
        })
      );

      renderCourses("#all-courses .courses-container", courseArray);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  }

  function fetchCoursesAsync() {
    return new Promise((resolve, reject) => {
      fetchCourses((courses) => {
        if (courses) {
          resolve(courses);
        } else {
          reject("No courses found");
        }
      });
    });
  }

  function myCoursesAsync(studentId) {
    return new Promise((resolve, reject) => {
      myCourses(studentId, (enrolledCourses) => {
        resolve(enrolledCourses);
      });
    });
  }

  function fetchWishlistAsync() {
    return new Promise((resolve) => {
      fetchWishlist((wishlist) => {
        resolve(wishlist);
      });
    });
  }

  function loadCategories() {
    fetchCategories((categories) => {
      const select = document.getElementById("filter-category");
      select.innerHTML = '<option value="">All Categories</option>';

      Object.values(categories || {}).forEach((category) => {
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        select.appendChild(option);
      });
    });
  }

  function loadWishlist() {
    fetchWishlist((wishlist) => {
      renderCourses("#wishlist-container", wishlist);
    });
  }

  function renderCourses(containerSelector, courses, isMyCourses = false) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error(
        `Container with selector '${containerSelector}' not found.`
      );
      return;
    }
    container.innerHTML = "";

    if (!courses || courses.length === 0) {
      container.innerHTML = "<p>No courses found.</p>";
      return;
    }

    const defaultImage = "./assets/images/fakeimg.png";

    function getImageSrc(image) {
      return image ? image : defaultImage;
    }
    if (containerSelector == "#wishlist-container") {
      courses.forEach((course) => {
        const courseCard = `
      <div class="course-card">
        <img src="${getImageSrc(course.image)}" class="course-image">
        <h3>${course.title}</h3>
        <p>Instructor: ${course.instructor || "Unknown"}</p>
        <p>Category: ${course.category || "General"}</p>
        <p>Duration: ${course.duration || "N/A"} hours</p>
        <p>Price: ${course.price || "N/A"} LE</p>
        ${
          isMyCourses || course.isEnrolled
            ? `<button class="continue-btn" data-id="${course.id}">Continue Course</button>`
            : `
              <button class="enroll-btn" data-id="${course.id}">Enroll Now</button>
              <button class="viewcourse-btn" data-id="${course.id}">View Course</button>
            <button class="remove-wishlist-btn" data-id="${course.id}">Remove from Wishlist</button>
            `
        }
      </div>`;
        container.innerHTML += courseCard;
      });

      addEventListenersToButtons();
      return;
    }
    courses.forEach((course) => {
      const courseCard = `
      <div class="course-card">
        <img src="${getImageSrc(course.image)}" class="course-image">
        <h3>${course.title}</h3>
        <p>Instructor: ${course.instructor || "Unknown"}</p>
        <p>Category: ${course.category || "General"}</p>
        <p>Duration: ${course.duration || "N/A"} hours</p>
        <p>Price: ${course.price || "N/A"} LE</p>
        ${
          isMyCourses || course.isEnrolled
            ? `<button class="continue-btn" data-id="${course.id}">Continue Course</button>`
            : `
              <button class="enroll-btn" data-id="${
                course.id
              }">Enroll Now</button>
              <button class="viewcourse-btn" data-id="${
                course.id
              }">View Course</button>
              ${
                course.isInWishlist
                  ? `<button class="remove-wishlist-btn" data-id="${course.id}">Remove from Wishlist</button>`
                  : `<button class="wishlist-btn" data-id="${course.id}">Add to Wishlist</button>`
              }
            `
        }
      </div>`;
      container.innerHTML += courseCard;
    });

    addEventListenersToButtons();
  }

  function handleSearch() {
    const searchTerm = this.value.trim();
    filterByWord(searchTerm, updateCoursesContainer);
  }

  function handleCategoryFilter() {
    const category = this.value;
    category
      ? filterByCategory(category, updateCoursesContainer)
      : loadAllCourses();
  }

  function updateCoursesContainer(filteredCourses) {
    myCourses(studentId, (enrolledCourses) => {
      fetchWishlist((wishlist) => {
        const courses = filteredCourses.map((course) => ({
          ...course,
          isEnrolled: enrolledCourses.some(
            (enrolled) => enrolled.id === course.id
          ),
          isInWishlist: wishlist.some(
            (wishlistCourse) => wishlistCourse.id === course.id
          ),
        }));

        renderCourses("#all-courses .courses-container", courses);
      });
    });
  }

  function addEventListenersToButtons() {
    document.querySelectorAll(".enroll-btn").forEach((btn) =>
      btn.addEventListener("click", function () {
        enrollStudent(studentId, this.dataset.id);
        alert("Enrollment request sent!");
        loadAllCourses();
      })
    );

    document.querySelectorAll(".wishlist-btn").forEach((btn) =>
      btn.addEventListener("click", function () {
        addToWishlist(this.dataset.id);
        loadAllCourses();
        loadWishlist();
      })
    );

    document.querySelectorAll(".remove-wishlist-btn").forEach((btn) =>
      btn.addEventListener("click", function () {
        removeFromWishlist(this.dataset.id);
        loadAllCourses();
        loadWishlist();
      })
    );

    document.querySelectorAll(".viewcourse-btn").forEach((btn) =>
      btn.addEventListener("click", function () {
        window.location.href = `course.html?id=${this.dataset.id}`;
      })
    );

    document.querySelectorAll(".continue-btn").forEach((btn) =>
      btn.addEventListener("click", function () {
        window.location.href = `lesson.html?id=${this.dataset.id}`;
      })
    );
  }
  document
    .getElementById("logout")
    .addEventListener("click", function () {
      Storage.removeLocalData("userData");
      Storage.removeLocalData("whichlist");
    });
  document
    .getElementById("search-courses")
    .addEventListener("input", handleSearch);
  document
    .getElementById("filter-category")
    .addEventListener("change", handleCategoryFilter);

  loadMyCourses();
  loadAllCourses();
  loadCategories();
  loadWishlist();
});
