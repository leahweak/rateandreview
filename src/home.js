window.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search), username = params.get("username");
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

function setUpPage() {
    let params = new URLSearchParams(window.location.search);
    let username = params.get("username");
    if(params.get("friend")){
        let addRemove = document.createElement("button");
        let account = JSON.parse(localStorage.getItem(username));
        username = params.get("friend");
        if(account.friends.includes(username)) {
            addRemove.innerHTML = "Remove Friend";
            addRemove.addEventListener("click", removeFriend);
        } else {
            addRemove.innerHTML = "Add Friend";
            addRemove.addEventListener("click", addFriend);
        }
        document.querySelector("#options").appendChild(addRemove);
    } else {
        let addList = document.createElement("button");
        addList.id = "addList";
        addList.innerHTML = "Add New List";
        addList.addEventListener("click", addNewList);
        document.querySelector("#lists").appendChild(addList);

        let editProf = document.createElement("button");
        editProf.id = "editProfile";
        editProf.innerHTML = "Edit Profile";
        editProf.addEventListener("click", editProfile);
        document.querySelector("#options").appendChild(editProf);
    }
    document.querySelector("#name").innerHTML = username;
    let account = JSON.parse(localStorage.getItem(username));
    
    if(account.hasOwnProperty("bio")) {
        document.querySelector("#biography").innerHTML = account.bio;
    }

    document.querySelector("#profileImg").src = account.img;

    for(item in account.lists) {
        let lst = document.createElement("li");
        lst.innerHTML = item;
        lst.addEventListener("click", ()=> {
            params.append("list", lst.innerHTML);
            document.location.href = "./list.html?" + params.toString();
            window.open(url);
        })
        document.querySelector("ul").appendChild(lst);
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
        document.location.href = "./home.html?" + params.toString();
        window.open(url);
    });
    document.querySelector("ul").appendChild(createName);
}

function goToSearch() {
    let params = new URLSearchParams(window.location.search);
    params.delete("friend");
    document.location.href = "./search.html?"+ params.toString()
    window.open(url);
}

function editProfile() {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    let exit = document.createElement("button");
    exit.innerHTML = "Don't Save";
    exit.addEventListener("click", () => {
        document.location.href = "./home.html?"+ params.toString();
        window.open(url);
    });
    document.querySelector("#options").appendChild(exit);


    let newBio = changeBio();
    changePic();

    document.querySelector("#editProfile").innerHTML = "Save";
    document.querySelector("#editProfile").addEventListener("click", () => {
        let account = JSON.parse(localStorage.getItem(username)); 
        account.bio = newBio.value;
        account.img = document.querySelector("#profileImg").src;
        localStorage.setItem(username,JSON.stringify(account));
        document.location.href = "./home.html?"+ params.toString();
        window.open(url);
    });
}

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

function goToList() {
    let params = new URLSearchParams(window.location.search);
    params.append("list","Want to Watch");
    document.location.href = "./list.html?"+ params.toString();
    window.open(url);
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
