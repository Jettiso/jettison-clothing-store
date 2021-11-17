// SELECT CLASS 
const categoryItems = document.querySelectorAll('.category-items');
const productsDOM = document.querySelector('.products-container');
const cartBtn = document.querySelector('.cart-btn');
const overlay = document.querySelector('.overlay');
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
}

class Storage {

}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();

    products.getProducts().then((data) => {
        ui.displayProducts(data);
    });
})


