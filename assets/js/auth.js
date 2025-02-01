// Validate input fields for login/register
function validateAuthFields(fields) {
  // Ensure all fields are filled and valid
}

// Log in the user
function loginUser(email, password) {
  // Fetch user data from LocalStorage/Firebase
  // Return user object or false
}

// Register a new user
function registerUser(userDetails) {
  // Add user to LocalStorage/Firebase
  // Perform validation
}

// Log out the user
function logoutUser() {
  // Clear session data
}

// Function to handle form submission
var registryForm = document.getElementById("registration-form");
if (registryForm) {
  registryForm.addEventListener("submit", function (event) {
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
}
// Function to validate email
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

var loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("data retreved ");

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
              alert("Login successful! Redirecting to Home page...");
              window.location.href = "../../index.html";
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
}
