

document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const email = document.getElementById("emailInput").value;
    const box = document.getElementById("resultInput");

    const res = await fetch("/api/validate-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
});
    
    const data = await res.json();

    box.classList.remove("valid", "invalid");
    box.textContent =
         data.result === "accepted"
         ? "✅ This email is valid and accepted."
         : "❌ This email is invalid or not accepted.";

});