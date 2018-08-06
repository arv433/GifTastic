var gameArray = { "Metal Gear Solid": null, "Super Mario 64": null, "God of War": null, "Grand Theft Auto": null, "Detroit: Become Human": null, "Heavy Rain": null, "Superhot": null, "Fallout": null, "Kirby and the Rainbow Curse": null, "Super Smash Bros.": null };

$("#loadingImage").hide();

function renderButtons() {
    $("#buttonsContainer").empty();
    for (var i = 0; i <= Object.keys(gameArray).length - 1; i++) {
        var button = $("<button>");
        button.addClass("videogameButton");
        button.attr("data-name", Object.keys(gameArray)[i]);
        button.text(Object.keys(gameArray)[i]);
        $("#buttonsContainer").append(button);
        addClickHandlersToButtons();
    };
};

function addClickHandlersToButtons() {
    $(".videogameButton").unbind().click(function () {
        var titleClickedOn = $(this).attr("data-name");
        console.log(titleClickedOn + ": " + gameArray[titleClickedOn]);
        if (gameArray[titleClickedOn] === null) {
            console.log("addClickHandlersToButtons identified the title as null and will now call addGifContainer");
            addGifContainer(titleClickedOn, addClickHandlersToButtons());
        } else {
            console.log("addClickHandlersToButtons found the image array and will now populate the image div")
            $("#gifDisplay").empty();
            for (var k = 0; k <= gameArray[titleClickedOn].length - 1; k++) {
                $("#gifDisplay").append(gameArray[titleClickedOn][k]);
                console.log("Added image #" + k);
            };
            addClickHandlersToImages();
        };
    });
};

var addGifContainer = function(title, callback = null) {
    console.log("AddGifContainer is called")
    var GiphyQueryURL = "https://api.giphy.com/v1/gifs/search?q=" + title + "&limit=30&api_key=dc6zaTOxFJmzC";
    var imgArray = [];
    $.ajax({
        url: GiphyQueryURL,
        method: "GET"
    }).then(function (GiphyResponse) {
        console.log(GiphyResponse.data);
        for (var j = 0; j <= GiphyResponse.data.length - 1; j++) {
            var gifElement = $("<img>");
            gifElement.attr("src", GiphyResponse.data[j].images.fixed_height_still.url);
            gifElement.attr("alt", GiphyResponse.data[j].title);
            gifElement.attr("data-still", GiphyResponse.data[j].images.fixed_height_still.url);
            gifElement.attr("data-animate", GiphyResponse.data[j].images.fixed_height.url);
            gifElement.attr("data-state", "still");
            gifElement.addClass("gifImage");
            imgArray.push(gifElement.prop("outerHTML"));
            gameArray[title] = imgArray;
            renderButtons();
        };
        console.log("gifs added to gameArray");
        if (callback === null) {
            console.log("callback not identified in addGifContainer")
        } else {
            console.log("calling callback...")
            callback();
        }
    });
};

function addClickHandlersToImages() {
    $(".gifImage").on("click", function () {
        console.log("Clicked on")
        if ($(this).attr("data-state") == "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else if ($(this).attr("data-state") == "animate") {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        };
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
        complete: function () {
            $("#loadingImage").hide();
        }
    }).then(function (IGDBResponse) {
        var returnedTitle = IGDBResponse[0].name;
        if (gameArray[returnedTitle] === undefined) {
            addGifContainer(returnedTitle);
        } else {
            alert("That game title is already a button")
        }
    });
});

function sayHi(callback = null) {
    console.log("Hi!");
    if (callback) {
        callback();
    }
}

function sayHelloBack() {
    console.log("I say hello back");
}

renderButtons();