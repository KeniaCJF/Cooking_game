import { loadStripe } from "https://cdn.skypack.dev/@stripe/stripe-js";

const stripe = await loadStripe("pk_live_51T6fAFHdpiRTkLl5sNs0EjjOAAhFBQSNxFmGLQvYIbwaS8LgzWSa6XSFy5taKGOuZjpt0qgbCu7Q7VoaDd2fidAp00JWiiGPaw");

async function initPayment() {
  const res = await fetch("https://cooking-game-backend-hyq6.onrender.com/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 1000 })
  });

  const data = await res.json();

  if (!data.clientSecret) {
    console.error("❌ No clientSecret", data);
    return;
  }

  const elements = stripe.elements({
    clientSecret: data.clientSecret
  });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  document
    .getElementById("payment-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "https://keniacjf.github.io/Cooking_game/public/success.html"
        }
      });

      if (error) {
        document.getElementById("error-message").textContent = error.message;
      }
    });
}

initPayment();