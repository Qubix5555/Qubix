document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
  
    if (username === 'admin' && password === 'admin') {
      window.location.href = '3-index.html'; // Redirect to next page after login
    } else {
      errorMessage.textContent = 'Invalid username or password.';
    }
  });
  