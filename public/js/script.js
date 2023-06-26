function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordToggleCheckbox = document.getElementById('password-toggle');
    
    if (passwordToggleCheckbox.checked) {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }