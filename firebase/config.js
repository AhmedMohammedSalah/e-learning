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
