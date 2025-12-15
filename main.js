document.addEventListener("DOMContentLoaded", () => {
  // Swiper init (Home page carousel)
  if (window.Swiper) {
    new Swiper(".swiper", { pagination: { el: ".swiper-pagination" } });
  }

  // IMPORTANT:
  // Live Server runs on 5500, but your BACKEND must run on a DIFFERENT port (ex: 3000 or 5000).
  // Change this to match your classmate's backend.
  const API_URL = "http://localhost:3000/api/validate-email";

  const form = document.getElementById("signupForm");
  const emailInput = document.getElementById("emailInput");
  const resultBox = document.getElementById("resultBox");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    resultBox.classList.remove("hidden");
    resultBox.textContent = "Checking...";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "check", email })
      });

      const text = await res.text(); // read once
      if (!res.ok) {
        resultBox.textContent = `Server error (${res.status}): ${text}`;
        return;
      }

      const data = JSON.parse(text);
      resultBox.textContent = data.accepted
        ? "✅ Accepted: " + (data.reason || "OK")
        : "❌ Rejected: " + (data.reason || "Not allowed");

    } catch (err) {
      resultBox.textContent =
        "Server error.";
      console.error(err);
    }
  });
});
