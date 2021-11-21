// SELECT CLASS 
const categoryItems = document.querySelectorAll('.category-items');
const productsDOM = document.querySelector('.products-container');
const cartBtn = document.querySelector('.cart-btn');
const overlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartTotal = document.querySelector('.cart');
const cartContent = document.querySelector('.cart-content');
const cartDOM = document.querySelector('.cart');
const clearCartBtn = document.querySelector('.clear-cart');
const filterBtns = document.querySelectorAll('.category-btn');

let cart = [];

let buttonsDOM = [];
// PRODUCTS


class Products {
	async getProducts() {
		try {
			let result = await fetch("products.json");
			let data = await result.json();
			let products = data.items;

			products = products.map((item) => {
				const id = item.id;
				const name = item.name;
				const price = item.price;
                const image = item.image;
				return {
					name,
					price,
					id,
					image,
				};
			});
			return products;
		} catch (error) {
			console.log(error);
		}
	}
}

// UI

class UI {
    displayProducts(products) {
        let result = "";
        products.forEach((product) => {
            result += `<div class="product">
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
        productsDOM.innerHTML = result;
    }
    getAtcButtons() {
        const buttons = [...document.querySelectorAll('.atc')];
        buttonsDOM = buttons;

        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id == id);
            if(inCart) {
                button.innerText = "IN CART";
                button.disabled = true;
            }
            button.addEventListener('click', event => {
                event.target.innerText = "IN CART";
                event.target.disabled = true;

                let cartItem = {...Storage.getProduct(id), amount: 1};

                cart = [...cart, cartItem];
                console.log(cart);

                // SAVE CART TO LOCAL STORAGE
                Storage.saveCart(cart);
                // SET CART VALUES 
                this.setCartValues(cart);
            })
        })
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        
        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        carTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
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
        </div> `;

      cartContent.appendChild(div);
    }
    showCart() {
        overlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    hideCart() {
        overlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    removeItem(id) {
        cart = cart.filter((item) => { item.id == id});
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
    }
    clearCart() {
        let cartItems = cart.map((item) => item.id);
        cartItems.forEach((id) => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    getSingleButton(id) {
        return buttonsDOM.find((button) => button.dataset.id == id);
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    setupAPP() {
        cart = 
    }
}

class Storage {
    static saveProducts(cart) {
        localStorage.setItem("products", JSON.stringify(cart));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find((product) => product.id == id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();

    products.getProducts().then((data) => {
        ui.displayProducts(data);
        Storage.saveProducts(data);
    });
})


