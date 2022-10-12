// Variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-container");
const filterBtns = document.querySelectorAll(".category-btn");
const categoryShow = document.querySelector(".show-category-btn");
const categoryClose = document.querySelector(".category-close");
const categoryDOM = document.querySelector(".category-container");
const navBtn = document.querySelector(".nav-btn");
const mobileNav = document.querySelector(".mobile-nav");
const buyItems = document.querySelector(".buy-items");
const popupOverlay = document.querySelector(".popup-overlay");
const okBtn = document.querySelector("#ok-btn");
const noCartItem = document.querySelector(".noCart-item");


// Cart
let cart = [];
// buttons
let buttonsDOM = [];

// getting the products
class Products {
    async getProducts() {
        try {
            const result = await fetch("products.json");
            const data = await result.json();
            let products = data.items;

            products = products.map((product) => {
                const name = product.name;
                const image = product.image;
                const id = product.id;
                const price = product.price;
                const category = product.category;

                return { name, price, image, id, category };
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

class UI {
    displayProducts(products) {
        let disMenuItems = products.map((product) => {
            return `<div class="product">
            <div class="img-container">
                <img src=${product.image} alt="" class="product-img">
            </div>
            <h3>${product.name}</h3>
            <div class="caption">
                <h4 class="price">$${product.price}</h4>
                <button class="atc" data-id=${product.id}>add to cart</button>
            </div>
        </div>`;
        });
        disMenuItems = disMenuItems.join("");
        productsDOM.innerHTML = disMenuItems;
    }
    filterBtns(params) {
        filterBtns.forEach((btns) => {
            btns.addEventListener("click", (e) => {
                let category = e.currentTarget.dataset.id;
                let products = params.filter((item) => {
                    if (item.category == category) {
                        return item;
                    }
                    this.closeCategory();
                });
                if (category === "all") {
                    this.displayProducts(params);
                    this.getAtcBtns();
                    this.clear();
                    this.closeCategory();
                } else {
                    this.displayProducts(products);
                    this.getAtcBtns();
                    this.clear();
                }
            });
        });
    }

    getAtcBtns() {
        const buttons = [...document.querySelectorAll(".atc")];
        buttonsDOM = buttons;

        buttons.forEach((button) => {
            let id = button.dataset.id;
            let inCart = cart.find((item) => item.id == id);

            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            } else {
                button.addEventListener("click", (e) => {
                    e.target.innerText = "In Cart";
                    e.target.disabled = true;
                    //Spread Op				// number of items in cart
                    let cartItem = { ...Storage.getProduct(id), amount: 1 };

                    cart = [...cart, cartItem];

                    // SAVE CART IN LOCAL STORAGE
                    Storage.saveCart(cart);
                    // SET CART VALUES
                    this.setCartValues(cart);
                    // DISPLAY CART ITEMS
                    this.addCartItem(cartItem);
					noCartItem.classList.remove("transparentBcg");
                });
            }
        });
    }
    clear() {
        clearCartBtn.addEventListener("click", (e) => {
            this.clearCart(e);
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });

        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `<img src=${item.image} alt="product" />
		<div>
			<h4>${item.name}</h4>
			<h5>$${item.price}</h5>
			<span class="remove-item" data-id=${item.id}>remove</span>
		</div>
		<div>
			<i class="fas fa-chevron-up" data-id=${item.id}></i>
			<p class="item-amount">${item.amount}</p>
			<i class="fas fa-chevron-down" data-id=${item.id}></i>
		</div>`;
        cartContent.appendChild(div);
    }
    showCart() {
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");
    }

    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener("click", this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart);
        categoryShow.addEventListener("click", this.showCategory);
        categoryClose.addEventListener("click", this.closeCategory);
        navBtn.addEventListener("click", this.navToggle);
		buyItems.addEventListener("click", (e) => {
				if (cartTotal.innerText == 0) {

					noCartItem.classList.add("transparentBcg");
				} else {
						
					this.hideCart();
					this.buyItems();
				}
			
			
		});
		

		okBtn.addEventListener("click", (e) => {
			this.hidePurchaseModal() ;
		});
    }
    navToggle() {
        mobileNav.classList.toggle("showNav");
    }

    closeCategory() {
        categoryDOM.classList.remove("showCategory");
    }
    showCategory() {
        categoryDOM.classList.add("showCategory");
    }
    populateCart(cart) {
        cart.forEach((item) => this.addCartItem(item));
    }

    hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
    }

	buyItems() {
		popupOverlay.classList.add("transparentBcg");
	}

	hidePurchaseModal() {
		popupOverlay.classList.remove("transparentBcg");
	}

	

    cartLogic() {
        // CLEAR CARTBTN
        clearCartBtn.addEventListener("click", (e) => {
            this.clearCart(e);
			location.reload(e);
        });

		

        cartContent.addEventListener("click", (event) => {
            if (event.target.classList.contains("remove-item")) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find((item) => item.id == id);
                tempItem.amount++;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find((item) => item.id == id);
                tempItem.amount--;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText =
                        tempItem.amount;
                } else {
                    cartContent.removeChild(
                        lowerAmount.parentElement.parentElement
                    );
                    this.removeItem(id);
                }
            }
        });
    }

    clearCart() {
        let cartItems = cart.map((item) => item.id);
        cartItems.forEach((id) => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
		
    }

    removeItem(id) {
        cart = cart.filter((item) => item.id != id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `add to cart`;
    }

    getSingleButton(id) {
        return buttonsDOM.find((button) => button.dataset.id == id);
    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find((product) => product.id == id);
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart() {
        return localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart"))
            : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const ui = new UI();
	

    // SETUP APP (close, open the cart, display the data saved to local storage)
    ui.setupAPP();

    products
        .getProducts()
        .then((data) => {
            // Render the products
            ui.displayProducts(data);
            // save to local storage
            Storage.saveProducts(data);
            ui.filterBtns(data);
        })
        .then(() => {
            ui.getAtcBtns();
            ui.cartLogic();
        });
});

function updateProgressBar() {
    const { scrollTop, scrollHeight } = document.documentElement;
    const scrollPercent = `${
        (scrollTop / (scrollHeight - window.innerHeight)) * 100
    }%`;
    document
        .querySelector("#progress-bar")
        .style.setProperty("--progress", scrollPercent);
}

document.addEventListener("scroll", updateProgressBar);
