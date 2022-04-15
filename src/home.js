window.addEventListener("DOMContentLoaded", function () {
    setUpPage();
    document.querySelector("#toSearch").addEventListener("click",goToSearch);
});

function setUpPage() {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    document.querySelector("#profileName").innerHTML = username;
}

function goToSearch() {
    let params = new URLSearchParams(window.location.search);
    document.location.href = "./search.html?"+ params.toString()
    window.open(url);
}
