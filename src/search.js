window.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#searchButton").addEventListener("click",searchHandler);
    document.querySelector("#search").addEventListener("keypress", (event) =>{
        if (event.charCode == 13) {
            searchHandler();
         }
    });
});

function searchHandler() {
    document.querySelector("#showImages").innerHTML = "";
    let search = document.querySelector("#search").value;
    fetchImages(search);
}

async function fetchImages(topic) {
    let url = "https://api.tvmaze.com/search/shows?q=" + topic;
    let response = await fetch(url);
 
    if (response.ok) {
      let r = await response.json();
        for (let c of r) {
            if(c.show.image != null){
                let newImage = document.createElement("img");
                newImage.src = c.show.image.medium;
                newImage.height = 150;
                let tvID = c.show.id;
                newImage.addEventListener("click",function () {
                    let params = new URLSearchParams(window.location.search);
                    params.append("tvID",tvID);
                    document.location.href = "./tvShow.html?"+ params.toString();
                    window.open(url);
                });
                document.querySelector("#showImages").appendChild(newImage);
            }
        }
    } 
 }
