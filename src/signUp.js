window.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#username").addEventListener("keydown", preventSpaces);
    document.querySelector("#password").addEventListener("keydown", preventSpaces);
    document.querySelector("#signUpButton").addEventListener("click",signUpHandler);
    document.querySelector("#password").addEventListener("keypress", (event) =>{
        //add event listener when user hits enter
        if (event.charCode == 13) {
            signUpHandler();
         }
    });
});

function preventSpaces(event) {
    // Ignore space input 
    if (event.key == " ") {
       event.preventDefault();      
    }
 }

function signUpHandler() {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if(localStorage.getItem(username)) {
        alert("Username already exists!");
    } else{
        localStorage.setItem(username,password);
        let params = new URLSearchParams();
        params.append("username",username);
        document.location.href = "./home.html?"+ params.toString();
        window.open(url);
    }
}