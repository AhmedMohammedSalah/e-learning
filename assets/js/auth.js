// registerUser(email, password, userType)
// Registers a new user and stores user details in local storage & Firebase.
function registerUser(email, password, userType) {
  // 1. Validate email & password (check empty fields, password strength, etc.).
  // 2. Check if the email already exists in local storage.
  // 3. Hash the password (if required).
  // 4. Store user data in local storage.
  // 5. Sync with Firebase (if enabled).
  // 6. Redirect user to the dashboard (student.html or admin.html).
}

// loginUser(email, password)
// Authenticates user and returns their details.
function loginUser(email, password) {
  // 1. Retrieve user data from local storage.
  // 2. Check if email exists.
  // 3. Validate password.
  // 4. Save login state (e.g., in session storage).
  // 5. Redirect user to their respective dashboard.
}

// logoutUser()
// Logs out the current user.
function logoutUser() {
  // 1. Clear user session data.
  // 2. Redirect to index.html (login page).
}

// isAuthenticated()
// Checks if a user is logged in.
function isAuthenticated() {
  // 1. Get user session details.
  // 2. Return true if user is logged in, otherwise false.
}

// getCurrentUser()
// Retrieves the logged-in user’s data.
function getCurrentUser() {
  // 1. Retrieve user info from session/local storage.
  // 2. Return user details (ID, name, type, etc.).
}

// redirectIfNotLoggedIn()
// Redirects user to login page if they are not authenticated.
function redirectIfNotLoggedIn() {
  // 1. Check if user is logged in.
  // 2. If not, redirect to index.html.
}
