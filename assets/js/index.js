// index.js
document.addEventListener('DOMContentLoaded', () => {
    const courses = CourseManager.getCourses();  // Get courses from LocalStorage or Firebase
    displayCourses(courses);
});

function displayCourses(courses) {
    const container = document.getElementById("coursesContainer");
    container.innerHTML = "";  
    courses.forEach(course => {
        const courseDiv = document.createElement("div");
        courseDiv.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.category}</p>
            <p>${course.description}</p>
        `;
        container.appendChild(courseDiv);
    });
}

document.getElementById("categoryFilter").addEventListener("change", filterCourses);
document.getElementById("searchInput").addEventListener("input", filterCourses);

function filterCourses() {
    const category = document.getElementById("categoryFilter").value;
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();

    const filteredCourses = CourseManager.getCourses().filter(course => {
        return (category ? course.category === category : true) && 
            (course.title.toLowerCase().includes(searchQuery) || course.description.toLowerCase().includes(searchQuery));
    });

    displayCourses(filteredCourses);
}
