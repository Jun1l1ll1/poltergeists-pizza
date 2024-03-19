// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getFirestore, collection, setDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
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

// Initialize and refrence Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Get pizzas
const pizza_lib = collection(db, "pizzalib");


// CREATE A PIZZA
// await setDoc(doc(pizza_lib, "satanspizza"), {
//     name: "Satan\'s pizza",
//     ingredients: ["Goat meat", "Olives", "Puer", "Poison ivy", "\"Special\" sauce"],
//     price: 666
// });


// PRINT THE PIZZAS ON PAGE
let dungeon_html_obj = document.getElementById("pizza_dungeon");
const pizza_docs = await getDocs(pizza_lib); 
dungeon_html_obj.innerHTML = "";
pizza_docs.forEach((doc) => {
    let ingred_txt = String(doc.data().ingredients).replaceAll(",", " • ");

    dungeon_html_obj.innerHTML += `
        <div class="pizza_cont" id="${doc.id}">
            <div class="pizza_img">
                <img src="assets/placeholder.webp" alt=""/>
                <div class="pizza_settings"></div>
            </div>
            <div class="pizza_head_align">
                <h2>${doc.data().name}</h2>
                <p>${doc.data().price},-</p>
            </div>
            <p style="width: 300px;">${ingred_txt}</p>
        </div>
        `
    console.log(doc.id, " => ", doc.data());
});
