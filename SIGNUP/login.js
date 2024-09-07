import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDoG5BxEgTgDE2regx3LvIGPwq2cdLPXb4",
    authDomain: "newconnect-26b26.firebaseapp.com",
    projectId: "newconnect-26b26",
    storageBucket: "newconnect-26b26.appspot.com",
    messagingSenderId: "164407708826",
    appId: "1:164407708826:web:701d4a9ed960a99c34a323"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



const login = document.getElementById('login');
login.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("Logging in user with email:", email);

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            alert("Logged in successfully!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error during login:", errorMessage);
            alert(errorMessage);
        });
});
