window.addEventListener("DOMContentLoaded", function () {
    updateTVPage();
    saveReview();
});

 async function updateTVPage() {
    let params = new URLSearchParams(window.location.search),tvID = params.get("tvID");
    url = "https://api.tvmaze.com/shows/"+tvID+"?";
    let response = await fetch(url);
     if(response.ok) {
         let r = await response.json();
         document.querySelector("#tvImage").src = r.image.medium;
         document.querySelector("#showName").innerHTML = r.name;
     }
 }
