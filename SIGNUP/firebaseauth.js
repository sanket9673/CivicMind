import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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

const submit = document.getElementById('register');
submit.addEventListener("click", function (event) {
    event.preventDefault();

    const name = document.getElementById('Name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("Registering user with email:", email);

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            localStorage.setItem('userName', name);
            // Signed up 
            const user = userCredential.user;
            alert("User created successfully!");
            window.location.href = "../dashboard/dash.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error during registration:", errorMessage);
            alert(errorMessage);
        });
});


