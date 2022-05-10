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
    document.querySelector("#searchButton").addEventListener("click",friendSearch);
    printFriends();
});

function setUpPage() {
    let params = new URLSearchParams(window.location.search),username = params.get("username")
    , lName = params.get("list");
    document.querySelector("#listName").innerHTML = lName;
    let account = JSON.parse(localStorage.getItem(username));

    if(account.lists.hasOwnProperty(lName) && account.lists[lName]!=[]) {
        for (show of account.lists[lName]) {
            let image = document.createElement("img");
            image.src = show.showImg;
            image.height = 150;
            let tvID = show.id;
            image.addEventListener("click", ()=> {
                console.log(tvID);
                options(username, lName, tvID);
            });
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
    if(params.get("friend")){

    } else {
        let addList = document.createElement("button");
        addList.id = "addList";
        addList.innerHTML = "Add New List";
        addList.addEventListener("click", addNewList);
        document.querySelector("#lists").appendChild(addList);

        let editList = document.createElement("button");
        editList.id = "editList";
        editList.innerHTML = "Add Shows";
        editList.addEventListener("click", search);
        document.querySelector("#edit").appendChild(editList);

        let deleteL = document.createElement("button");
        deleteL.id = "delete";
        deleteL.innerHTML = "Delete List";
        deleteL.addEventListener("click", deleteList);
        document.querySelector("#edit").appendChild(deleteL);
    }
}

function addNewList() {
    let params = new URLSearchParams(window.location.search), username = params.get("username");
    let createName = document.createElement("input");
    createName.type = "text";
    document.querySelector("#addList").innerHTML = "Save";
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
    searchBar.id = "searchShow";
    let searchButton = document.createElement("button");
    searchButton.innerHTML = "Search";
    searchButton.addEventListener("click", searchHandler);
    document.querySelector("#showList").innerHTML = "";
    document.querySelector("#showList").appendChild(searchBar);
    document.querySelector("#showList").appendChild(searchButton);
}

async function searchHandler() {
    let search = document.querySelector("#searchShow").value;
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
    console.log(array)
    for (image of array) {
        document.querySelector("#showList").appendChild(image);
    }
}

function options(username, lName, tvID) {
    document.querySelector("#popUp").style.display = "block";
    document.querySelector("#cancel").addEventListener("click", ()=> {
        document.querySelector("#popUp").style.display = "none";
    })

    document.querySelector("#deleteShow").addEventListener("click", ()=> {
        let account = JSON.parse(localStorage.getItem(username));
        let size = account.lists[lName].length;
        let d;
        for (i=0; i<size; i++) {
            console.log(tvID);
            if(account.lists[lName][i].id == tvID) {
                d = i;
            }
        }
        account.lists[lName].splice(d,1);
        localStorage.setItem(username,JSON.stringify(account));
    });

    document.querySelector("#toShowPage").addEventListener("click", ()=> {
        let params = new URLSearchParams(window.location.search);
        params.append("tvID",tvID);
        document.location.href = "./tvShow.html?"+ params.toString();
        window.open(url);
    });
}

function friendSearch() {
    document.querySelector("#friendAct").innerHTML = "";
    let query = document.querySelector("#search").value;
    let params = new URLSearchParams(window.location.search),username = params.get("username");

    for(let i=0; i<localStorage.length; i++) {
        let user = localStorage.key(i);
        if(user != username && user.includes(query)) {
            let account = JSON.parse(localStorage.getItem(user));
            let info = document.createElement("div");
            info.style = "display: grid; grid-template-columns: 80px auto; margin: 25px; vertical-align: middle;";
            let photo = document.createElement("img");
            photo.src = account.img;
            photo.width = "60";
            photo.height = "60";
            photo.addEventListener("click", ()=> {goToFriend(user)});
            info.appendChild(document.createElement("div").appendChild(photo));
            let nameDiv = document.createElement("div");
            let name = document.createElement("h3");
            name.innerHTML = user;
            name.style = "text-align: left;";
            name.addEventListener("click", ()=> {goToFriend(user)});
            nameDiv.appendChild(name);
            info.appendChild(nameDiv);
            document.querySelector("#friendAct").appendChild(info);
        }
    }
    let cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.addEventListener("click", () => {
        document.location.href = "./home.html?"+ params.toString();
        window.open(url);
    });
    document.querySelector("#friendAct").appendChild(cancel);
}


function goToFriend(friendName) {
    let params = new URLSearchParams(window.location.search);
    params.delete("list");
    params.set("friend",friendName);
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
}

function addFriend() {
    let params = new URLSearchParams(window.location.search),username = params.get("username"),newFriend=params.get("friend");
    let account = JSON.parse(localStorage.getItem(username));
    account.friends.push(newFriend);
    localStorage.setItem(username,JSON.stringify(account));
    document.location.href = "./home.html?" + params.toString();
    window.open(url); 
}

function removeFriend() {
    let params = new URLSearchParams(window.location.search),username = params.get("username"),friend=params.get("friend");
    let account = JSON.parse(localStorage.getItem(username));
    account.friends.pop(friend);
    localStorage.setItem(username,JSON.stringify(account));
    document.location.href = "./home.html?" + params.toString();
    window.open(url); 
}

function printFriends() {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    let account = JSON.parse(localStorage.getItem(username));

    for(i in account.friends) {
            let user = account.friends[i];
            let friendAccount = JSON.parse(localStorage.getItem(user));
            let info = document.createElement("div");
            info.style = "display: grid; grid-template-columns: 80px auto; margin: 25px; vertical-align: middle;";
            let photo = document.createElement("img");
            photo.src = friendAccount.img;
            photo.width = "60";
            photo.height = "60";
            photo.addEventListener("click", ()=> {goToFriend(user)});
            info.appendChild(document.createElement("div").appendChild(photo));
            let nameDiv = document.createElement("div");
            let name = document.createElement("h3");
            name.innerHTML = user;
            name.style = "text-align: left;";
            name.addEventListener("click", ()=> {goToFriend(user)});
            nameDiv.appendChild(name);
            info.appendChild(nameDiv);
            document.querySelector("#friendAct").appendChild(info);
    }
}
