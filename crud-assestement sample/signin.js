// Add an event listener to the form submit event
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    submitForm(); // Call the submitForm function
});

function submitForm() {
    const usernameValue = document.getElementById('username').value;
    const passwordValue = document.getElementById('password').value;

    // Password validation
    // At least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordValue)) {
        alert('Password structure is not matched');
        return;
    }

    const user = {
        username: usernameValue,
        password: passwordValue
      };
    
      // Get existing data from JSON
      const url = 'http://localhost:3000/credentials';
    
      fetch(url)
        .then(response => response.json())
        .then(data => {
          // Update credentials in JSON data
          data.credentials = user;
    
          // Update JSON with the updated data
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(response => response.json())
            .then(updatedData => {
              // Handle successful response
              console.log('User data posted successfully', updatedData);
              // Redirect to another page or show success message
              alert("thanks for your registration");
              window.location.href = 'http://127.0.0.1:5500/login.html';
            })
            .catch(error => {
              // Handle error
              console.error('Error posting user data', error);
              // Show error message or retry logic
            });
        })
        .catch(error => {
          // Handle error
          console.error('Error retrieving existing data', error);
          // Show error message or retry logic
        });
}
