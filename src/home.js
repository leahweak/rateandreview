window.addEventListener("DOMContentLoaded", function () {
    setUpPage();
    document.querySelector("#toSearch").addEventListener("click", goToSearch);
    document.querySelector("#editProfile").addEventListener("click", editProfile);
});

function setUpPage() {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    document.querySelector("#profileName").innerHTML = username;
    let account = JSON.parse(localStorage.getItem(username));
    if(account.hasOwnProperty("bio")) {
        console.log(account.bio);
        document.querySelector("#biography").innerHTML = account.bio;
    }
}

function goToSearch() {
    let params = new URLSearchParams(window.location.search);
    document.location.href = "./search.html?"+ params.toString()
    window.open(url);
}

function editProfile() {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    document.querySelector("#editProfile").innerHTML = "Done";
    document.querySelector("#editProfile").addEventListener("click", () => {
        document.location.href = "./home.html?"+ params.toString();
        window.open(url);
    })
    let bio = document.querySelector("#biography").innerHTML;
    document.querySelector("#biography").innerHTML = "";
    let editBio = document.createElement("textarea");
    editBio.name = "bio";
    editBio.id = "bio";
    editBio.rows = "3";
    editBio.cols = "50";
    editBio.maxLength = "100";
    editBio.value = bio;
    let saveBio = document.createElement("input");
    saveBio.type = "button";
    saveBio.id = "saveBioButton";
    saveBio.value = "Save";
    saveBio.addEventListener("click", () => {
        let account = JSON.parse(localStorage.getItem(username)); 
        account.bio = editBio.value;
        localStorage.setItem(username,JSON.stringify(account));
    });
    let par = document.createElement("p");
    par.appendChild(saveBio);
    document.querySelector("#biography").appendChild(editBio);
    document.querySelector("#biography").appendChild(par);
}
