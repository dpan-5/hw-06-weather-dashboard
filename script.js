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
            url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=imperial`,
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

            // Get 5 day forecast
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=imperial&exclude=current,minutely,hourly`,
                method: "GET"
            }).then(renderFiveDayForecast)



        });
    }

    // Dynamically updates HTML to render weather data
    function renderWeatherDisplay(response, responseUV) {
        $(".hide").show();
        $("#weather-info-display").append($("<h2>").text(`${response.name}`));
        $("h2").append($("<img>").attr("src", `http://openweathermap.org/img/w/${response.weather[0].icon}.png`));
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

    function renderFiveDayForecast(response) {
        
        console.log(response);
        var d = new Date();
        
        $("#five-day-display").prepend($("<h3>").text("5-Day Forecast:"));

        for(var i = 1; i <= 5; i++){
            $(".card-deck").append($("<div class='card text-white bg-primary card-body'>").append($("<h5>").text(`${d.getMonth()}/${d.getDate()+i}/${d.getFullYear()}`)));
            
        }

    }





});