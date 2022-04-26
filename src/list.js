window.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    setUpPage();
    document.querySelector("#toSearch").addEventListener("click", goToSearch);
    document.querySelector("h1").addEventListener("click", () => {
        let p = new URLSearchParams();
        p.append("username",username);
        document.location.href = "./home.html?"+ p.toString();
        window.open(url);
    });
    document.querySelector("#editList").addEventListener("click", search);
});

function setUpPage() {
    let params = new URLSearchParams(window.location.search),username = params.get("username")
    , lName = params.get("list");
    document.querySelector("#listName").innerHTML = lName;
    let account = JSON.parse(localStorage.getItem(username));
    if(account.hasOwnProperty("bio")) {
        document.querySelector("#biography").innerHTML = account.bio;
    }
    if(account.hasOwnProperty("img")) {
        document.querySelector("#profileImg").src = account.img;
    } 
    if(account.lists.hasOwnProperty("Want to Watch") && account.lists["Want to Watch"]!=[]) {
        for (show of account.lists["Want to Watch"]) {
            let image = document.createElement("img");
            image.src = show.showImg;
            image.height = 150;
            document.querySelector("#showList").appendChild(image);
        }
    }
}

function goToSearch() {
    let p = new URLSearchParams();
    p.append("username",username);
    document.location.href = "./search.html?"+ p.toString();
    window.open(url);
}

function search() {
    let searchBar = document.createElement("input");
    searchBar.type = "text";
    searchBar.id = "search";
    let searchButton = document.createElement("input");
    searchButton.type = "submit";
    searchButton.addEventListener("click", searchHandler);
    document.querySelector("#showList").innerHTML = "";
    document.querySelector("#showList").appendChild(searchBar);
    document.querySelector("#showList").appendChild(searchButton);
}

async function searchHandler() {
    let search = document.querySelector("#search").value;
    document.querySelector("#showList").innerHTML = "";
    let showList = await fetchImages(search);
    addImages(showList);
}

async function fetchImages(topic) {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    let url = "https://api.tvmaze.com/search/shows?q=" + topic;
    let response = await fetch(url);
 
    let showList = [];

    if (response.ok) {
      let r = await response.json();
        for (let c of r) {
            if(c.show.image != null){
                let newImage = document.createElement("img");
                newImage.src = c.show.image.medium;
                newImage.height = 150;
                let tvID = c.show.id;
                newImage.addEventListener("click",function () {
                    let addShow = {id: tvID, showImg: newImage.src};
                    let account = JSON.parse(localStorage.getItem(username));
                    account["lists"]["Want to Watch"].push(addShow);
                    localStorage.setItem(username,JSON.stringify(account));
                });
                showList.push(newImage);
            }
        }
    } 
    return showList;
 }

 function addImages(array) {
    for (image of array) {
        document.querySelector("#showList").appendChild(image);
    }
}