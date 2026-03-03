import { loadStripe } from "https://cdn.skypack.dev/@stripe/stripe-js";

const stripe = await loadStripe("pk_test_51T6fAaH75gzaAckEJVV6pwfqgeIUjGA0GKuJssJNmdIhmGw11gKX9FTa5MrIJzpkIqgKiteVrqxm8lhlLD8lwzwf007Br8kjKQ");

async function initPayment() {
  const res = await fetch("https://cooking-game-backend-hyq6.onrender.com/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 5000 })
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
          return_url: "https://cooking-game-backend-hyq6.onrender.com/success.html"
        }
      });

      if (error) {
        document.getElementById("error-message").textContent = error.message;
      }
    });
}

initPayment();