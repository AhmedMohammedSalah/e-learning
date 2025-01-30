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
  
  // Function to handle login form submission
  document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
  
      // Get form values
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
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
  
      // Sign in user with Firebase Authentication
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
  
          // Fetch user data from Firebase Realtime Database
          const databaseRef = database.ref("users/" + user.uid);
          databaseRef
            .once("value")
            .then((snapshot) => {
              const userData = snapshot.val();
              if (userData) {
                console.log("User data fetched successfully:", userData);
                alert("Login successful! Redirecting to index page...");
                window.location.href = "index.html";
              } else {
                alert("User data not found in database.");
              }
            })
            .catch((error) => {
              console.error("Error fetching user data: ", error);
              alert("Error fetching user data: " + error.message);
            });
        })
        .catch((error) => {
          console.error("Error during login: ", error);
          alert("Error: " + error.message);
        });
    });
  
  // Function to validate email
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }