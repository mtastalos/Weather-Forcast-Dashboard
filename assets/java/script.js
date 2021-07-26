let test;
var searches = {};
var searchesSplice;
//Dashboard
function dashDisplay(city) {
    //--display previous searches found in localStorage
    var pastSearches = JSON.parse(localStorage.getItem('search-history'));
    if (pastSearches !=null){
        removeContent()
        for (var item in pastSearches){
            var pastSearch = $('<div><button class="btn btn-secondary" id="pastSearch">'+item+'</button></div>');
            $('#pastSearches').prepend(pastSearch);
        }
    }

    //--if page is reloaded, display last search
    if (city==undefined) {
        city = $('#pastSearches button').first().text();
        if(city==''){return}
    }    

    //--display current day 
    var currentDayDisplay = $(
        '<h3 class="row">'+city+' ('+moment().format('l')+')</h3>'+
        '<p class="row">Temp: '+pastSearches[city].temp+' °F</p>'+
        '<p class="row">Wind: '+pastSearches[city].wind+' MPH</p>'+
        '<p class="row">Humidity: '+pastSearches[city].humidity+' %</p>'+
        '<p class="row">UV Index: '+(pastSearches[city].uvi/100).toFixed(2)+'</p>');
    $('#currentDate').append(currentDayDisplay);
     
    //--5-day forecast 
    for(i=0;i<5;i++) {
        var forecastDate = moment().add((i+1),'d').format('l');
        var forecastDisplay = $(
            '<h5 class="row">'+forecastDate+'</h5>'+
            '<p class="row">Temp: '+pastSearches[city].forecast[i].temp+' °F</p>'+
            '<p class="row">Wind: '+pastSearches[city].forecast[i].wind+' MPH</p>'+
            '<p class="row">Humidity: '+pastSearches[city].forecast[i].humidity+' %</p>');
        $('[data-forecast='+(i+1)+']').append(forecastDisplay);
    }
}

//Removes content
function removeContent() {
    var content = document.querySelector('#pastSearches');
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }

    content = document.querySelector('#currentDate');
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }

    for(i=0;i<5;i++) {
        content = document.querySelector('[data-forecast="'+(i+1)+'"]');
        while(content.firstChild){
            content.removeChild(content.firstChild);
        }
    }
}

//Button click event for search
$('#search').on('click', function(){
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
            var lon =  cordinates['coord'].lon;
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
                    removeContent();
                    dashDisplay(city);
                });
        })
        .catch(function(error){
            window.alert(error);
        });
})

//Button click event for previous searches
$('#pastSearches').on ('click','#pastSearch', function() {
    dashDisplay($(this).text())
})

dashDisplay()