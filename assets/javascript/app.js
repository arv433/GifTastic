var gameButtons = { "Metal Gear Solid": null, "Super Mario 64": null, "God of War": null, "Grand Theft Auto": null, "Detroit: Become Human": null, "Heavy Rain": null, "Superhot": null, "Fallout": null, "Kirby and the Rainbow Curse": null, "Super Smash Bros.": null };

var favoritesArray = JSON.parse(localStorage.getItem("favorites"));

if (!Array.isArray(favoritesArray) || !favoritesArray.length) {
    localStorage.clear();
};

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
            favGifElement.addClass("gifImage");
            var favicon = $("<span>");
            favicon.addClass("glyphicon glyphicon-star star");
            favGifDiv.append(favGifElement);
            favGifDiv.append(favicon);
            $("#favoriteGifsDisplay").prepend(favGifDiv);
        };
        addClickHandlersToImages();
    };
};

$("#loadingImage").hide();

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

function addClickHandlersToButtons() {
    $(".videogameButton").unbind().click(function () {
        var title = $(this).attr("data-name");
        createImages(title);
    });
};

function createImages(titleClickedOn) {
    if (gameButtons[titleClickedOn] === null) {
        $("#loadingImage").show();
        addGifArray(titleClickedOn, createImages);
    } else {
        $("#gifDisplay").empty();
        for (var k = 0; k <= gameButtons[titleClickedOn].length - 1; k++) {
            $("#gifDisplay").append(gameButtons[titleClickedOn][k]);
        };
        addClickHandlersToImages();
    };
}

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
            var gifDiv = $("<div>")
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
            // adding favicon
            var favicon = $("<span>");
            favicon.addClass("glyphicon star");
            var rating = $("<span>").text("Rated: " + gifElement.attr("rating"));
            rating.addClass("rating");
            if (!Array.isArray(favoritesArray) || !favoritesArray.length) {
                console.log("not an array")
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
            // adding components to container Div
            gifDiv.append(gifElement);
            gifDiv.append(favicon);
            gifDiv.append(rating);
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
            favoritesArray.push([$(this).prev().attr("data-still"), $(this).prev().attr("data-animate"), $(this).prev().attr("alt")]);
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
            }; // move under here
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
        };
        populateFavs();
        addClickHandlersToImages();
    });
};

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

renderButtons();
populateFavs();