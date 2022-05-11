window.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#searchButton").addEventListener("click",searchHandler);
    document.querySelector("#search").addEventListener("keypress", (event) =>{
        if (event.charCode == 13) {
            searchHandler();
         }
    });
    let params = new URLSearchParams(window.location.search),username = params.get("username");
    document.querySelector("#user").innerHTML = username;
    document.querySelector("h1").addEventListener("click", () => {
        document.location.href = "./home.html?"+ params.toString();
        window.open(url);
    });
});

async function searchHandler() {
    document.querySelector("#showImages").innerHTML = "";
    let search = document.querySelector("#search").value;
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
        let newImage = document.createElement("img");
        newImage.src = image;
        newImage.height = 150;

        let tvID = id;
        newImage.addEventListener("click",function () {
            let params = new URLSearchParams(window.location.search);
            params.append("tvID",tvID);
            document.location.href = "./tvShow.html?"+ params.toString();
            window.open(url);
        });
        document.querySelector("#showImages").appendChild(newImage);
}
