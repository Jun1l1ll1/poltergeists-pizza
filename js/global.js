
let shopping_cart = [];

function add_to_cart(item) {
    shopping_cart.push(item);
    update_cart_visuals();
    document.cookie = "cart="+JSON.stringify(shopping_cart); // Deleted when browser closed
    
    
}

function get_cart_from_cookie() {
    try {
        if (get_cookie("cart")) {
            shopping_cart = JSON.parse(get_cookie("cart"));
        }
    } catch (err) {
        shopping_cart = [];
    }
}


function goTo_home() {
    document.location.href = "./";
}

function goTo_dungeon() {
    document.location.href = "./dungeon.html";
}

function goTo_contract() {
    document.location.href = "./contract.html";
}


function swapTo_login() {
    document.getElementById("login_confirm_password").style.display = "none";

    document.getElementById("login_btn").style.display = "block";
    document.getElementById("create_auth_btn").style.display = "none";
    
    document.getElementById("swap_login_btn").style.display = "none";
    document.getElementById("swap_create_btn").style.display = "block";
}

function swapTo_create() {
    document.getElementById("login_confirm_password").style.display = "block";

    document.getElementById("login_btn").style.display = "none";
    document.getElementById("create_auth_btn").style.display = "block";

    document.getElementById("swap_login_btn").style.display = "block";
    document.getElementById("swap_create_btn").style.display = "none";
}


function update_cart_visuals() {
    let amount_txt = document.getElementById("cart_nr_span");
    if (shopping_cart) {
        amount_txt.innerText = shopping_cart.length;
    }
}




function get_cookie(name) {
    let cookie_list = document.cookie.split(";");
    for (let cookie of cookie_list) {
        if (cookie.split("=")[0].replaceAll(" ", "") == name) {
            return cookie.split("=")[1];
        }
    }
    
    return false;
}
