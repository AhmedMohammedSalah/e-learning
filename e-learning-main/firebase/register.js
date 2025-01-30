// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZNVofYeeiFtjIvsbHm8HqwCXdvZ7a9IY",
  authDomain: "e-learning-8775c.firebaseapp.com",
  databaseURL: "https://e-learning-8775c-default-rtdb.firebaseio.com/", // رابط قاعدة البيانات
  projectId: "e-learning-8775c",
  storageBucket: "e-learning-8775c.appspot.com",
  messagingSenderId: "272327854098",
  appId: "1:272327854098:web:25ad43c1198d010541b0cb",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Function to handle form submission
document
  .getElementById("registration-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const gender = document.getElementById("gender").value;

    // Validate email
    if (!validateEmail(email)) {
      document.getElementById("emailError").textContent =
        "Please enter a valid email address.";
      return;
    } else {
      document.getElementById("emailError").textContent = "";
    }

    // Validate password (minimum 6 characters)
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    // Register user with Firebase Authentication
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("User registered successfully:", userCredential.user);
        const user = userCredential.user;

        // Save user data to Firebase Realtime Database
        const userData = {
          name: name,
          phone: phone,
          email: email,
          gender: gender,
          last_login: Date.now(),
        };

        const databaseRef = database.ref("users/" + user.uid);
        databaseRef
          .set(userData)
          .then(() => {
            console.log("User data saved successfully!");
            alert("Registration successful! Redirecting to login page...");
            window.location.href = "login.html";
          })
          .catch((error) => {
            console.error("Error saving user data: ", error);
            alert("Error saving user data: " + error.message);
          });
      })
      .catch((error) => {
        console.error("Error during registration: ", error);
        alert("Error: " + error.message);
      });
  });

// Function to validate email
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}