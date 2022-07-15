let session = new Session();
session = session.getSession();

if(session !== "") {
    window.location.href = "twitter.html";
}

// SIGNUP OPEN MODAL BTN
document.querySelector('#mainSection_signup').addEventListener('click', () => {
    document.querySelector('.signupModal').style.display = 'block';
});

// CLOSE MODAL BTN
document.querySelector('#closeModal').addEventListener('click', () => {
    document.querySelector('.signupModal').style.display = 'none';
});

// VALIDATION
let config = {
    'signup_username': {
        required: true,
        minlength: 5,
        maxlength: 30
    },

    'signup_email': {
        required: true,
        email: true,
        minlength: 5,
        maxlength: 50
    },

    'signup_password': {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'repeat_password'
    },

    'repeat_password': {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'signup_password'
    }
};

let validation = new Validation(config, '#signupForm');

document.querySelector('#signupForm').addEventListener('submit', e => {
    e.preventDefault();

    if(validation.validationPassed()) {

        let user = new User();
        user.username = document.querySelector('#username').value;
        user.email = document.querySelector('#email').value;
        user.password = document.querySelector('#password').value;
        user.create();

    } else {
        alert.log('Wrong!');
    }
});

document.querySelector('#loginForm').addEventListener('submit', e => {
    e.preventDefault();

    let email = document.querySelector('#login_email').value;
    let password = document.querySelector('#login_password').value;

    let user = new User();
    user.email = email;
    user.password = password;
    user.login();
});