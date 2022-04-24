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
    document.querySelector("#profile").appendChild(exit);

    let bio = document.querySelector("#biography").innerHTML;
    document.querySelector("#biography").innerHTML = "";
    let editBio = document.createElement("textarea");
    editBio.name = "bio";
    editBio.id = "bio";
    editBio.rows = "3";
    editBio.cols = "50";
    editBio.maxLength = "100";
    editBio.value = bio;

    ////////////////////////////Upload Image
    let label = document.createElement("label");
    label.for = "uploadPic";
    label.innerHTML = "Upload picture:";
    let upload = document.createElement("input");
    upload.type = "file";
    upload.name = "uploadPic";
   // upload.id = "uploadPic";
    upload.accept = "image/*";
    
    upload.addEventListener("change", function() {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
         // let uploadedImage = reader.result;
          document.querySelector("#profileImg").src = reader.result;
        });
         reader.readAsDataURL(this.files[0]);
      });
    ////////////////////////////////////

    document.querySelector("#editProfile").innerHTML = "Save";
    document.querySelector("#editProfile").addEventListener("click", () => {
        let account = JSON.parse(localStorage.getItem(username)); 
        account.bio = editBio.value;
        account.img = document.querySelector("#profileImg").src;
        localStorage.setItem(username,JSON.stringify(account));
        document.location.href = "./home.html?"+ params.toString();
        window.open(url);
    });
    document.querySelector("#biography").appendChild(editBio);
    document.querySelector("#profile").appendChild(label);
    document.querySelector("#profile").appendChild(upload);

}
