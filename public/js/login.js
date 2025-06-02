document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("loginForm");
      const email = document.getElementById("email");
      const password = document.getElementById("password");

      function validateEmail(input) {
        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        const isValid = emailPattern.test(input.value.trim());
        setValidationClass(input, isValid);
        return isValid;
      }

      function validatePassword(input) {
        const isValid = input.value.trim().length >= 6;
        setValidationClass(input, isValid);
        return isValid;
      }

      function setValidationClass(input, isValid) {
        input.classList.remove("is-valid", "is-invalid");
        input.classList.add(isValid ? "is-valid" : "is-invalid");
      }

      // Validate on typing (real-time)
      email.addEventListener("input", () => validateEmail(email));
      password.addEventListener("input", () => validatePassword(password));

      // Validate again on submit
      form.addEventListener("submit", (e) => {
        const emailOk = validateEmail(email);
        const passwordOk = validatePassword(password);
        if (!emailOk || !passwordOk) {
          e.preventDefault(); // stop submission if any field invalid
        }
      });
    });