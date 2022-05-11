window.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    document.querySelector("#user").innerHTML = username;
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

function refresh() {
    let params = new URLSearchParams(window.location.search);
    document.location.href = "./list.html?"+ params.toString();
    window.open(url);
}

function printLists(username, lName) {
    let account = JSON.parse(localStorage.getItem(username));
    for(item in account.lists) {
        let lst = document.createElement("li");
        lst.innerHTML = item;
        lst.addEventListener("click", ()=> {
            let params = new URLSearchParams(window.location.search);
            params.set("list", lst.innerHTML);
            document.location.href = "./list.html?" + params.toString();
            window.open(url);
        })
        document.querySelector("ul").appendChild(lst);
    }
    if(account.lists.hasOwnProperty(lName) && account.lists[lName]!=[]) {
        for (show of account.lists[lName]) {
            let image = document.createElement("img");
            image.src = show.showImg;
            image.height = 150;
            let tvID = show.id;
            image.addEventListener("click", ()=> {
                options(username, lName, tvID);
            });
            document.querySelector("#showList").appendChild(image);
        }
    }
}

function setUpPage() {
    let params = new URLSearchParams(window.location.search)
    let username = params.get("username");
    let lName = params.get("list");

    if(params.get("friend")){
        username = params.get("friend");
        document.querySelector("#listName").innerHTML = username+"'s List: "+lName;
        document.querySelector("#listsTitle").innerHTML = username+"'s Lists";
    } else {
        document.querySelector("#listName").innerHTML = lName;

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
    printLists(username, lName);
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
    document.querySelector("#searchBar").appendChild(searchBar);
    document.querySelector("#searchBar").appendChild(searchButton);

    document.querySelector("#edit").innerHTML = "";
    let cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.addEventListener("click", refresh);
    document.querySelector("#edit").appendChild(cancel);
}

async function searchHandler() {
    let search = document.querySelector("#searchShow").value;
    document.querySelector("#showList").innerHTML = "";
    let showList = await fetchImages(search);
    showList.forEach(addImages);
}

 async function fetchImages(topic) {
    let url = "https://api.tvmaze.com/search/shows?q=" + topic;
    let response = await fetch(url);
    let showList = new Map();
    if (response.ok) {
      let r = await response.json();
        for (let c of r) {
            if(c.show.image != null){
                showList.set(c.show.id, c.show.image.medium);
            }
        }
    } 
    return showList;
 }

function addImages(image, id) {
    let params = new URLSearchParams(window.location.search);
    let username = params.get("username");
    let lName = params.get("list");
    let account = JSON.parse(localStorage.getItem(username));
        let alreadyIn = false;
        for(i in account["lists"][lName]){
            if(account["lists"][lName][i].id == id){
                alreadyIn = true;
            }
        }
        if(!alreadyIn){
            let newImage = document.createElement("img");
            newImage.src = image;
            newImage.height = 150;
            newImage.addEventListener("click", function addToList() {
                let account = JSON.parse(localStorage.getItem(username));
                let addShow = {id: id, showImg: image};
                account["lists"][lName].push(addShow);
                localStorage.setItem(username,JSON.stringify(account));

                newImage.style = "filter: blur(8px);";
                newImage.removeEventListener("click", addToList);
        });
        document.querySelector("#showList").appendChild(newImage);
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
        refresh();
    });

    document.querySelector("#toShowPage").addEventListener("click", ()=> {
        let params = new URLSearchParams(window.location.search);
        params.delete("list");
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
            info.style = "display: grid; grid-template-columns: 80px auto; margin-left: 45px; margin-top: 25px";
            let photo = document.createElement("img");
            photo.src = account.img;
            photo.width = "60";
            photo.height = "60";
            photo.addEventListener("click", ()=> {goToFriend(user)});
            info.appendChild(document.createElement("div").appendChild(photo));
            let nameDiv = document.createElement("div");
            let name = document.createElement("h4");
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
            info.style = "display: grid; grid-template-columns: 80px auto; margin-left: 45px; margin-top: 25px";
            let photo = document.createElement("img");
            photo.src = friendAccount.img;
            photo.width = "60";
            photo.height = "60";
            photo.addEventListener("click", ()=> {goToFriend(user)});
            info.appendChild(document.createElement("div").appendChild(photo));
            let nameDiv = document.createElement("div");
            let name = document.createElement("h4");
            name.innerHTML = user;
            name.style = "text-align: left;";
            name.addEventListener("click", ()=> {goToFriend(user)});
            nameDiv.appendChild(name);
            info.appendChild(nameDiv);
            document.querySelector("#friendAct").appendChild(info);
    }
}
