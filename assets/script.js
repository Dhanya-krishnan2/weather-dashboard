//creating a function to clear search 
$(document).ready(function(){
function createCityList(citySearchList) {
    $("#city-list").empty();
  //making an array of city search list
    var keys = Object.keys(citySearchList);
    //looping over through the city 
    for (var i = 0; i < keys.length; i++) {
      var cityListEntry = $("<button>");
      // adding a class name to the cityListEntry
      cityListEntry.addClass("list-group-item list-group-item-action");
  // checking for case of the city and looping throgh each letter we enter and making in to upper and lower and then jojing them again
      var splitStr = keys[i].toLowerCase().split(" ");
      for (var j = 0; j < splitStr.length; j++) {
        splitStr[j] =
          splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
      }
      var titleCasedCity = splitStr.join(" ");
      cityListEntry.text(titleCasedCity);
     //appending city list entry to city called id named city-list
      $("#city-list").append(cityListEntry);
    }
  }
  //creating another fuction to create the city name we entered
  function populateCityWeather(city, citySearchList) {
    createCityList(citySearchList);
  // declaring variable and assignig the url from open weather map org.
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?&units=metric&appid=885e9149105e8901c9809ac018ce8658&q=" +
      city;
  
    var queryURL2 =
      "https://api.openweathermap.org/data/2.5/forecast?&units=metric&appid=885e9149105e8901c9809ac018ce8658&q=" +
      city;    
  //declaing variable and assigning the values as latitude and logitude
    var latitude;
  
    var longitude;
  //we are usig ajax GET method to get the url data
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // Store all of the retrieved data inside of an object called "weather" 
      .then(function(weather) {
        // logging the variable we made for queryURL and the object called weather
        console.log(queryURL);
  
        // Log the resulting object
        console.log(weather);
      // decalaring and assigning moment() to display the exact time by the use of moment.js
        var nowMoment = moment();
  
        var displayMoment = $("<h3>");
        $("#city-name").empty();
        $("#city-name").append(
          displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
        );
  
        var cityName = $("<h3>").text(weather.name);
        $("#city-name").prepend(cityName);
  
        var weatherIcon = $("<img>");
        weatherIcon.attr(
          "src",
          "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
        );
        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);
  
        $("#current-temp").text("Temperature: " + weather.main.temp + " °c");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");
  
        latitude = weather.coord.lat;
        longitude = weather.coord.lon;
  
        var queryURL3 =
          "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=metric&appid=885e9149105e8901c9809ac018ce8658&q=" +
          "&lat=" +
          latitude +
          "&lon=" +
          longitude;
  
        $.ajax({
          url: queryURL3,
          method: "GET"
          // Store all of the retrieved data inside of an object called "uvIndex"
        }).then(function(uvIndex) {
          console.log(uvIndex);
  
          var uvIndexDisplay = $("<button>");
          uvIndexDisplay.addClass("btn btn-danger");
  
          $("#current-uv").text("UV Index: ");
          $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
          console.log(uvIndex[0].value);
  
          $.ajax({
            url: queryURL2,
            method: "GET"
            // Store all of the retrieved data inside of an object called "forecast"
          }).then(function(forecast) {
            console.log(queryURL2);
  
            console.log(forecast);
            // Loop through the forecast list array and display a single forecast entry/time (5th entry of each day which is close to the highest temp/time of the day) from each of the 5 days
            for (var i = 6; i < forecast.list.length; i += 8) {
              // 6, 14, 22, 30, 38
              var forecastDate = $("<h5>");
  
              var forecastPosition = (i + 2) / 8;
  
              console.log("#forecast-date" + forecastPosition);
  
              $("#forecast-date" + forecastPosition).empty();
              $("#forecast-date" + forecastPosition).append(
                forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
              );
              // declaring a variable for the icon and using the idea in the original url we used that is according to the position of id in the json.
              var forecastIcon = $("<img>");
              forecastIcon.attr(
                "src",
                "https://openweathermap.org/img/w/" +
                  forecast.list[i].weather[0].icon +
                  ".png"
              );
  
              $("#forecast-icon" + forecastPosition).empty();
              $("#forecast-icon" + forecastPosition).append(forecastIcon);
  
              console.log(forecast.list[i].weather[0].icon);
  
              $("#forecast-temp" + forecastPosition).text(
                "Temp: " + forecast.list[i].main.temp + " °c"
              );
              $("#forecast-humidity" + forecastPosition).text(
                "Humidity: " + forecast.list[i].main.humidity + "%"
              );
  
              $(".forecast").attr(
                "style",
                "background-color:yellow; color:red"
              );
            }
          });
        });
      });
  }
  //saving the searched city in  the local storage.
  $(document).ready(function() {
    var citySearchListStringified = localStorage.getItem("citySearchList");
  
    var citySearchList = JSON.parse(citySearchListStringified);
  
    if (citySearchList == null) {
      citySearchList = {};
    }
  
    createCityList(citySearchList);
  
    $("#current-weather").hide();
    $("#forecast-weather").hide();
  
    $("#search-button").on("click", function(event) {
      event.preventDefault();
      var city = $("#city-input")
        .val()
        .trim()
        .toLowerCase();
  
      if (city != "") {
        //Check to see if there is any text entered
      
        citySearchList[city] = true;
      localStorage.setItem("citySearchList", JSON.stringify(citySearchList));
  
      populateCityWeather(city, citySearchList);
  
      $("#current-weather").show();
      $("#forecast-weather").show();
      }
  
      
    });
  
    $("#city-list").on("click", "button", function(event) {
      event.preventDefault();
      var city = $(this).text();
  
      populateCityWeather(city, citySearchList);
  
      $("#current-weather").show();
      $("#forecast-weather").show();
    });
  });
});
  