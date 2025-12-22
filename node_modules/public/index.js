document.addEventListener("DOMContentLoaded", () => {


  var supabaseClient = window.supabase.createClient(
    window.CONFIG.SUPABASE_URL,
    window.CONFIG.SUPABASE_ANON_KEY
  );


  var form = document.getElementById("signupForm");
  var emailInput = document.getElementById("emailInput");
  var resultBox = document.getElementById("resultBox");
  const swiperEl = document.querySelector(".swiper");



  if (swiperEl && window.Swiper) {
    new Swiper(".swiper", {
      loop: true,
      spaceBetween: 12,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      autoplay: {
        delay: 3500,
        disableOnInteraction: false
      },
      keyboard: { enabled: true }
    });
  }


  

  if (!form || !emailInput || !resultBox) {
    console.log("Signup form elements not found on this page.");
    return;
  }

  form.onsubmit = function (event) {
    event.preventDefault();

    var email = emailInput.value.trim();
    var isUmd = /^[^@\s]+@umd\.edu$/i.test(email); 
    resultBox.classList.remove("hidden", "valid", "invalid");

    if (!isUmd) {
      resultBox.textContent = "Only @umd.edu emails are accepted.";
      resultBox.classList.add("invalid");

      supabaseClient.from("Signup").insert({
        email: email,
        result: "Rejected",
        reason: "Domain not umd.edu",
        created_at: new Date().toISOString()
      });

      return;
    }

    resultBox.textContent = "Accepted: UMD email confirmed.";
    resultBox.classList.add("valid");

    supabaseClient.from("Signup").insert({
      email: email,
      result: "Accepted",
      reason: "OK",
      created_at: new Date().toISOString()
    });
  };
});

