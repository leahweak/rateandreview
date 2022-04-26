window.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search), tvID = params.get("tvID"),
    username = params.get("username");
    createTVPage(username, tvID);
    document.querySelector("h1").addEventListener("click", () => {
        let p = new URLSearchParams();
        p.append("username",username);
        document.location.href = "./home.html?"+ p.toString();
        window.open(url);
    });
    document.querySelector("#edit").addEventListener("click", update);
    document.querySelector("#star1").addEventListener("click", () => stars(1));
    document.querySelector("#star2").addEventListener("click", () => stars(2));
    document.querySelector("#star3").addEventListener("click", () => stars(3));
    document.querySelector("#star4").addEventListener("click", () => stars(4));
    document.querySelector("#star5").addEventListener("click", () => stars(5));

});

 async function createTVPage(username, tvID) {
    url = "https://api.tvmaze.com/shows/"+tvID+"?";
    let response = await fetch(url);
     if(response.ok) {
         let r = await response.json();
         document.querySelector("#tvImage").src = r.image.medium;
         document.querySelector("#showName").innerHTML = r.name;

         addToList(r.image.medium);
     }

     let account = JSON.parse(localStorage.getItem(username));
     if(account.hasOwnProperty(tvID)) {
        let a = account[tvID];
        if(a.hasOwnProperty("review")) {
            document.querySelector("#review").innerHTML = account[tvID]["review"];
        }

        if(a.hasOwnProperty("rating")) {
            let rating = account[tvID]["rating"];
            fillStars(rating);
        }
    }
 }


 function stars(star) {
    fillStars(star);

    let params = new URLSearchParams(window.location.search), tvID = params.get("tvID"),
    username = params.get("username");
    let account = JSON.parse(localStorage.getItem(username));
    if(!account.hasOwnProperty(tvID)){
        account[tvID] = {};
    }
    account[tvID]["rating"] = star;
    localStorage.setItem(username,JSON.stringify(account));
 }

 function fillStars(number) {
    for(i=1; i<=number; i++){
        document.querySelector("#star"+i).style.color = "purple";
    }
    for(i=5; i>number; i--){
        document.querySelector("#star"+i).style.color = "rgb(205, 245, 243)";
    }
 }

 function update() {
    let params = new URLSearchParams(window.location.search), tvID = params.get("tvID"),
    username = params.get("username");
    let newRev = changeReview();

     document.querySelector("#edit").value = "Save";
     document.querySelector("#edit").addEventListener("click", () => {
        let account = JSON.parse(localStorage.getItem(username)); 
        if(!account.hasOwnProperty(tvID)){
            account[tvID] = {};
        }
        account[tvID]["review"] = newRev.value;
        localStorage.setItem(username,JSON.stringify(account));
        document.location.href = "./tvshow.html?"+ params.toString();
        window.open(url);
     })
 }

 function changeReview() {
    let rev = document.querySelector("#review").innerHTML;
    document.querySelector("#review").innerHTML = "";
    let changeRev = document.createElement("textarea");
    changeRev.rows = "4";
    changeRev.cols = "50"; 
    changeRev.maxLength = "500";
    changeRev.value = rev;
    document.querySelector("#review").appendChild(changeRev);
    return changeRev;
 }

 function addToList(image) {
    let params = new URLSearchParams(window.location.search), tvID = params.get("tvID"),
    username = params.get("username");

     let account = JSON.parse(localStorage.getItem(username));
     for(item in account.lists) {
         let opt = document.createElement("option");
         opt.value = item;
         opt.innerHTML = item;
         document.querySelector("select").appendChild(opt);
     }
     document.querySelector("#add").addEventListener("click", ()=> {
        let addShow = {id: tvID, showImg: image};
        let account = JSON.parse(localStorage.getItem(username));
         account.lists[document.querySelector("select").value].push(addShow);
         localStorage.setItem(username,JSON.stringify(account));
     })
 }

