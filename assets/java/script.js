let test;
var searches = {};

//Dashboard
function dashDisplay(city) {
    var pastSearches = JSON.parse(localStorage.getItem('search-history'));
    if (pastSearches){
        console.log(pastSearches)
    }
    else{console.log('false')}
}

//Current day data search
$('.btn').on('click', function(){
    var userInput = document.querySelector('#query').value.toLowerCase()
    
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q='+userInput+'&units=imperial&appid=fa0e2d502955fffde3147fb635a2c723'
        )
        .then(function(response1) {
          if (!response1.ok){ throw Error(response.statusText)}
            return response1.json();
        })
        .then(function(cordinates) {
            if(localStorage.getItem('search-history')){
                searches = JSON.parse(localStorage.getItem('search-history'));
            }

            var lat = cordinates['coord'].lat;
            var lon =  cordinates['coord'].lon
            var city = cordinates['name'];

            fetch(
                'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&units=imperial&appid=fa0e2d502955fffde3147fb635a2c723'
                )
                .then(function(response2) {
                    return response2.json();
                })
                .then(function(searchResults) {
                    var temperature = searchResults['current'].temp;
                    var humidity =  searchResults['current'].humidity;
                    var uvIndex =  searchResults['current'].uvi;
                    var wind =  searchResults['current'].wind_gust;
                    var forecast = {};

                    for (i=0;i<5;i++) {
                        var forecastTemp = searchResults['daily'][i].temp.day;
                        var forecastHum =  searchResults['daily'][i].humidity;
                        var forecastUVI =  searchResults['daily'][i].uvi;
                        var forecastWind =  searchResults['daily'][i].wind_gust;
                        forecast[i] = {'temp':forecastTemp, 'humidity':forecastHum, 'uvi':forecastUVI, 'wind':forecastWind}
                    }

                    searches[city] = {'temp':temperature, 'humidity':humidity, 'uvi':uvIndex, 'wind':wind, 'forecast':forecast};
                    localStorage.setItem('search-history', JSON.stringify(searches));
                    dashDisplay(city);
                });
        })
        .catch(function(error){
            window.alert(error);
        });
})
