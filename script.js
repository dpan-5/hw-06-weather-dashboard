$(document).ready(function() {

const APIKEY = "4d1c35ab02fb69cc9be0d032ef6ba186";


    // Event listener for search
    $("#citySearchBtn").on("click", getWeather);

    // Makes API call to openweathermap.org and returns data
    function getWeather() {
        var city = $("#searchInput").val(); // returns val of user search input (i.e. City)

        var lat = "";
        var lon = "";

        // Get weather data
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=imperial`,
            method: "GET"
        }).then(function(response) {
            lat = response.coord.lat;
            lon = response.coord.lon;
            

            // Get UV index data using latitude and longitude from previous API call
            $.ajax({
                url: `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=${APIKEY}&lat=${lat}&lon=${lon}&cnt=1`,
                method: "GET"
            }).then(function(responseUV) {
                renderWeatherDisplay(response, responseUV);
            });
        });
    }

    // Dynamically updates HTML to render weather data
    function renderWeatherDisplay(response, responseUV) {
        $(".hide").show();
        $("#weather-info-display").append($("<h2>").text(response.name));
        $("#weather-info-display").append($("<p>").text(`Temperature: ${response.main.temp} °F`));
        $("#weather-info-display").append($("<p>").text(`Humidity: ${response.main.humidity}%`));
        $("#weather-info-display").append($("<p>").text(`Wind Speed: ${response.wind.speed} MPH`));
        $("#weather-info-display").append($("<p>").text(`U/V Index: ${responseUV[0].value}`));



        console.log(response);
    }


    // $.ajax({
    //     url: "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY}"

    // }).then(console.log(response))









});