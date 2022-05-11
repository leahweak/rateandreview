window.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search), tvID = params.get("tvID"),
    username = params.get("username");
    createTVPage(username, tvID);
    friendReviews();
    document.querySelector("#user").innerHTML = username;
    document.querySelector("#user").addEventListener("click", goHome);
    document.querySelector("h1").addEventListener("click", goHome);
    document.querySelector("#toSearch").addEventListener("click", goToSearch);

    document.querySelector("#edit").addEventListener("click", editReview);
    document.querySelector("#star1").addEventListener("click", () => stars(1));
    document.querySelector("#star2").addEventListener("click", () => stars(2));
    document.querySelector("#star3").addEventListener("click", () => stars(3));
    document.querySelector("#star4").addEventListener("click", () => stars(4));
    document.querySelector("#star5").addEventListener("click", () => stars(5));
});

/* Take the user to their home page, keeping their username stored in the url. */
function goHome() {
    let params = new URLSearchParams(window.location.search);
    params.delete("tvID");
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
}

/* Go to search page only keeping username in url for future use. */
function goToSearch() {
    let params = new URLSearchParams(window.location.search);
    params.delete("tvID");
    document.location.href = "./search.html?"+ params.toString()
    window.open(url);
}

/* Go to friendName's profile */
function goToFriend(friendName) {
    let params = new URLSearchParams(window.location.search);
    params.delete("tvID");
    params.append("friend",friendName);
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
}

/* Display correct image by searching the tv maze api using tvID 
and display rating and review if they exist for user.*/
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

 /* This function is triggered when the user clicks on a star. From their
 the function updates the rating on the page and in local storage. */
 function stars(star) {
    fillStars(star);

    let params = new URLSearchParams(window.location.search);
    let tvID = params.get("tvID"),
    username = params.get("username");
    let account = JSON.parse(localStorage.getItem(username));
    if(!account.hasOwnProperty(tvID)){
        account[tvID] = {};
    }
    account[tvID]["rating"] = star;
    localStorage.setItem(username,JSON.stringify(account));
 }

 /* Fill stars in as specified by parameter number. */
 function fillStars(number) {
    for(i=1; i<=number; i++){
        document.querySelector("#star"+i).style.color = "rgb(99, 23, 99)";
    }
    for(i=5; i>number; i--){
        document.querySelector("#star"+i).style.color = "rgb(205, 245, 243)";
    }
 }

 /* This function is called when the user clicks on the edit button. The user
 is then able to change their review and save, updating local storage. */
 function editReview() {
    let params = new URLSearchParams(window.location.search), tvID = params.get("tvID"),
    username = params.get("username");
    let newRev = changeReview();

     document.querySelector("#edit").innerHTML = "Save";
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

/* Create text box where user can update their review. */
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

 /* This function allows the user to add the tv show to one of their lists.
 If the tv show is already in a list, it is not listed as an option in the
 dropdown menu. */
 function addToList(image) {
    let params = new URLSearchParams(window.location.search);
    let tvID = params.get("tvID");
    let username = params.get("username");

     let account = JSON.parse(localStorage.getItem(username));
     for(item in account.lists) {
        let alreadyIn = false;
        for(i in account["lists"][item]){
            if(account["lists"][item][i].id == tvID){
                alreadyIn = true;
            }
        }
        // If show is already in list, don't show as option
         if(alreadyIn == false){
            let opt = document.createElement("option");
            opt.value = item;
            opt.innerHTML = item;
            document.querySelector("select").appendChild(opt);
         }
     }
     // When user clicks add, the tv show is saved to the selected list in local storage.
     document.querySelector("#add").addEventListener("click", ()=> {
        let addShow = {id: tvID, showImg: image};
        let account = JSON.parse(localStorage.getItem(username));
        account.lists[document.querySelector("select").value].push(addShow);
        localStorage.setItem(username,JSON.stringify(account));
        document.location.href = "./tvshow.html?"+ params.toString();
        window.open(url);
     });
 }

/* Show ratings/reviews by friends of user if they exist. */
 function friendReviews() {
     let params = new URLSearchParams(window.location.search);
     let username = params.get("username");
     let tvID = params.get("tvID");
     let account = JSON.parse(localStorage.getItem(username));
 
     for(i in account.friends) {
             let user = account.friends[i];
             let friendAccount = JSON.parse(localStorage.getItem(user));
             let fRev = document.createElement("div");
             let name = document.createElement("h4");
             name.innerHTML = user;
             name.addEventListener("click", ()=> {goToFriend(user)});

             if(friendAccount.hasOwnProperty(tvID)) {
                fRev.append(name);
                let a = friendAccount[tvID];

                if(a.hasOwnProperty("rating")) {
                    let rating = friendAccount[tvID]["rating"];
                    for(i=1; i<=rating; i++){
                        let star = document.createElement("span");
                        star.innerHTML = "&starf;";
                        star.style.color = "rgb(99, 23, 99)";
                        fRev.append(star);
                    }
                 
                }
                if(a.hasOwnProperty("review")) {
                    let rev = document.createElement("p")
                    rev.innerHTML = friendAccount[tvID]["review"];
                    fRev.append(rev);
                }
        
            }

             document.querySelector("#friendRev").appendChild(fRev);
     }
 }


