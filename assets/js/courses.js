
// Fetch all courses
function fetchCourses(callback) {
  const coursesRef = database.ref("courses");
  coursesRef.on("value", (snapshot) => {
    const courses = snapshot.val();
    callback(courses);
  });
}
// fetch specific course
function fetchCourseById(courseId, callback) {
  const courseRef = database.ref(`courses/${courseId}`);
  courseRef.once("value", (snapshot) => {
    const course = snapshot.val();
    callback(course);
  });
}

// Add a new course
function addCourse(courseData, onSuccess, onError) {
  const coursesRef = database.ref("courses");
  coursesRef
    .orderByChild("title")
    .equalTo(courseData.title)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        onError("Course with this title already exists!");
      } else {
        coursesRef
          .push(courseData)
          .then(() => onSuccess())
          .catch((error) => onError(error.message));
      }
    });
}

// Update a course
function updateCourse(courseId, updatedData, onSuccess, onError) {
  const courseRef = database.ref(`courses/${courseId}`);
  courseRef
    .update(updatedData)
    .then(() => onSuccess())
    .catch((error) => onError(error.message));
}

// Delete a course
function deleteCourse(courseId, onSuccess, onError) {
  const courseRef = database.ref(`courses/${courseId}`);
  courseRef
    .remove()
    .then(() => onSuccess())
    .catch((error) => onError(error.message));
}

// Fetch all categories
function fetchCategories(callback) {
  const categoriesRef = database.ref("categories");
  categoriesRef.on("value", (snapshot) => {
    const categories = snapshot.val();
    callback(categories);
  });
}

// Add a new category
function addCategory(categoryData, onSuccess, onError) {
  const categoriesRef = database.ref("categories");
  categoriesRef
    .push(categoryData)
    .then(() => onSuccess())
    .catch((error) => onError(error.message));
}

// Update a category
function updateCategory(categoryId, updatedData, onSuccess, onError) {
  const categoryRef = database.ref(`categories/${categoryId}`);
  categoryRef
    .update(updatedData)
    .then(() => onSuccess())
    .catch((error) => onError(error.message));
}

// Delete a category
function deleteCategory(categoryId, onSuccess, onError) {
  const categoryRef = database.ref(`categories/${categoryId}`);
  categoryRef
    .remove()
    .then(() => onSuccess())
    .catch((error) => onError(error.message));
}

// Add a new lesson
function addLesson(courseId, lessonData, onSuccess, onError) {
  const lessonsRef = database.ref(`courses/${courseId}/lessons`);
  lessonsRef
    .push(lessonData)
    .then(() => onSuccess())
    .catch((error) => onError(error.message));
}

function enrollStudent(studentId, courseId) {
  const studentCourseRef = firebase
    .database()
    .ref(`students-courses/${studentId}_${courseId}`);

  studentCourseRef
    .set({
      student_id: studentId,
      course_id: courseId,
      status: "pending",
      progress: 0,
    })
    .then(() => {
      console.log(
        `Student ${studentId} requested to enroll in course ${courseId}`
      );
    })
    .catch((error) => {
      console.error("Error enrolling student:", error);
    });
}
function approveEnrollment(studentId, courseId) {
  const studentCourseRef = firebase
    .database()
    .ref(`students-courses/${studentId}_${courseId}`);

  studentCourseRef
    .update({
      status: "enrolled",
      progress: 0,
    })
    .then(() => {
      console.log(
        `Student ${studentId} has been enrolled in course ${courseId}`
      );
    })
    .catch((error) => {
      console.error("Error approving enrollment:", error);
    });
}
function updateProgress(studentId, courseId, completedLessons, totalLessons) {
  if (totalLessons === 0) {
    console.error("Total lessons cannot be zero.");
    return;
  }

  const progress = Math.round((completedLessons / totalLessons) * 100);

  const studentCourseRef = firebase
    .database()
    .ref(`students-courses/${studentId}_${courseId}`);

  studentCourseRef
    .update({
      progress: progress,
    })
    .then(() => {
      console.log(
        `Progress updated to ${progress}% for student ${studentId} in course ${courseId}`
      );
    })
    .catch((error) => {
      console.error("Error updating progress:", error);
    });
}
function getStudentCourseStatus(studentId, courseId) {
  const studentCourseRef = firebase
    .database()
    .ref(`students-courses/${studentId}_${courseId}`);

  studentCourseRef
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(
          `Student ${studentId} is ${data.status} in course ${courseId}, progress: ${data.progress}%`
        );
      } else {
        console.log(
          `Student ${studentId} is not enrolled in course ${courseId}`
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching student course status:", error);
    });
}
function myCourses(studentId, callback) {
  const coursesRef = firebase.database().ref("students-courses");

  coursesRef
    .once("value", (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No courses found.");
        callback([]);
        return;
      }

      const enrolledCourses = [];
      const studentCourses = snapshot.val();

      for (let key in studentCourses) {
        const course = studentCourses[key];
        if (course.student_id === studentId && course.status === "enrolled") {
          enrolledCourses.push(course.course_id);
        }
      }

      if (enrolledCourses.length === 0) {
        console.log("No enrolled courses found for student:", studentId);
        callback([]);
        return;
      }

      const allCoursesRef = firebase.database().ref("courses");
      allCoursesRef.once("value", (courseSnapshot) => {
        if (!courseSnapshot.exists()) {
          console.log("No course details found.");
          callback([]);
          return;
        }

        const allCourses = courseSnapshot.val();
        const studentCoursesDetails = enrolledCourses
          .map((courseId) => allCourses[courseId])
          .filter((course) => course);

        callback(studentCoursesDetails);
      });
    })
    .catch((error) => {
      console.error("Error fetching myCourses:", error);
      callback([]);
    });
}
function myCourses(studentId, callback) {
  const coursesRef = firebase.database().ref("students-courses");

  coursesRef
    .once("value", (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No courses found.");
        callback([]);
        return;
      }

      const enrolledCourses = [];
      const studentCourses = snapshot.val();

      for (let key in studentCourses) {
        const course = studentCourses[key];
        if (course.student_id === studentId && course.status === "enrolled") {
          enrolledCourses.push(course.course_id);
        }
      }

      if (enrolledCourses.length === 0) {
        console.log("No enrolled courses found for student:", studentId);
        callback([]);
        return;
      }

      const allCoursesRef = firebase.database().ref("courses");
      allCoursesRef.once("value", (courseSnapshot) => {
        if (!courseSnapshot.exists()) {
          console.log("No course details found.");
          callback([]);
          return;
        }

        const allCourses = courseSnapshot.val();
        const studentCoursesDetails = enrolledCourses
          .map((courseId) => allCourses[courseId])
          .filter((course) => course);

        callback(studentCoursesDetails);
      });
    })
    .catch((error) => {
      console.error("Error fetching myCourses:", error);
      callback([]);
    });
}
function filterByCategory(category, callback) {
  const coursesRef = firebase.database().ref("courses");

  coursesRef
    .once("value", (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No courses found.");
        callback([]);
        return;
      }

      const filteredCourses = [];
      snapshot.forEach((childSnapshot) => {
        const course = childSnapshot.val();
        if (course.category === category) {
          filteredCourses.push(course);
        }
      });

      callback(filteredCourses);
    })
    .catch((error) => {
      console.error("Error filtering courses by category:", error);
      callback([]);
    });
}
function filterByWord(word, callback) {
  const coursesRef = firebase.database().ref("courses");

  coursesRef
    .once("value", (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No courses found.");
        callback([]);
        return;
      }

      const filteredCourses = [];
      snapshot.forEach((childSnapshot) => {
        const course = childSnapshot.val();
        if (
          course.title.toLowerCase().includes(word.toLowerCase()) ||
          course.description.toLowerCase().includes(word.toLowerCase())
        ) {
          filteredCourses.push(course);
        }
      });

      callback(filteredCourses);
    })
    .catch((error) => {
      console.error("Error filtering courses by word:", error);
      callback([]);
    });
}
function currentCourse(courseId, callback) {
  const courseRef = firebase.database().ref("courses").child(courseId);

  courseRef
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.key, ...snapshot.val() });
      } else {
        callback(null);
      }
    })
    .catch((error) => {
      console.error("Error fetching course:", error);
      callback(null);
    });
}
function addToWishlist(courseId) {
  if (!courseId) {
    console.error("Invalid course ID!");
    return;
  }

  fetchCourseById(courseId, (course) => {
    if (!course) {
      console.error("Course not found!");
      return;
    }
    // Storage.saveLocalData("wishlist",{});
    Storage.manageLocalSpecific("wishlist", courseId, course, "create");
    console.log(`Course "${course.title}" added to wishlist.`);
  });
}


