window.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#username").addEventListener("keydown", preventSpaces);
    document.querySelector("#password").addEventListener("keydown", preventSpaces);
    document.querySelector("button").addEventListener("click",signUpHandler);
    document.querySelector("#password").addEventListener("keypress", (event) =>{
        //add event listener when user hits enter
        if (event.charCode == 13) {
            signUpHandler();
         }
    });
});

// Ignore space input from user.
function preventSpaces(event) {
    if (event.key == " ") {
       event.preventDefault();      
    }
 }

/* Set up account if one does not already exist for inputed username.*/
function signUpHandler() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if(localStorage.getItem(username)) {
        alert("Username already exists!");
    } else if(!checkLength(username, 4)){
        alert("Username must be at least 4 characters long.")
    } else if(!checkPassword(password)){
        alert("Password is invalid. Please make sure your password is at least 6 characters long and "
        + "includes at least one uppercase letter and one number.");
    } else{
        let account = {
            password: password,
            img: "gray.jpg",
            lists: {"Want to Watch": [], "Currently Watching": [], "Finished Watching": []},
            friends: []
        };
        // Store new account in local storage.
        localStorage.setItem(username,JSON.stringify(account));

        // Go to home page
        let params = new URLSearchParams();
        params.append("username",username);
        document.location.href = "./home.html?"+ params.toString();
        window.open(url);
    }
}

/* Check that string input is at least as long as minLength.*/
function checkLength(input, minLength) {
    if(input != null && input.length >= minLength) {
        return true;
    }
    return false;
}

/* Check that password has at least one number and uppercase letter and is at least 6 characters long.*/
function checkPassword(password) {
    let number = /[0-9]/;
    let upperCase = /[A-Z]/;
    if(number.test(password) && upperCase.test(password) && checkLength(password,6)) {
        return true;
    }
    return false;
}