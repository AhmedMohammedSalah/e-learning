// getAllCourses()
// Retrieves all courses.
function getAllCourses() {
  // 1. Get courses from local storage.
  // 2. If empty, fetch from Firebase.
  // 3. Return an array of courses.
}

// getCourseById(id)
// Retrieves a course by its ID.
function getCourseById(id) {
  // 1. Search for the course in local storage.
  // 2. Return course details.
}

// addCourse(courseData)
// Adds a new course.
function addCourse(courseData) {
  // 1. Validate course data.
  // 2. Assign a unique ID.
  // 3. Save to local storage & Firebase.
}

// updateCourse(id, updatedData)
// Updates an existing course.
function updateCourse(id, updatedData) {
  // 1. Locate the course by ID.
  // 2. Update fields.
  // 3. Save to storage & Firebase.
}

// deleteCourse(id)
// Removes a course.
function deleteCourse(id) {
  // 1. Find course by ID.
  // 2. Remove it from local storage.
  // 3. Sync deletion with Firebase.
}

// enrollInCourse(studentId, courseId)
// Enrolls a student in a course.
function enrollInCourse(studentId, courseId) {
  // 1. Check if student is already enrolled.
  // 2. Add course to student’s enrolled courses.
  // 3. Save to storage & Firebase.
}

// filterCoursesByCategory(categoryId)
// Filters courses based on a category.
function filterCoursesByCategory(categoryId) {
  // 1. Get all courses.
  // 2. Filter by category ID.
  // 3. Return filtered list.
}

// renderCourses()
// Displays courses on the homepage.
function renderCourses() {
  // 1. Fetch courses.
  // 2. Create course cards dynamically.
  // 3. Append them to the course section.
}
