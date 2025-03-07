document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const subjectCount = document.getElementById("subject-count");
  const messageCount = document.getElementById("message-count");

  function showError(input, message, customClass = "error-message") {
      clearError(input, customClass);
      let errorSpan = document.createElement("span");
      errorSpan.classList.add(customClass, "text-red-500", "text-sm");
      errorSpan.textContent = message;
      input.parentElement.appendChild(errorSpan);
  }

  function clearError(input, customClass = "error-message") {
      const errorSpan = input.parentElement.querySelector(`.${customClass}`);
      if (errorSpan) {
          errorSpan.remove();
      }
  }

  function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  emailInput.addEventListener("input", () => clearError(emailInput, "error-message-email"));
  subjectInput.addEventListener("input", () => clearError(subjectInput));
  messageInput.addEventListener("input", () => clearError(messageInput));

  if (form) {
      form.addEventListener("submit", async (event) => {
          event.preventDefault();

          const email = emailInput.value.trim();
          const subject = subjectInput.value.trim();
          const message = messageInput.value.trim();

          clearError(emailInput, "error-message-email");
          clearError(subjectInput);
          clearError(messageInput);

          let hasError = false;

          if (!email || !isValidEmail(email)) {
              showError(emailInput, "Please enter a valid email address.", "error-message-email");
              hasError = true;
          }

          if (!subject) {
              showError(subjectInput, "Subject cannot be empty.");
              hasError = true;
          }

          if (!message) {
              showError(messageInput, "Message cannot be empty.");
              hasError = true;
          }

          if (hasError) return;

          try {
              const response = await fetch("https://api.neondigital.rs/api/sendEmail", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email, subject, message }),
              });

              const result = await response.json();

              if (response.ok) {
                  showPopup("Message sent successfully!", "success");
                  form.reset();
                  subjectCount.textContent = "0/20";
                  messageCount.textContent = "0/300";
              } else {
                  console.error("Error:", result.error);
                  showPopup("Something went wrong, please try again.", "error");
              }
          } catch (err) {
              console.error("Unexpected error:", err);
              showPopup("Failed to send email.", "error");
          }
      });
  }
});

// Funkcija za prikaz popup obaveštenja
function showPopup(message, type) {
  if (window.innerWidth < 768) {
    let span = document.createElement("span");
    span.className = "mobile-popup";
    span.textContent = message;
    document.body.appendChild(span);

    span.style.position = "fixed";
    span.style.top = "50%";
    span.style.left = "50%";
    span.style.transform = "translate(-50%, -50%)";
    span.style.padding = "10px 20px";
    span.style.borderRadius = "8px";
    span.style.fontSize = "16px";
    span.style.fontWeight = "bold";
    span.style.color = "#fff";
    span.style.background = "radial-gradient(circle, #00FF7F, #00D26A, #00A85A)";
    span.style.boxShadow = "0px 0px 15px #00FF7F";
    span.style.zIndex = "1000";
    span.style.opacity = "1";
    span.style.width = "max-content";

    setTimeout(() => {
      span.style.opacity = "0";
      setTimeout(() => span.remove(), 500);
    }, 3000);
  } else {
        const popup = document.createElement("div");
    popup.className = `popup-message fixed px-6 py-3 rounded-lg text-lg font-semibold shadow-lg text-white`;
    
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.right = "-100%";
    popup.style.transform = "translateY(-50%)";
    popup.style.zIndex = "1000";
    popup.style.whiteSpace = "nowrap";
    popup.style.padding = "12px 24px";
    popup.style.borderRadius = "8px";

    if (type === "success") {
        popup.style.background = "radial-gradient(circle, #00FF7F, #00D26A, #00A85A)";
        popup.style.boxShadow = "0px 0px 15px #00FF7F";
    } else {
        popup.style.background = "radial-gradient(169.51% 152.63% at -15.27% 0%, #CA07AF 0%, #9215CE 46.9%, #3434D7 100%)";
        popup.style.boxShadow = "0px 0px 15px rgba(255, 62, 228, 0.89)";
    }

    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.right = "50%";
        popup.style.transform = "translate(50%, -50%)";
        popup.style.transition = "right 0.5s ease-in-out, transform 0.5s ease-in-out";
    }, 50);

    setTimeout(() => {
        popup.style.opacity = "0";
        popup.style.transform = "translate(50%, -50%) scale(0.9)";
        setTimeout(() => popup.remove(), 300);
    }, 3000);
  }
}

