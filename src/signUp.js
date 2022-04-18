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
    /**Get username and password from user and store in users.json */
}