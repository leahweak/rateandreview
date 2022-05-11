window.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search);
    let username = params.get("username");
    document.querySelector("#toSearch").addEventListener("click", goToSearch);

    document.querySelector("#user").innerHTML = username;
    document.querySelector("#user").addEventListener("click", goHome);
    document.querySelector("h1").addEventListener("click", goHome);
    document.querySelector("#toSearch").addEventListener("click", goToSearch);
    document.querySelector("#searchButton").addEventListener("click",()=>friendSearch(username));

    prepareProfile();
    printFriends(username);
});

/* Take the user to their home page, keeping their username stored in the url. */
function goHome() {
    let params = new URLSearchParams(window.location.search);
    params.delete("list");
    if(params.has("friend")){
        params.delete("friend");
    }
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
}

/* Go to search page only keeping username in url for future use. */
function goToSearch() {
    let params = new URLSearchParams(window.location.search);
    params.delete("friend");
    document.location.href = "./search.html?"+ params.toString()
    window.open(url);
}

/* Go to friendName's profile */
function goToFriend(friendName) {
    let params = new URLSearchParams(window.location.search);
    params.set("friend",friendName);
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
}

/* Refresh web page with same parameters on url. */
function refresh() {
    let params = new URLSearchParams(window.location.search);
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
}

/* This function prepares the profile (print profile picture, bio, etc.). 
There is different functionality based on whether the user is viewing 
their own profile or their friends. */
function prepareProfile() {
    let params = new URLSearchParams(window.location.search);
    let username = params.get("username");

    /* If we are on a friend's profile, don't allow user to make changes to 
    their profile or lists. Let user add as friend or remove as friend. */
    if(params.get("friend")){
        let addRemove = document.createElement("button");
        let account = JSON.parse(localStorage.getItem(username));
        // changing username so that friend's items get shown instead (profile pic, etc.)
        username = params.get("friend"); 

        document.querySelector("#listsTitle").innerHTML = username+"'s Lists";
        if(account.friends.includes(username)) {
            addRemove.innerHTML = "Remove Friend";
            addRemove.addEventListener("click", removeFriend);
        } else {
            addRemove.innerHTML = "Add Friend";
            addRemove.addEventListener("click", addFriend);
        }
        document.querySelector("#options").appendChild(addRemove);
    } 
    /* User is on their own profile. Allow them to make changes to their own profile */
    else {
        let addList = document.createElement("button");
        addList.id = "addList";
        addList.innerHTML = "Add New List";
        addList.addEventListener("click", ()=>{addNewList(username)});
        document.querySelector("#lists").appendChild(addList);

        let editProf = document.createElement("button");
        editProf.id = "editProfile";
        editProf.innerHTML = "Edit Profile";
        editProf.addEventListener("click", ()=> {editProfile(username)});
        document.querySelector("#options").appendChild(editProf);
    }
    
    document.querySelector("#name").innerHTML = username;
    let account = JSON.parse(localStorage.getItem(username));
    
    if(account.hasOwnProperty("bio")) {
        document.querySelector("#biography").innerHTML = account.bio;
    }

    document.querySelector("#profileImg").src = account.img;
    printLists(username);
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

/* This function adds a new list to local storage based on user input */
function addNewList(username) {
    let createName = document.createElement("input");
    createName.type = "text";
    document.querySelector("#addList").innerHTML = "Save";
    document.querySelector("#addList").addEventListener("click", ()=> {
        let account = JSON.parse(localStorage.getItem(username));
        account.lists[createName.value] = [];
        localStorage.setItem(username,JSON.stringify(account));
        refresh();
    });
    document.querySelector("ul").appendChild(createName);
}

/* Allow user to change profile picture and bio. If user clicks on Save button, their changes
will be saved to local storage and page will refresh. If the user clicks on Don't Save button
no changes will be saved and page will refresh. */
function editProfile(username) {
    let newBio = changeBio();
    changePic();

    document.querySelector("#editProfile").innerHTML = "Save";
    document.querySelector("#editProfile").addEventListener("click", () => {
        let account = JSON.parse(localStorage.getItem(username)); 
        account.bio = newBio.value;
        account.img = document.querySelector("#profileImg").src;
        localStorage.setItem(username,JSON.stringify(account));
        refresh();
    });

    let exit = document.createElement("button");
    exit.innerHTML = "Don't Save";
    exit.addEventListener("click", () => {
        refresh();
    });
    document.querySelector("#options").appendChild(exit);
}

/* Create text box where user can input new bio. Return user input. */
function changeBio() {
    let bio = document.querySelector("#biography").innerHTML;
    document.querySelector("#biography").innerHTML = "";
    let editBio = document.createElement("textarea");
    editBio.rows = "3";
    editBio.cols = "50";
    editBio.maxLength = "100";
    editBio.value = bio;
    document.querySelector("#biography").appendChild(editBio);
    return editBio;
}

/* Allow user to upload picture to have as their profile picture. */
function changePic() {
    let label = document.createElement("label");
    label.for = "uploadPic";
    label.innerHTML = "Upload picture: ";
    let upload = document.createElement("input");
    upload.type = "file";
    upload.name = "uploadPic";
    upload.accept = "image/*";
    
    upload.addEventListener("change", function() {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          document.querySelector("#profileImg").src = reader.result;
        });
         reader.readAsDataURL(this.files[0]);
      });

    document.querySelector("#upload").appendChild(label);
    document.querySelector("#upload").appendChild(upload);
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
    cancel.addEventListener("click", () => {
        refresh();
    });
    document.querySelector("#friendAct").appendChild(cancel);

}

/* Save other user as friend in local storage. */
function addFriend() {
    let params = new URLSearchParams(window.location.search);
    let username = params.get("username");
    let newFriend=params.get("friend");
    let account = JSON.parse(localStorage.getItem(username));
    account.friends.push(newFriend);
    localStorage.setItem(username,JSON.stringify(account));
    refresh();
}

/* Remove friend from local storage */
function removeFriend() {
    let params = new URLSearchParams(window.location.search);
    let username = params.get("username");
    let friend = params.get("friend");
    let account = JSON.parse(localStorage.getItem(username));
    account.friends.splice(account.friends.indexOf(friend),1);
    localStorage.setItem(username,JSON.stringify(account));
    goHome();
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
        info.appendChild(document.createElement("div").appendChild(photo));
        let nameDiv = document.createElement("div");
        let name = document.createElement("h4");
        name.innerHTML = user;
        name.style = "text-align: left;";
        // If user clicks on username or photo they are taken to the profile of this account
        photo.addEventListener("click", ()=> {goToFriend(user)});
        name.addEventListener("click", ()=> {goToFriend(user)});

        nameDiv.appendChild(name);
        info.appendChild(nameDiv);
        document.querySelector("#friendAct").appendChild(info);
}
