
var supabaseClient = window.supabase.createClient(
  window.CONFIG.SUPABASE_URL,
  window.CONFIG.SUPABASE_ANON_KEY
);


var form = document.getElementById("signupForm");
var emailInput = document.getElementById("emailInput");
var resultBox = document.getElementById("resultBox");

form.onsubmit = function (event) {
  event.preventDefault();

  var email = emailInput.value.trim();

  resultBox.classList.remove("hidden", "valid", "invalid");
  resultBox.textContent = "Checking...";

  fetch("https://www.disify.com/api/email/" + encodeURIComponent(email))
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var accepted =
        data.domain === "umd.edu" &&
        data.format &&
        !data.disposable &&
        data.dns;

      var result = accepted ? "Accepted" : "Rejected";

      var reasons = [];
      if (data.domain !== "umd.edu") reasons.push("Domain not umd.edu");
      if (!data.format) reasons.push("Invalid format");
      if (data.disposable) reasons.push("Disposable email");
      if (!data.dns) reasons.push("DNS check failed");

      var reason = accepted ? "OK" : (reasons.length ? reasons.join("; ") : "Rejected by policy");


      if (accepted) {
        resultBox.textContent = "This email is valid and accepted.";
        resultBox.classList.add("valid");
      } else {
        resultBox.textContent = "This email is invalid or not accepted.";
        resultBox.classList.add("invalid");
      }

      return supabaseClient.from("Signup").insert({
        email: email,
        result: result,
        reason: reason,
        created_at: new Date().toISOString()
      });
    })
    .then(function (insertResponse) {
      if (insertResponse && insertResponse.error) {
        console.log("Supabase insert error:", insertResponse.error);
      } else {
        console.log("Logged to Supabase:", insertResponse);
      }
    });
};

