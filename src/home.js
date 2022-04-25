window.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    setUpPage();
    document.querySelector("#toSearch").addEventListener("click", goToSearch);
    document.querySelector("#editProfile").addEventListener("click", editProfile);
    document.querySelector("h1").addEventListener("click", () => {
        document.location.href = "./home.html?"+ params.toString();
        window.open(url);
    });
});

function setUpPage() {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    document.querySelector("#profileName").innerHTML = username;
    let account = JSON.parse(localStorage.getItem(username));
    if(account.hasOwnProperty("bio")) {
        document.querySelector("#biography").innerHTML = account.bio;
    }
    if(account.hasOwnProperty("img")) {
        document.querySelector("#profileImg").src = account.img;
    } 
}

function goToSearch() {
    let params = new URLSearchParams(window.location.search);
    document.location.href = "./search.html?"+ params.toString()
    window.open(url);
}

function editProfile() {
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    let exit = document.createElement("h3");
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
