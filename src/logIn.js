window.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#password").addEventListener("keydown", preventSpaces);
    document.querySelector("#logInButton").addEventListener("click",logInHandler);
    document.querySelector("#password").addEventListener("keypress", (event) =>{
        if (event.charCode == 13) {
            logInHandler();
         }
    });
});

function preventSpaces(event) {
    // Ignore space input 
    if (event.key == " ") {
       event.preventDefault();      
    }
 }

function logInHandler() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let params = new URLSearchParams();
    params.append("username",username);
    params.append("password",password);
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
}