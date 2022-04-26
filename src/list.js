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
    document.querySelector("#delete").addEventListener("click", deleteList);
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
    if(account.lists.hasOwnProperty(lName) && account.lists[lName]!=[]) {
        for (show of account.lists[lName]) {
            let image = document.createElement("img");
            image.src = show.showImg;
            image.height = 150;
            document.querySelector("#showList").appendChild(image);
        }
    }

    for(item in account.lists) {
        let lst = document.createElement("li");
        lst.innerHTML = item;
        lst.addEventListener("click", ()=> {
            params.set("list", lst.innerHTML);
            document.location.href = "./list.html?" + params.toString();
            window.open(url);
        })
        document.querySelector("ul").appendChild(lst);
    }

    document.querySelector("#addList").addEventListener("click", addNewList);
}

function addNewList() {
    let params = new URLSearchParams(window.location.search), username = params.get("username");
    let createName = document.createElement("input");
    createName.type = "text";
    document.querySelector("#addList").value = "Save";
    document.querySelector("#addList").addEventListener("click", ()=> {
        let account = JSON.parse(localStorage.getItem(username));
        account.lists[createName.value] = [];
        localStorage.setItem(username,JSON.stringify(account));
        document.location.href = "./list.html?" + params.toString();
        window.open(url);
    });
    
    document.querySelector("ul").appendChild(createName);
}

function deleteList() {
    let params = new URLSearchParams(window.location.search), username = params.get("username")
    ,lName = params.get("list");
    let account = JSON.parse(localStorage.getItem(username));
    delete account.lists[lName];
    localStorage.setItem(username,JSON.stringify(account));
    let p = new URLSearchParams();
    p.append("username",username);
    document.location.href = "./home.html?"+ p.toString();
    window.open(url);
}

function goToSearch() {
    let params = new URLSearchParams(window.location.search), username = params.get("username");
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
    let params = new URLSearchParams(window.location.search),username = params.get("username")
    ,lName = params.get("list");
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
                newImage.addEventListener("click",() => {
                    let addShow = {id: tvID, showImg: newImage.src};
                    let account = JSON.parse(localStorage.getItem(username));
                    account["lists"][lName].push(addShow);
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