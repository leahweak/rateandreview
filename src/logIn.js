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
    let params = new URLSearchParams();
    params.append("username",username);
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
   
}
