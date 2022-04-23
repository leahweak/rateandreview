window.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#password").addEventListener("keydown", preventSpaces);
    document.querySelector("#logInButton").addEventListener("click",logInHandler);
    document.querySelector("#password").addEventListener("keypress", (event) =>{
        //add event listener for when user hits enter
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
    if(localStorage.getItem(username)) {
        let account = JSON.parse(localStorage.getItem(username)); 
        if(password == account.password) {
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
