console.log("PROBANDO WEB SOCKET");
const socketClient = io();

const form = document.getElementById("form");
const listaProductos = document.getElementById("listaProducto");

const formBorrar = document.getElementById("form__delete");
const inputBorrar = document.getElementById("numberDelete");

const productTitle = document.getElementById("tittle");
const productDesc = document.getElementById("desc");
const productPrice = document.getElementById("price");
const productLink = document.getElementById("thumbnail");
const productStock = document.getElementById("stock");
const productCode = document.getElementById("code");

socketClient.on("products", (products) => {
  productsUpdate(products);
});
socketClient.on("productsUpdated", (productsUpdated) => {
  productsUpdate(productsUpdated);
  form.reset();
});

const productsUpdate = (products) => {
  let productsHtml = "";
  products.forEach((product) => {
    productsHtml += `
  <p>Id:${product.id}</p>
  <p>Producto:${product.title}</p>
  <p>Descripcion:${product.description}</p>
  <p>Precio:${product.price}</p>
  <p>${product.thumbnail}</p>
  <p>Stock:${product.stock}</p>
  <p>Codigo:${product.code}</p>

  `;
  });

  listaProductos.innerHTML = productsHtml;
};
form.onsubmit = (e) => {
  e.preventDefault();
  const producto = {
    title: productTitle.value,
    description: productDesc.value,
    price: productPrice.value,
    thumbnail: productLink.value,
    stock: productStock.value,
    code: productCode.value,
  };
  socketClient.emit("addProduct", producto);
};

formBorrar.onsubmit = (e) => {
  e.preventDefault();
  let id;
  id = inputBorrar.value;
  socketClient.emit("id", id);
};