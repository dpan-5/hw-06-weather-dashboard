$(document).ready(function() {

    // APIKEY for openweather.org
    const APIKEY = "4d1c35ab02fb69cc9be0d032ef6ba186";

    // Array of cities from localStorage that the user has searched for - used to populate sidebar
    var citySearches = [];

    // Initializing variable to keep track of last searched city
    var lastSearchedCity = "";

    // Event listener for Search bar
    $("#citySearchBtn").on("click", function() {
        var city = $("#searchInput").val(); // returns val of user search input (i.e. City)
        getWeather(city);
        lastSearchedCity = city;
    });

    // Makes API call to openweathermap.org and returns data
    function getWeather(city) {
        var lat = "";
        var lon = "";

        // Grab weather data, then make two additional API calls to get UV index and 5-day forecast
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=imperial`,
            method: "GET"
        }).then(function(response) {
            lat = response.coord.lat;
            lon = response.coord.lon;
            saveToLocalStorage();
            renderCitySidebar();
            
            // Get UV index data using latitude and longitude from previous API call, then call renderWeatherDisplay function
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/uvi/forecast?appid=${APIKEY}&lat=${lat}&lon=${lon}&cnt=1`,
                method: "GET"
            }).then(function(responseUV) {
                renderWeatherDisplay(response, responseUV);
            });

            // Get 5 day forecast by using latitude and longitude from first API call, then call renderFiveDayForecast function
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=imperial&exclude=current,minutely,hourly`,
                method: "GET"
            }).then(renderFiveDayForecast);
        });
    }

    // Renders current weather data for city on page by dynamically updating HTML
    function renderWeatherDisplay(response, responseUV) {
        $("#weather-info-display").empty(); // empty the weather-info-display div, so that elements do not get duplicated if this function is called multiple times
        $(".hide").show(); // shows the hidden weather display, due to styling - borders are shown even if empty so we have to hide it initially
        $("#weather-info-display").append($("<h2>").text(`${response.name}`));
        $("h2").append($("<img>").attr("src", `https://openweathermap.org/img/w/${response.weather[0].icon}.png`));
        $("#weather-info-display").append($("<p>").text(`Temperature: ${response.main.temp} °F`));
        $("#weather-info-display").append($("<p>").text(`Humidity: ${response.main.humidity}%`));
        $("#weather-info-display").append($("<p>").text(`Wind Speed: ${response.wind.speed} MPH`));

        if(responseUV[0].value < 4) {
            $("#weather-info-display").append($("<p>").text("UV Index: ").append($("<span class='badge badge-pill badge-success'>").text(responseUV[0].value)));
        }
        else if(responseUV[0].value >= 4 && responseUV[0].value <= 7) {
            $("#weather-info-display").append($("<p>").text("UV Index: ").append($("<span class='badge badge-pill badge-warning'>").text(responseUV[0].value)));
        }
        else {
            $("#weather-info-display").append($("<p>").text("UV Index: ").append($("<span class='badge badge-pill badge-danger'>").text(responseUV[0].value)));
        }
    }

    // Renders 5-day forecast on page by dynamically updating HTML
    function renderFiveDayForecast(response) {
        // First, empty the five-day-display div of any existing elements (used for when a user inputs another city so that elements don't become stacked)
        $("#five-day-display").empty();
        // Dynamically create header and bootstrap 'card-deck' div for the loop to append elements to
        $("#five-day-display").append($("<h3>").text("5-Day Forecast:"), $("<div class='card-deck'>"));

        for(var i = 1; i <= 5; i++){
            // Create Date object with the UNIX timestamp so that we can grab those values and convert to readable format (MM/DD/YYYY)
            var d = new Date(response.daily[i].dt*1000); 
            $(".card-deck").append($("<div class='card text-white bg-primary card-body'>").append($("<h5>").text(`${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`), 
            $("<p>").append($("<img>").attr("src", `https://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png`)),
            $("<p>").text(`Temp: ${response.daily[i].temp.day} °F`),
            $("<p>").text(`Humidity: ${response.daily[i].humidity}%`)));
        }
    }

    // Saves past searched cities to localStorage
    function saveToLocalStorage() {
        // Validation check to see if searched city exists on the sidebar AND whether or not searched city is an empty string
        if(citySearches.includes($("#searchInput").val()) === false && $("#searchInput").val().trim() != "") {
            // Push search term to citySearches array **** PROBABLY NEED TO ACCOUNT FOR EDGE CASE
            citySearches.push($("#searchInput").val());
            // Sets localStorage to past searches using citySearches array
            localStorage.setItem("citySearches", JSON.stringify(citySearches));

        // Sets localStorage to last searched city
        localStorage.setItem("lastSearchedCity", lastSearchedCity);
        }
    }

    // Renders past searched cities in the sidebar
    function renderCitySidebar() {
        // Empty the list-group div to prevent duplication of city searches in the display
        $(".list-group").empty();
        var storedCitySearches = JSON.parse(localStorage.getItem("citySearches"));
        if(storedCitySearches !== null) {
            citySearches = storedCitySearches;
        }

        // Dynamically create HTML elements for each city in the citySearches array
        citySearches.forEach(element => {
            $(".list-group").append($("<button type='button' class='list-group-item list-group-item-action'>").text(element));
        });
    }

    // Event listener for past searched cities, using event delegation to handle the event
    $(".list-group").on("click", ".list-group-item", function(event) {
        getWeather($(this).text());
    });

    renderCitySidebar();

    // Check localStorage for lastSearchedCity to display on screen
    if(localStorage.getItem("lastSearchedCity") !== null) {
        getWeather(localStorage.getItem("lastSearchedCity"));
    }
});