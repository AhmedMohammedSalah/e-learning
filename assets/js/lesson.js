document.addEventListener("DOMContentLoaded", initCoursePage);

function initCoursePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  if (!courseId) {
    console.error("Course ID not found in URL!");
    alert("Invalid course URL. Please check the link and try again.");
    return;
  }

  fetchCourseData(courseId, (course) => {
    displayCourseData(course);
    fetchLessons(courseId, displayLessons);
  });

  attachEventListeners();
}

// 🔹 تحميل بيانات الدورة من Firebase
function fetchCourseData(courseId, callback) {
  database.ref(`courses/${courseId}`).once("value", (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      console.error("Course not found!");
      alert("This course does not exist.");
    }
  });
}

// 🔹 عرض بيانات الدورة في HTML
function displayCourseData(course) {
  if (!course) return;

  document.getElementById("course-title").textContent =
    course.title || "Course Title";
  document.getElementById("course-description").textContent =
    course.description || "No description available.";
}

// 🔹 تحميل بيانات الدروس من Firebase
function fetchLessons(courseId, callback) {
  database.ref(`courses/${courseId}/lessons`).once("value", (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      console.warn("No lessons found for this course.");
    }
  });
}

// 🔹 عرض الدروس في HTML
function displayLessons(lessons) {
  const courseContent = document.getElementById("course-content");
  courseContent.innerHTML = "";

  Object.entries(lessons).forEach(([lessonId, lesson], index) => {
    const lessonItem = document.createElement("div");
    lessonItem.className = "course-item";
    lessonItem.textContent = lesson.title || `Lesson ${index + 1}`;
    lessonItem.dataset.id = lessonId;
    lessonItem.dataset.videoUrl = lesson.videoUrl || "";
    lessonItem.dataset.description = lesson.description || "";

    lessonItem.addEventListener("click", () => loadLesson(lesson));

    courseContent.appendChild(lessonItem);
  });

  if (Object.keys(lessons).length > 0) {
    loadLesson(Object.values(lessons)[0]);
  }
}

// 🔹 تحميل الفيديو والوصف الخاص بالدرس
function loadLesson(lesson) {
  if (!lesson) return;

  document.getElementById("course-video").src =
    lesson.videoUrl ||
    "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1";
  document.getElementById("course-description").textContent =
    lesson.description || "No description available.";
}

// 🔹 تحديث نسبة التقدم للطالب
function updateProgress(studentId, courseId, completedLessons, totalLessons) {
  const progress = Math.round((completedLessons / totalLessons) * 100);

  document.getElementById("progress-bar").style.width = `${progress}%`;
  document.getElementById(
    "progress-text"
  ).textContent = `Progress: ${completedLessons}/${totalLessons} videos completed`;

  database
    .ref(`students-courses/${studentId}_${courseId}`)
    .update({ progress });
}

// 🔹 التحقق مما إذا كان الطالب أكمل جميع الدروس
function checkIfAllLessonsWatched(studentId, courseId, lessons) {
  const lessonIds = Object.keys(lessons);
  let watchedCount = 0;

  lessonIds.forEach((lessonId) => {
    database
      .ref(`students-lessons/${studentId}_${courseId}_${lessonId}`)
      .once("value", (snapshot) => {
        if (snapshot.exists() && snapshot.val().watched) {
          watchedCount++;
          if (watchedCount === lessonIds.length) {
            document.getElementById("certificate-button").style.display =
              "block";
          }
        }
      });
  });
}

// 🔹 وضع علامة على الدرس كمشاهد
function markLessonAsWatched(studentId, courseId, lessonId, lessons) {
  database
    .ref(`students-courses/${studentId}_${courseId}/watched/${lessonId}`)
    .set(true);

  database
    .ref(`students-courses/${studentId}_${courseId}/watched`)
    .once("value", (snapshot) => {
      const watchedLessons = snapshot.val() || {};
      const completedLessons = Object.keys(watchedLessons).length;
      updateProgress(
        studentId,
        courseId,
        completedLessons,
        Object.keys(lessons).length
      );

      if (completedLessons === Object.keys(lessons).length) {
        document.getElementById("certificate-button").style.display = "block";
      }
    });
}

// 🔹 الانتقال إلى صفحة الشهادة بعد إنهاء جميع الدروس
function redirectToCertificate(studentId, courseId) {
  window.location.href = `certificate.html?studentId=${studentId}&courseId=${courseId}`;
}

// 🔹 التنقل بين الفيديوهات (السابق والتالي)
function changeVideo(direction) {
  const currentLesson = document.querySelector(".course-item.current");
  if (!currentLesson) return;

  const newLesson =
    direction === "prev"
      ? currentLesson.previousElementSibling
      : currentLesson.nextElementSibling;

  if (newLesson) {
    loadLesson({
      videoUrl: newLesson.dataset.videoUrl,
      description: newLesson.dataset.description,
    });

    currentLesson.classList.remove("current");
    newLesson.classList.add("current");
  }
}

function prevVideo() {
  changeVideo("prev");
}

function nextVideo() {
  changeVideo("next");
}

// 🔹 تسجيل الأحداث (Event Listeners)
function attachEventListeners() {
  document.getElementById("prev-button").addEventListener("click", prevVideo);
  document.getElementById("next-button").addEventListener("click", nextVideo);
}
