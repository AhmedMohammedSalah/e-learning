document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase (if not already initialized in config.js)
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const database = firebase.database();

  // Extract courseId from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");
  console.log(courseId);

  if (!courseId) {
    console.error("Course ID not found in URL!");
    alert("Invalid course URL. Please check the link and try again.");
    return;
  }

  // Fetch course data from Firebase
  function fetchCourseData(courseId, callback) {
    const courseRef = database.ref(`courses/${courseId}`);
    courseRef
      .once("value", (snapshot) => {
        const course = snapshot.val();
        if (course) {
          callback(course);
        } else {
          console.error("Course not found!");
          alert("Course not found. Please check the URL and try again.");
        }
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
        alert(
          "An error occurred while fetching the course data. Please try again."
        );
      });
  }

  // Fetch lessons for the course from Firebase
  function fetchLessons(courseId, callback) {
    const lessonsRef = database.ref(`courses/${courseId}/lessons`);
    lessonsRef
      .once("value", (snapshot) => {
        const lessons = snapshot.val();
        if (lessons) {
          callback(lessons);
        } else {
          console.error("No lessons found for this course!");
          alert("No lessons found for this course.");
        }
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
        alert(
          "An error occurred while fetching the lessons. Please try again."
        );
      });
  }

  // Display course data in the HTML
  function displayCourseData(course) {
    if (!course) {
      console.error("Course data is null or undefined.");
      return;
    }

    // Update the course title
    document.getElementById("course-title").textContent =
      course.title || "Introduction to the Course";

    // Update the course description
    document.getElementById("course-description").textContent =
      course.description ||
      "This course provides an overview of the essential tools and techniques needed to start your learning journey.";
  }

  // Display lessons in the HTML
  function displayLessons(lessons) {
    const courseContent = document.getElementById("course-content");
    courseContent.innerHTML = "";

    Object.entries(lessons).forEach(([lessonId, lesson], index) => {
      const lessonItem = document.createElement("div");
      lessonItem.className = "course-item";
      lessonItem.textContent = lesson.title || `Lesson ${index + 1}`;
      lessonItem.setAttribute("data-id", lessonId);
      lessonItem.setAttribute("data-video-url", lesson.videoUrl || "");
      lessonItem.setAttribute("data-description", lesson.description || "");

      // Add click event to load the lesson video and description
      lessonItem.addEventListener("click", () => {
        loadLesson(lesson);
      });

      courseContent.appendChild(lessonItem);
    });

    // Load the first lesson by default
    const firstLesson = Object.values(lessons)[0];
    if (firstLesson) {
      loadLesson(firstLesson);
    }
  }

  // Load a specific lesson
  function loadLesson(lesson) {
    if (!lesson) {
      console.error("Lesson data is null or undefined.");
      return;
    }

    document.getElementById("course-video").src =
      lesson.videoUrl ||
      "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1";
    document.getElementById("course-description").textContent =
      lesson.description || "No description available.";
  }

  // Handle "Previous" button click
  function prevVideo() {
    const currentLesson = document.querySelector(".course-item.current");
    if (currentLesson && currentLesson.previousElementSibling) {
      const prevLesson = currentLesson.previousElementSibling;
      const lesson = {
        videoUrl: prevLesson.getAttribute("data-video-url"),
        description: prevLesson.getAttribute("data-description"),
      };
      loadLesson(lesson);

      // Update active class
      currentLesson.classList.remove("current");
      prevLesson.classList.add("current");
    }
  }

  // Handle "Next" button click
  function nextVideo() {
    const currentLesson = document.querySelector(".course-item.current");
    if (currentLesson && currentLesson.nextElementSibling) {
      const nextLesson = currentLesson.nextElementSibling;
      const lesson = {
        videoUrl: nextLesson.getAttribute("data-video-url"),
        description: nextLesson.getAttribute("data-description"),
      };
      loadLesson(lesson);

      // Update active class
      currentLesson.classList.remove("current");
      nextLesson.classList.add("current");
    }
  }

  // Fetch and display the course data and lessons
  fetchCourseData(courseId, (course) => {
    displayCourseData(course);
    fetchLessons(courseId, (lessons) => {
      displayLessons(lessons);
    });
  });

  // Attach event listeners to buttons
  document.getElementById("prev-button").addEventListener("click", prevVideo);
  document.getElementById("next-button").addEventListener("click", nextVideo);
});
