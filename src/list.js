window.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search);
    let username = params.get("username");
    document.querySelector("#toSearch").addEventListener("click", goToSearch);

    document.querySelector("#user").innerHTML = username;
    document.querySelector("#user").addEventListener("click", goHome);
    document.querySelector("h1").addEventListener("click", goHome);
    document.querySelector("#searchButton").addEventListener("click", ()=> {friendSearch(username)});

    setUpPage();
    printFriends(username);
});

/* Take the user to their home page, keeping their username stored in the url. */
function goHome() {
    let params = new URLSearchParams(window.location.search);
    params.delete("list");
    params.delete("friend");
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
}

/* Go to search page only keeping username in url for future use. */
function goToSearch() {
    let params = new URLSearchParams(window.location.search);
    let username = params.get("username");
    let p = new URLSearchParams();
    p.append("username",username);
    document.location.href = "./search.html?"+ p.toString();
    window.open(url);
}

/* Go to friendName's profile */
function goToFriend(friendName) {
    let params = new URLSearchParams(window.location.search);
    params.delete("list");
    params.set("friend",friendName);
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
}

/* Refresh web page with same parameters on url */
function refresh() {
    let params = new URLSearchParams(window.location.search);
    document.location.href = "./list.html?"+ params.toString();
    window.open(url);
}

/* Access local storage to print list of tv show lists for given username. */ 
function printLists(username) {
    let account = JSON.parse(localStorage.getItem(username));
    for(item in account.lists) {
        let lst = document.createElement("li");
        lst.innerHTML = item;
        lst.addEventListener("click", ()=> {
            // Go to list page when list name is clicked on.
            let params = new URLSearchParams(window.location.search);
            params.append("list", lst.innerHTML);
            document.location.href = "./list.html?" + params.toString();
            window.open(url);
        })
        document.querySelector("ul").appendChild(lst);
    }
}

/* Print image of show in lName list. */
function printTvImages(username, lName, isFriend) {
    let account = JSON.parse(localStorage.getItem(username));
    if(account.lists.hasOwnProperty(lName) && account.lists[lName]!=[]) {
        for (show of account.lists[lName]) {
            let image = document.createElement("img");
            image.src = show.showImg;
            image.height = 150;
            let tvID = show.id;
            image.addEventListener("click", ()=> {
                options(username, lName, tvID, isFriend);
            });
            document.querySelector("#showList").appendChild(image);
        }
    }
}

/* This function prepares the webpage. There is different functionality based 
on whether the user is viewing their own profile or their friends. */
function setUpPage() {
    let params = new URLSearchParams(window.location.search)
    let username = params.get("username");
    let lName = params.get("list");
    let isFriend = false;
    if(params.get("friend")){
        isFriend = true;
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
    printLists(username);
    printTvImages(username, lName, isFriend);
}

/* This function adds a new list to local storage based on user input */
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

/* This function delete the current list when user clicks on delete list button. */
function deleteList() {
    let params = new URLSearchParams(window.location.search), username = params.get("username")
    ,lName = params.get("list");
    let account = JSON.parse(localStorage.getItem(username));
    delete account.lists[lName];
    localStorage.setItem(username,JSON.stringify(account));
    goHome();
}

/* This function addes a search bar to the DOM where user
 can search for tv show to add to their list. */
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

/* This function calls fetchImages on the user's search input and recieves a map
of shows. Then the function calls addImages on each element in the returned map,
a function that will print the images on the web page.
*/
async function searchHandler() {
    let search = document.querySelector("#searchShow").value;
    document.querySelector("#showList").innerHTML = "";
    let showList = await fetchImages(search);
    showList.forEach(addImages);
}

 /* Use tvmaze api to generate a map of tv shows that match the user's search input. 
 The keys in the map are the tv ids and the values are the urls of the show image. */
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

  /* Add tv images to the #showList div and create an event listener
 are each image that adds associated tv show to list when image
 is clicked on. */
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
        // 
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

/* If user clicks on tv show image:
        - if they are on a friend's list page they will be take
            straight to the tv page.
        - if they are on their own list page a popup will apear with
            three options:
                - go to tv page
                - delete from list
                - cancel*/
function options(username, lName, tvID, isFriend) {
    if(isFriend){
        let params = new URLSearchParams(window.location.search);
        params.delete("list");
        params.delete("friend");
        params.append("tvID",tvID);
        document.location.href = "./tvShow.html?"+ params.toString();
        window.open(url);
    } else {
        document.querySelector("#popUp").style.display = "block";
        document.querySelector("#cancel").addEventListener("click", ()=> {
        document.querySelector("#popUp").style.display = "none";
        });

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
}

/* Search all of local storage for every account that's username includes the search query.*/
function friendSearch(username) {
    document.querySelector("#friendAct").innerHTML = "";
    let query = document.querySelector("#search").value;

    for(let i=0; i<localStorage.length; i++) {
        let user = localStorage.key(i);
        if(user != username && user.includes(query)) {
            printProfile(user);
        }
    }
    let cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.addEventListener("click", refresh);

    document.querySelector("#friendAct").appendChild(cancel);
}

/* Go through local storage and print friend accounts to web page. */
function printFriends(username) {
    let account = JSON.parse(localStorage.getItem(username));

    for(i in account.friends) {
            let user = account.friends[i];
            printProfile(user);
    }
}

/* Print individual accounts (username and picture). */
function printProfile(user) {
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
        // If user clicks on username or photo they are taken to the profile of this account
        name.addEventListener("click", ()=> {goToFriend(user)});
        nameDiv.appendChild(name);
        info.appendChild(nameDiv);

        document.querySelector("#friendAct").appendChild(info);
}
