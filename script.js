const CART_KEY = "altaPintaCart";

const formatPrice = (value) => `$${Number(value).toLocaleString("es-CO")}`;

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadges();
};

const cartCount = () => getCart().reduce((total, item) => total + item.quantity, 0);

const updateCartBadges = () => {
  document.querySelectorAll(".bag span, .cart-link span").forEach((badge) => {
    badge.textContent = cartCount();
  });
};

const showToast = (message) => {
  let toast = document.querySelector(".ap-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "ap-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
};

const selectedSize = () => document.querySelector(".size-options .selected")?.textContent.trim() || "M";
const selectedColor = () => document.querySelector(".color-dots .selected")?.classList.contains("white") ? "Blanco" : "Negro";

const addToCart = ({ name, price, image, size = "M", color = "Negro" }) => {
  const cart = getCart();
  const existing = cart.find((item) => item.name === name && item.size === size && item.color === color);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price: Number(price), image, size, color, quantity: 1 });
  }

  saveCart(cart);
  showToast(`${name} agregado al carrito`);
};

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadges();

  document.querySelectorAll(".buy-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      addToCart({
        name: button.dataset.name,
        price: button.dataset.price,
        image: button.dataset.image,
      });
      button.classList.add("added");
      button.innerHTML = "Agregado <span>&#10003;</span>";
      window.setTimeout(() => {
        button.classList.remove("added");
        button.innerHTML = "Comprar <span>&#9633;</span>";
      }, 1200);
    });
  });

  document.querySelectorAll(".add-product-btn").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart({
        name: button.dataset.name,
        price: button.dataset.price,
        image: button.dataset.image,
        size: selectedSize(),
        color: selectedColor(),
      });
    });
  });

  document.querySelectorAll(".size-options button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".size-options button").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
    });
  });

  document.querySelectorAll(".color-dots span").forEach((dot) => {
    dot.addEventListener("click", () => {
      document.querySelectorAll(".color-dots span").forEach((item) => item.classList.remove("selected"));
      dot.classList.add("selected");
    });
  });

  const mainProductImage = document.querySelector(".main-product-img img");
  document.querySelectorAll(".thumbs img").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document.querySelectorAll(".thumbs img").forEach((item) => item.classList.remove("selected"));
      thumb.classList.add("selected");
      if (mainProductImage) {
        mainProductImage.src = thumb.src.replace("150x170", "720x720");
        mainProductImage.alt = thumb.alt;
      }
    });
  });

  document.querySelectorAll(".blog-tabs a").forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      const filter = tab.dataset.filter;

      document.querySelectorAll(".blog-tabs a").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".post-card").forEach((post) => {
        post.classList.toggle("is-hidden", filter !== "todos" && post.dataset.category !== filter);
      });
    });
  });

  document.querySelectorAll(".message-card, .newsletter form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.reset();
      showToast("Mensaje enviado. Te responderemos pronto.");
    });
  });

  document.querySelectorAll(".qty button").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.parentElement.querySelector("span");
      const current = Number(value.textContent);
      value.textContent = button.textContent.trim() === "+" ? current + 1 : Math.max(1, current - 1);
      showToast("Cantidad actualizada");
    });
  });
});
