window.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#password").addEventListener("keydown", preventSpaces);
    document.querySelector("button").addEventListener("click",logInHandler);
    document.querySelector("#password").addEventListener("keypress", (event) =>{
        //Add event listener for when user hits enter
        if (event.charCode == 13) {
            logInHandler();
         }
    });
});

// Ignore space input
function preventSpaces(event) {
    if (event.key == " ") {
       event.preventDefault();      
    }
 }

/* Checks that username exists in local storage and user has inputted correct password */
function logInHandler() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if(localStorage.getItem(username)) {
        let account = JSON.parse(localStorage.getItem(username)); 
        if(password == account.password) {
            // Log in successful, take user to home page.
            let params = new URLSearchParams();
            params.append("username",username);
            document.location.href = "./home.html?"+ params.toString();
            window.open(url);
        } else {
            alert("Password is incorrect.");
        }
    } else {
        alert("Username doesn't exist.");
    }

   
}
