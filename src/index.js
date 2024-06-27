document.addEventListener("DOMContentLoaded", () => {
  displayProducts();

  document
    .getElementById("ordenarMenorAoMaior")
    .addEventListener("click", ordenarMenorAoMaior);
  document
    .getElementById("ordenarMaiorAoMenor")
    .addEventListener("click", ordenarMaiorAoMenor);
});

const submitButton = document.getElementById("submitButton");

if (submitButton) {
  submitButton.addEventListener("click", (ev) => {
    ev.preventDefault();

    const productName = document.getElementById("productName").value;
    const productDescription =
      document.getElementById("productDescription").value;
    const productValue = document.getElementById("productValue").value;
    const available = document.querySelector(
      'input[name="available"]:checked'
    ).value;

    if (productName && productDescription && productValue && available) {
      const newProduct = {
        name: productName,
        description: productDescription,
        value: parseFloat(productValue),
        available: available,
      };

      saveProduct(newProduct);
      window.location.href = "listaProdutos.html";
    } else {
      alert("Você deixou algum campo vazio! Preencha e tente novamente.");
    }
  });
}

function displayProducts() {
  const productGrid = document.querySelector(".product-grid");
  productGrid.innerHTML = "";

  const products = JSON.parse(localStorage.getItem("products")) || [];

  if (products.length <= 0) {
    alert("Você não tem produtos cadastrados!");
    const err = document.createElement("p");
    err.textContent = "Sem produtos cadastrados!";
    productGrid.appendChild(err);
  }

  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");

    const productTitle = document.createElement("h2");
    productTitle.textContent = product.name;
    productItem.appendChild(productTitle);

    const productDescription = document.createElement("p");
    productDescription.textContent = product.description;
    productItem.appendChild(productDescription);

    const productPrice = document.createElement("p");
    productPrice.classList.add("price");
    productPrice.textContent = `R$ ${product.value.toFixed(2)}`;
    productItem.appendChild(productPrice);

    const productAvailability = document.createElement("p");
    productAvailability.classList.add("availability");
    productAvailability.textContent =
      product.available === "Sim"
        ? "Disponível para venda"
        : "Não disponível para venda";
    if (product.available === "Sim") {
      productAvailability.classList.add("available");
    }
    productItem.appendChild(productAvailability);

    productGrid.appendChild(productItem);
  });
}

function saveProduct(product) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.push(product);
  products = products.sort((a, b) => a.value - b.value);
  localStorage.setItem("products", JSON.stringify(products));
}

const orderByValueMinMax = new Promise((resolve, reject) => {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  if (products.length <= 1) {
    reject("A lista não tem tamanho suficiente para ordenar");
  } else {
    const ordenateByMinMaxValue = products.sort((a, b) => a.value - b.value);
    resolve(ordenateByMinMaxValue);
  }
});

const orderByValueMaxMin = new Promise((resolve, reject) => {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  if (products.length <= 1) {
    reject("A lista não tem tamanho suficiente para ordenar");
  } else {
    const ordenateByMaxMinValue = products.sort((a, b) => b.value - a.value);
    resolve(ordenateByMaxMinValue);
  }
});

async function ordenarMenorAoMaior() {
  orderByValueMinMax
    .then((sortedList) => {
      localStorage.setItem("products", JSON.stringify(sortedList));
      displayProducts();
    })
    .catch((err) => {
      console.error("ERRO! ", err);
    });
}

async function ordenarMaiorAoMenor() {
  orderByValueMaxMin
    .then((sortedList) => {
      localStorage.setItem("products", JSON.stringify(sortedList));
      displayProducts();
    })
    .catch((err) => {
      console.error("ERRO! ", err);
    });
}
