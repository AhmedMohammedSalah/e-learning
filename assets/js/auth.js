// Utility Functions
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const showError = (elementId, message) => {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
};

const clearError = (elementId) => {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = "";
  }
};

// Firebase Functions
const registerUserWithFirebase = async (email, password, userDetails) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

    const databaseRef = database.ref("users/" + user.uid);
    await databaseRef.set(userDetails);

    console.log("User registered and data saved successfully!");
    return user;
  } catch (error) {
    console.error("Error during registration: ", error);
    throw error;
  }
};

const loginUserWithFirebase = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

    const databaseRef = database.ref("users/" + user.uid);
    const snapshot = await databaseRef.once("value");
    const userData = snapshot.val();

    if (!userData) {
      throw new Error("User data not found in database.");
    }

    console.log("User data fetched successfully:", userData);
    return userData;
  } catch (error) {
    console.error("Error during login: ", error);
    throw error;
  }
};

// Form Handlers
const handleRegistration = async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const gender = document.getElementById("gender").value;

  // Validate email
  if (!validateEmail(email)) {
    showError("emailError", "Please enter a valid email address.");
    return;
  } else {
    clearError("emailError");
  }

  // Validate password
  if (!validatePassword(password)) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  // Prepare user details
  const userDetails = {
    name,
    phone,
    email,
    gender,
    last_login: Date.now(),
  };

  try {
    await registerUserWithFirebase(email, password, userDetails);
    alert("Registration successful! Redirecting to login page...");
    window.location.href = "login.html";
  } catch (error) {
    alert("Error: " + error.message);
  }
};

const handleLogin = async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validate email
  if (!validateEmail(email)) {
    showError("emailError", "Please enter a valid email address.");
    return;
  } else {
    clearError("emailError");
  }

  // Validate password
  if (!validatePassword(password)) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try {
    await loginUserWithFirebase(email, password);
    alert("Login successful! Redirecting to Home page...");
    window.location.href = "../../index.html";
  } catch (error) {
    alert("Error: " + error.message);
  }
};

// Attach Event Listeners
const registryForm = document.getElementById("registration-form");
if (registryForm) {
  registryForm.addEventListener("submit", handleRegistration);
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}
