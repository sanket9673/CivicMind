import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDoG5BxEgTgDE2regx3LvIGPwq2cdLPXb4",
    authDomain: "newconnect-26b26.firebaseapp.com",
    projectId: "newconnect-26b26",
    storageBucket: "newconnect-26b26.appspot.com",
    messagingSenderId: "164407708826",
    appId: "1:164407708826:web:701d4a9ed960a99c34a323"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let userId = null;

onAuthStateChanged(auth, user => {
    if (user) {
        userId = user.uid; // Get the logged-in user's ID
    } else {
        // No user is signed in, redirect to login page
        window.location.href = "../SIGNUP/signup.html";
    }
});