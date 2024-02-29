// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDMadkKGMmrdA2e-lN7QADXIJD_h7E2LSg",
    authDomain: "polterpizza.firebaseapp.com",
    projectId: "polterpizza",
    storageBucket: "polterpizza.appspot.com",
    messagingSenderId: "471297972134",
    appId: "1:471297972134:web:3d645f1452960549c5e167",
    measurementId: "G-CZN50SKVGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const pizzaCol = collection(db, "pizzalib");
// console.log(pizzaCol);

await setDoc(doc(pizzaCol, "cthulhusfavorite"), {
    name: "Cthulhu\'s favorite",
    ingredients: ["Lotus flower", "Squid", "Cheddar", "Parmesan", "Tomato sauce"]
});

