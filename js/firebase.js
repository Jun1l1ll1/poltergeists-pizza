// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    setDoc, 
    getDocs, 
    getDoc,
    updateDoc,
    doc,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
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

const storage = getStorage();

const auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9099");



// AUTH: EMAIL & PASSWORD
// Create
export const create_email_password = async () => {
    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    const user_credential = await createUserWithEmailAndPassword(auth, email, password);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            create_user_doc(user.uid);
        } else {
            console.error("User not logged in...")
        }
    });

    // alert("Successfully created user. You are now logged in!");

    try {
        if (window.location.href.split("#")[1] == "dungeon") {
            goTo_dungeon();
        } else if (window.location.href.split("#")[1] == "contract") {
            goTo_contract();
        } else {
            goTo_home();
        }
    } catch (err) {
        goTo_home();
    }
}

// Login
export const login_email_password = async () => {
    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;
    
    const user_credential = await signInWithEmailAndPassword(auth, email, password);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            update_cart_from_db(user.uid);
        } else {
            console.error("User not logged in...")
        }
    });

    // alert("Successfully logged in!");

    try {
        if (window.location.href.split("#")[1] == "dungeon") {
            goTo_dungeon();
        } else if (window.location.href.split("#")[1] == "contract") {
            goTo_contract();
        } else {
            goTo_home();
        }
    } catch (err) {
        goTo_home();
    }
}

export function logout() {
    signOut(auth).then(() => {
        document.cookie = "cart=[]";
        shopping_cart = [];
        document.getElementById("login_link").style.display = "block";
        document.getElementById("logout_btn").style.display = "none";
        update_cart_visuals();
    }).catch((err) => {
        console.error(err)
    });
}


export async function is_signed_in() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById("login_link").style.display = "none";
            document.getElementById("logout_btn").style.display = "block";
            if (shopping_cart.length <= 0) {
                update_cart_from_db(user.uid);
            }
        } else {
            console.log("User is not signed in")
        }
    });
}

async function update_cart_from_db(UID) {
    const user_col = collection(db, "users");
    const user_doc = await getDoc(doc(user_col, UID));
    let db_cart;
    try {
        db_cart = user_doc.data().cart;
    } catch (err) {
        create_user_doc(UID);
        db_cart = user_doc.data().cart;
    }
    console.log(db_cart);
    if (db_cart.length > 0) {
        shopping_cart = [];
        for (let item of db_cart) {
            console.log(item)
            let parsed_item;
            try {
                parsed_item = JSON.parse(item);
            } catch (err) {
                parsed_item = item;
            }
            shopping_cart.push(parsed_item);
        }
        update_cart_visuals();
        document.cookie = "cart="+JSON.stringify(shopping_cart);
    }
}

async function create_user_doc(UID) {
    const user_col = collection(db, "users");
    await setDoc(doc(user_col, UID), {
        cart: []
    });
    console.log(UID);
}



// Get pizzas
const pizza_lib = collection(db, "pizzalib");


// CREATE A PIZZA
// await setDoc(doc(pizza_lib, "satanspizza"), {
//     name: "Satan\'s pizza",
//     ingredients: ["Goat meat", "Olives", "Puer", "Poison ivy", "\"Special\" sauce"],
//     price: 666
// });


// PRINT THE PIZZAS ON PAGE
export async function print_pizzas() {
    let dungeon_html_obj = document.getElementById("pizza_dungeon");
    const pizza_docs = await getDocs(pizza_lib); 

    dungeon_html_obj.innerHTML = "";
    pizza_docs.forEach((doc) => {
        let ing_txt = String(doc.data().ingredients).replaceAll(",", " • ");

        dungeon_html_obj.innerHTML += `
            <div class="pizza_cont" id="${doc.id}">
                <div class="pizza_img">
                    <img id="${doc.id}_img" src="assets/placeholder.webp" alt=""/>

                    <div class="settings_cont">
                        <div>
                            <h5 class="settings_title">Size</h5>
                            <input type="radio" name="${doc.id}_size" id="${doc.id}_S" value="S">
                            <label for="${doc.id}_S">S</label>
                            <input type="radio" name="${doc.id}_size" id="${doc.id}_M" value="M" checked>
                            <label for="${doc.id}_M">M</label>
                            <input type="radio" name="${doc.id}_size" id="${doc.id}_L" value="L">
                            <label for="${doc.id}_L">L</label>
                        </div>
                        <div>
                            <h5 class="settings_title">Toppings</h5>
                            <div class="ingredients_grid" id="${doc.id}_ing"></div>
                        </div>
                        <div>
                            <h5 class="settings_title">Options</h5>
                            <input type="checkbox" name="${doc.id}_gluten" id="${doc.id}_gluten_free">
                            <label for="${doc.id}_gluten_free">Gluten free</label>
                        </div>
                    </div>

                    <div class="pizza_settings">
                        <input type="checkbox" style="display: none;" name="settings" id="chckbx_${doc.id}" />
                        <label for="chckbx_${doc.id}"><img src="assets/icons/settings-sliders.svg" alt="settings"/></label>
                    </div>
                    <div class="add_pizza"><button onclick="add_pizza('${doc.id}')"><img src="assets/icons/add.svg" alt="add" /></button></div>
                </div>
                <div class="pizza_head_align">
                    <h2>${doc.data().name}</h2>
                    <p>${doc.data().price},-</p>
                </div>
                <p style="width: 300px;">${ing_txt}</p>
            </div>
        `;

        for (let ing of doc.data().ingredients) {
            document.getElementById(doc.id+"_ing").innerHTML += `
                <div>
                    <input type="checkbox" class="${doc.id}_ing_inp" name="${doc.id}_ing_${ing}" id="${doc.id}_ing_${ing}" value="${ing}" checked>
                    <label for="${doc.id}_ing_${ing}">${ing}</label>
                </div>
            `;
        }

        // SHOW IMAGE
        getDownloadURL(ref(storage, 'pizzalib/'+doc.id+'.png'))
        .then((url) => {
            const img = document.getElementById(doc.id+"_img");
            img.setAttribute('src', url);
        })
        .catch((error) => {
            // try with .jpg too
            getDownloadURL(ref(storage, 'pizzalib/'+doc.id+'.jpg'))
            .then((url) => {
                const img = document.getElementById(doc.id+"_img");
                img.setAttribute('src', url);
            })
            .catch((error) => {
                console.warn(error);
            });
        });
    });



}



export function add_to_db_cart(item) {
    // JSON.stringify
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const user_col = collection(db, "users");
            const user_doc = await getDoc(doc(user_col, user.uid));
            const user_cart = user_doc.data().cart;
            await updateDoc(doc(user_col, user.uid), {
                cart: [...user_cart, item]
            });
        } else {
            console.log("User is not signed in")
        }
    });
}


export function cart_remove(id, size, removed, gluten_free) {
    const item = {
        id: id,
        size: size,
        gluten_free: gluten_free == "true",
        removed: [...removed]
    }
    
    try {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                //// update_cart_from_db(user.uid); //Make sure its up to date
                let index = -1;
                for (let i=0; i < shopping_cart.length; i++) {
                    // console.log(shopping_cart[i])
                    if (isPizzasEqual(shopping_cart[i], item)) {
                        index = i;
                        break;
                    }
                }
                shopping_cart.splice(index, 1); // Remove from shoppingcart
                console.log(index, shopping_cart)
                
                // Remove from db cart
                const user_col = collection(db, "users");
                await updateDoc(doc(user_col, user.uid), {
                    cart: [...shopping_cart]
                });

            } else {
                shopping_cart.splice(shopping_cart.indexOf(item), 1); // Remove from shoppingcart
                document.cookie = "cart="+JSON.stringify(shopping_cart);
            }
        });
    } catch (err) {
        console.warn(err);
    }
    show_receipt();
}



export async function show_receipt() {
    let receipt_cont = document.getElementById("receipt_cont");
    receipt_cont.innerHTML = "";

    // Merging multiple pizzas
    let loop_cart = [];
    let exists = false;
    for (let item of shopping_cart) {
        exists = false;
        try {
            for (let existing_item of loop_cart) {
                if (isPizzasEqual(item, existing_item[1])) {
                    existing_item[0] ++;
                    exists = true;
                    break;
                }
            }
        } catch (error) {
            console.warn(error)
        }
        if (!exists) {
            loop_cart.push([1, item])
        }
    }

    // Showing on page
    for (let item of loop_cart) {
        const db_pizza = await getDoc(doc(pizza_lib, item[1].id));
        receipt_cont.innerHTML += `
            <div class="receipt_pizza" id="receipt_${item[1].id}_${item[1].size}_${item[1].removed}_${item[1].gluten_free}">
                <button class="remove_pizza" onclick="module.cart_remove('${item[1].id}','${item[1].size}','${item[1].removed}','${item[1].gluten_free}')">Remove 1</button>
                <div>
                    <h3>${db_pizza.data().name}</h3>
                    <h3>${item[0]}</h3>
                </div>
                <div>
                    <p>${item[1].size}</p>
                    <p>${db_pizza.data().price},-</p>
                </div>
            </div>
            <hr class="receipt_pizza_hr"/>
        `;
        const this_cont = document.getElementById(`receipt_${item[1].id}_${item[1].size}_${item[1].removed}_${item[1].gluten_free}`);

        if (item[1].gluten_free) {
            if (item[1].id == "margherita") {
                this_cont.innerHTML += `
                    <p>Gluten free</p>
                `;
            } else {
                this_cont.innerHTML += `
                    <div>
                        <p>Gluten free</p>
                        <p>+75,-</p>
                    </div>
                `;
            }
        }

        for (let option of item[1].removed) {
            this_cont.innerHTML += `
                <p>No ${option}</p>
            `;
        }
    }
}


function isPizzasEqual(pizza1, pizza2) {
    if (pizza1.id != pizza2.id) {
        return false;
    }
    if (pizza1.size != pizza2.size) {
        return false;
    }
    if (pizza1.gluten_free != pizza2.gluten_free) {
        return false;
    }
    
    if (pizza1.removed.length == 0 && pizza2.removed.length == 0) {
        return true;
    }
    else if (!(pizza1.removed.length == pizza2.removed.length && pizza1.removed.every((val, i) => val == pizza2.removed[i]))) {
        return false;
    }

    return true;
}
