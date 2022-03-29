function setupEvents(price, currency) {
  const $selectPrice = document.querySelector("select");
  const $plusButton = document.querySelector(".pluson");
  const $minusButton = document.querySelector(".minuson");
  const $numberText = document.querySelector(".eth_input");
  const $priceResultText = document.querySelector("#price");

  let itemCount = 1;

  updateResult = () => {
    $priceResultText.textContent =
      (price * itemCount).toFixed(`2`) + " " + currency;
  };

  if ($selectPrice) {
    $selectPrice.addEventListener("change", function (e) {
      e.preventDefault();
      price = parseInt($selectPrice.value);
      updateResult();
    });
  }
  $plusButton.addEventListener("click", function (e) {
    e.preventDefault();
    itemCount = itemCount < 10 ? itemCount + 1 : 10;
    $numberText.value = itemCount;
    $priceResultText.textContent = (price * itemCount).toFixed(`2`);
    updateResult();
  });
  $minusButton.addEventListener("click", function (e) {
    e.preventDefault();
    itemCount = parseInt($numberText.value);
    itemCount = itemCount > 1 ? itemCount - 1 : itemCount;
    $numberText.value = itemCount;
    updateResult();
  });

  $numberText.value = 1;
  $priceResultText.textContent = price + " " + currency;
  updateResult();
}

function mark(
  hash = null,
  network = null,
  amount = null,
  type = null,
  adds = null
) {
  if (type == "mint-fail") return displayMessage();
}

function loading() {
  document.querySelector(".mint").classList.add("loading");
}

function stopLoading() {
  document.querySelector(".mint").classList.remove("loading");
}

function displayMessage() {
  document.querySelector(".toast").classList.add("active");
  setTimeout(() => {
    document.querySelector(".toast").classList.remove("active");
  }, 5000);
}

window.addEventListener("load", () => {
  setupEvents(parseFloat("0.16"), "ETH");
});
