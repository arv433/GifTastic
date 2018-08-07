/* The names of the initially created buttons are stored in an object as keys with null values.
They are assigned an array of 10 jQuery objects which include the images pulled from the Giphy API.
They are initially assigned the null value so that their corresponding API call is made when its button
is clicked on, instead of making an API call for each of the 10 games when the page first loads */
var gameButtons = { "Metal Gear Solid": null, "Super Mario 64": null, "God of War": null, "Grand Theft Auto": null, "Detroit: Become Human": null, "Heavy Rain": null, "Superhot": null, "Fallout": null, "Kirby and the Rainbow Curse": null, "Super Smash Bros.": null };

/* favoritesArray is created from the localStorage and is an array of 4-element sub-arrays:
array[0] is the link to the still version of the gif
array[1] is the link to the animated version of the gif
array[2] is the alt name of the gif
array[3] is the MPAA-style rating of the gif */
var favoritesArray = JSON.parse(localStorage.getItem("favorites"));

// clear local storage if the favoritesArray does not exist or empty
if (!Array.isArray(favoritesArray) || !favoritesArray.length) {
    localStorage.clear();
};

$("#loadingImage").hide();

// this function sythesizes the gifs in the favorites screen from the array based on the local storage
function populateFavs() {
    $("#favoriteGifsDisplay").empty();
    if (!(favoritesArray === null)) {
        for (var m = 0; m <= favoritesArray.length - 1; m++) {
            var favGifDiv = $("<div>");
            favGifDiv.addClass("gifDiv");
            var favGifElement = $("<img>");
            favGifElement.attr("alt", favoritesArray[m][2]);
            favGifElement.attr("data-still", favoritesArray[m][0]);
            favGifElement.attr("data-animate", favoritesArray[m][1]);
            favGifElement.attr("src", favoritesArray[m][0]);
            favGifElement.attr("data-state", "still");
            favGifElement.attr("rating", favoritesArray[m][3]);
            favGifElement.addClass("gifImage");
            var favicon = $("<span>");
            favicon.addClass("glyphicon glyphicon-star star");
            var rating = $("<span>").text("Rated: " + favGifElement.attr("rating"));
            rating.addClass("rating");
            favGifDiv.append(favGifElement);
            favGifDiv.append(favicon);
            favGifDiv.append(rating);
            $("#favoriteGifsDisplay").prepend(favGifDiv);
        };
        addClickHandlersToImages();
    };
};

// this function renders the buttons from the gameButtons object
function renderButtons() {
    $("#buttonsContainer").empty();
    for (var i = 0; i <= Object.keys(gameButtons).length - 1; i++) {
        var button = $("<button>");
        button.addClass("videogameButton");
        button.attr("data-name", Object.keys(gameButtons)[i]);
        button.text(Object.keys(gameButtons)[i]);
        $("#buttonsContainer").append(button);
        addClickHandlersToButtons();
    };
};

// this function adds click handlers to each button once they are rendered
function addClickHandlersToButtons() {
    $(".videogameButton").unbind().click(function () {
        var title = $(this).attr("data-name");
        createImages(title);
    });
};

/* This function checks to see if the button is a default, having an initial null value or not.
If it is not a default, it appends the associated images to the display, shown in the else statement.
If it is, as shown in the if statement the function calls addGifArray to populate the gameButton object
then calls back to itself to complete the else statement */
function createImages(titleClickedOn) {
    if (gameButtons[titleClickedOn] === null) {
        $("#loadingImage").show();
        addGifArray(titleClickedOn, createImages);
    } else {

        for (var k = 0; k <= gameButtons[titleClickedOn].length - 1; k++) {
            $("#gifDisplay").prepend(gameButtons[titleClickedOn][k]);
        };
        addClickHandlersToImages();
    };
}

/* This function includes an optional callback that executes once the AJAX call is complete in case the
button it is populating images for has a null value in the gameButton object. This is done to set a smooth
user experience; if the user searches a game, the links pulled from the Giphy API become already available
in one click. If the button already exists, the button makes the AJAX call when clicked on instead of loading
all of the images when the page first loads. */
var addGifArray = function (title, callback = null) {
    if (favoritesArray === null || favoritesArray.length == 0) {
        localStorage.clear();
    };
    var GiphyQueryURL = "https://api.giphy.com/v1/gifs/search?q=" + title + "&limit=10&api_key=dc6zaTOxFJmzC";
    var imgArray = [];
    $.ajax({
        url: GiphyQueryURL,
        method: "GET"
    }).then(function (GiphyResponse) {
        console.log(GiphyResponse);
        for (var j = 0; j <= GiphyResponse.data.length - 1; j++) {
            // creating container
            var gifDiv = $("<div>");
            gifDiv.addClass("gifDiv");
            // creating gif
            var gifElement = $("<img>");
            gifElement.attr("alt", GiphyResponse.data[j].title);
            gifElement.attr("data-still", GiphyResponse.data[j].images.fixed_height_still.url);
            gifElement.attr("data-animate", GiphyResponse.data[j].images.fixed_height.url);
            gifElement.attr("src", gifElement.attr("data-still"));
            gifElement.attr("data-state", "still");
            gifElement.attr("rating", GiphyResponse.data[j].rating.toUpperCase());
            gifElement.addClass("gifImage");
            // adding rating
            var rating = $("<span>").text("Rated: " + gifElement.attr("rating"));
            rating.addClass("rating");
            // adding favicon
            var favicon = $("<span>");
            favicon.addClass("glyphicon star");
            // this if statement checks whether if the gif is a favorite or not, giving it the right star when pulled from Giphy
            if (!Array.isArray(favoritesArray) || !favoritesArray.length) {
                favicon.addClass("glyphicon-star-empty");
            } else {
                for (var l = 0; l <= favoritesArray.length - 1; l++) {
                    if (favoritesArray[l][0] == gifElement.attr("data-still")) {
                        favicon.addClass("glyphicon-star");
                    } else {
                        favicon.addClass("glyphicon-star-empty");
                    };
                };
            };
            // adding download button
            var downloadLink = $("<a>");
            downloadLink.addClass("downloadBtnContainer")
            downloadLink.attr("href", GiphyResponse.data[j].images.looping.mp4);
            downloadLink.attr("download", "")
            var downloadImg = $("<span>");
            downloadImg.addClass("glyphicon glyphicon-download-alt downloadBtn");
            downloadLink.append(downloadImg);
            // adding components to container Div
            gifDiv.append(gifElement);
            gifDiv.append(favicon);
            gifDiv.append(rating);
            gifDiv.append(downloadLink);
            // adding div to array
            imgArray.push(gifDiv);
            gameButtons[title] = imgArray;
            renderButtons();
        };
        if (!(callback === null)) {
            callback(title);
        }
        $("#loadingImage").hide();
    });
};

// this function adds the click handlers to play and stop the gifs, as well as the star button to favorite gifs
function addClickHandlersToImages() {
    $(".gifImage").on("click", function () {
        if ($(this).attr("data-state") == "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else if ($(this).attr("data-state") == "animate") {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        };
    });
    $(".star").unbind().click(function () {
        if (favoritesArray === null) {
            favoritesArray = [];
        };
        // if not already favorited:
        if ($(this).hasClass("glyphicon-star-empty")) {
            $(this).removeClass("glyphicon-star-empty");
            $(this).addClass("glyphicon-star");
            favoritesArray.push([$(this).prev().attr("data-still"), $(this).prev().attr("data-animate"), $(this).prev().attr("alt"), $(this).prev().attr("rating")]);
            localStorage.setItem("favorites", JSON.stringify(favoritesArray));

            // if aleady favorited:
        } else {
            $(this).removeClass("glyphicon-star");
            $(this).addClass("glyphicon-star-empty");
            // corresponding array from favoritesArray
            for (var n = 0; n <= favoritesArray.length - 1; n++) {
                if (favoritesArray[n][0] == $(this).prev().attr("data-still")) {
                    favoritesArray.splice(favoritesArray.indexOf(favoritesArray[n]), 1);
                    localStorage.setItem("favorites", JSON.stringify(favoritesArray));
                };
            };
            for (var o = 0; o <= Object.keys(gameButtons).length - 1; o++) {
                if (!(gameButtons[Object.keys(gameButtons)[o]] === null)) {
                    for (var p = 0; p <= gameButtons[Object.keys(gameButtons)[o]].length - 1; p++) {
                        var divBeingChecked = gameButtons[Object.keys(gameButtons)[o]][p];
                        if (divBeingChecked.children().eq(0).attr("data-still") == $(this).prev().attr("data-still")) {
                            divBeingChecked.children().eq(1).removeClass("glyphicon-star");
                            divBeingChecked.children().eq(1).addClass("glyphicon-star-empty");
                        };
                    };
                };
            };
            addClickHandlersToImages();
        };
        populateFavs();
    });
};

/* This function searches for a videogame title on IGDB then calls addGifArray to immediately find the associated images in one click.
Clicking the resulting button of the title searched for immediately pulls the images pull from Giphy instead of an additional AJAX call */
$("#videogameSubmit").on("click", function (event) {
    event.preventDefault();
    var IGDBGameTitle = $("#videogameInput").val().trim();
    var IGDBQueryURL = "https://api-endpoint.igdb.com/games/?search=" + IGDBGameTitle + "&fields=name";

    jQuery.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    $("#loadingImage").show();

    $.ajax({
        url: IGDBQueryURL,
        method: "GET",
        headers: {
            Accept: "application/json",
            "user-key": "2a3ccaf86ae132f05cecda0dda8b83bc"
        },
    }).then(function (IGDBResponse) {
        var returnedTitle = IGDBResponse[0].name;
        if (gameButtons[returnedTitle] === undefined) {
            addGifArray(returnedTitle);
        } else {
            alert("That game title is already a button")
            $("#loadingImage").hide();
        }
    });
});

// initialization functions
renderButtons();
populateFavs();