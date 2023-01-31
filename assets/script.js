var searchHistory = [];

var cityName = $("#city");
var cityTemp = $("#temp");
var cityHumidity = $("#humidity");
var cityWind = $("#wind");
var cityIcon = $("#icon");

cityName.text("Search for a city");
cityTemp.text("Temp: ");
cityHumidity.text("Humidity: ");
cityWind.text("Wind: ");

var currentSearch;
$("#search-button").on("click", function (event) {
  event.preventDefault();
  currentSearch = $("#search-input").val();
  searchHistory.push(currentSearch);
  history();
  renderData();
});

function renderData() {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    currentSearch +
    "&appid=5c1a57de81d40e63f1a0fbdf0ff7aed8";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    cityName.text(
      currentSearch + " " + "(" + moment().format("MMM Do YY") + ")"
    );

    cityIcon.attr(
      "src",
      "https://openweathermap.org/img/wn/" +
        response.list[0].weather[0].icon +
        "@2x.png"
    );

    cityTemp.text(
      "Temp: " + (response.list[0].main.temp - 273.15).toFixed(2) + " °C"
    );
    cityHumidity.text("Humidity: " + response.list[0].main.humidity + "%");
    cityWind.text(
      "Wind: " + (response.list[0].wind.speed * 3.6).toFixed(2) + " KMH"
    );

    function forecast() {
      var forecastRow = $("#forecast-row");
      forecastRow.empty();
      for (var i = 0; i < 5; i++) {
        var forecastRow = $("#forecast-row");
        var forecastCol = $("<div>");
        var forecastTitle = $("<h5>");
        var forecastIcon = $("<img>");
        var forecastText = $("<p>");
        forecastTitle.addClass("card-title");
        forecastCol.addClass("col");
        forecastCol.css({
          "background-color": "lightblue",
          "border-radius": "5px",
          margin: "10px",
          "padding-top": "20px",
        });

        forecastIcon.attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            response.list[i].weather[0].icon +
            "@2x.png"
        );

        forecastTitle.text(
          moment()
            .add(i + 1, "days")
            .format("MMM Do YY")
        );

        forecastText.text(
          " Temp: " +
            (response.list[i].main.temp - 273.15).toFixed(2) +
            " °C" +
            " Humidity: " +
            response.list[i].main.humidity +
            "%" +
            " Wind: " +
            (response.list[i].wind.speed * 3.6).toFixed(2) +
            " KMH"
        );
        forecastRow.append(forecastCol);

        forecastCol.append(forecastTitle);
        forecastCol.append(forecastIcon);

        forecastCol.append(forecastText);
      }
    }
    forecast();
  });
}

function history() {
  $("#history").empty();
  for (var i = 0; i < searchHistory.length; i++) {
    var historyDiv = $("#history");
    var historyLine = $("<button>");
    historyLine.attr("data-name", searchHistory[i]);
    historyLine.attr("id", "history-button");
    historyLine.attr("class", "history-button");

    historyLine.attr("style", "text-transform: capitalize; margin: 5px;");
    historyLine.text(searchHistory[i]);
    historyDiv.append(historyLine);
  }
  if (searchHistory.length > 10) {
    searchHistory.shift();
  }
}
history();

$("#history").on("click", "#history-button", function (event) {
  event.preventDefault();
  currentSearch = $(this).attr("data-name");
  renderData();
});
