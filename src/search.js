window.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search);
    let username = params.get("username");
    document.querySelector("#user").innerHTML = username;
    document.querySelector("#user").addEventListener("click", goHome);
    document.querySelector("h1").addEventListener("click", goHome);

    document.querySelector("#searchButton").addEventListener("click",searchHandler);
    document.querySelector("#search").addEventListener("keypress", (event) =>{
        // If user hits enter
        if (event.charCode == 13) {
            searchHandler();
         }
    });
});

/* Take the user to their home page, keeping their username stored in the url. */
function goHome() {
    let params = new URLSearchParams(window.location.search);
    document.location.href = "./home.html?"+ params.toString();
    window.open(url);
}

/* This function calls fetchImages on the user's search input and recieves a map
of shows. Then the function calls addImages on each element in the returned map,
a function that will print the images on the web page.
*/
async function searchHandler() {
    // clear images already in #showImages div
    document.querySelector("#showImages").innerHTML = "";

    let search = document.querySelector("#search").value;
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

 /* Add tv images to the #showImages div and create an event listener
 are each image that take the user to the web page of the tv show they
 clicked on. */
function addImages(image, tvID) {
        let newImage = document.createElement("img");
        newImage.src = image;
        newImage.height = 150;

        newImage.addEventListener("click",function () {
            let params = new URLSearchParams(window.location.search);
            // Store tvId in url so it can be accessed by tvShow.js
            params.append("tvID",tvID);
            document.location.href = "./tvShow.html?"+ params.toString();
            window.open(url);
        });
        document.querySelector("#showImages").appendChild(newImage);
}
