(function () {
  "use strict";

  var form = document.querySelector("form[aria-label='Report an issue']");
  if (!form) return;

  var requiredFields = form.querySelectorAll("[required]");

  function showError(field, message) {
    clearError(field);
    field.classList.add("form-field--invalid");
    field.setAttribute("aria-invalid", "true");

    var errorEl = document.createElement("p");
    errorEl.className = "form-error";
    errorEl.setAttribute("role", "alert");
    errorEl.id = field.id + "-error";
    errorEl.textContent = message;

    field.setAttribute("aria-describedby", errorEl.id);
    field.parentNode.appendChild(errorEl);
  }

  function clearError(field) {
    field.classList.remove("form-field--invalid");
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");

    var existing = field.parentNode.querySelector(".form-error");
    if (existing) existing.remove();
  }

  function validateField(field) {
    clearError(field);

    if (field.hasAttribute("required") && !field.value.trim()) {
      showError(field, "This field is required.");
      return false;
    }

    if (field.type === "email" && field.value.trim()) {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value.trim())) {
        showError(field, "Please enter a valid email address.");
        return false;
      }
    }

    return true;
  }

  // Inline validation on blur
  for (var i = 0; i < requiredFields.length; i++) {
    requiredFields[i].addEventListener("blur", function () {
      validateField(this);
    });
  }

  // Also validate email on blur even though it's optional
  var emailField = form.querySelector('input[type="email"]');
  if (emailField) {
    emailField.addEventListener("blur", function () {
      validateField(this);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var allValid = true;
    var firstInvalid = null;

    // Validate all required fields
    for (var i = 0; i < requiredFields.length; i++) {
      if (!validateField(requiredFields[i])) {
        allValid = false;
        if (!firstInvalid) firstInvalid = requiredFields[i];
      }
    }

    // Also check email format if filled
    if (emailField && emailField.value.trim()) {
      if (!validateField(emailField)) {
        allValid = false;
        if (!firstInvalid) firstInvalid = emailField;
      }
    }

    if (!allValid) {
      firstInvalid.focus();
      return;
    }

    // Success: hide form and show success message
    form.style.display = "none";

    var introP = form.previousElementSibling;
    if (introP && introP.tagName === "P") {
      introP.style.display = "none";
    }

    var successDiv = document.createElement("div");
    successDiv.className = "form-success";
    successDiv.innerHTML =
      "<h2>Thank you!</h2>" +
      "<p>Your report has been submitted successfully.</p>" +
      '<a href="index.html">Return to Home</a>';

    form.parentNode.appendChild(successDiv);
  });
})();
