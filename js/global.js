
let shopping_cart = [];

function add_to_cart(item) {
    shopping_cart.push(item);
    update_cart_visuals();
    document.cookie = "cart="+JSON.stringify(shopping_cart); // Deleted when browser closed
}

function get_cart_from_cookie() {
    try {
        shopping_cart = JSON.parse(get_cookie("cart"));
    } catch (err) {
        shopping_cart = [];
    }
}



function goTo_dungeon() {
    document.location.href = "./dungeon.html";
}

function goTo_contract() {
    document.location.href = "./contract.html";
}


function update_cart_visuals() {
    let amount_txt = document.getElementById("cart_nr_span");
    amount_txt.innerText = shopping_cart.length;
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
