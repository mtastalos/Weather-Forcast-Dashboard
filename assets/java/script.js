let searchResults;
var searches = [];
//Current day data search
$('.btn').on('click', function(){
    var userInput = document.querySelector('#query').value.toLowerCase()
    
    fetch(
        // 'https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=minutely,hourly,alerts&units=imperial&appid=fa0e2d502955fffde3147fb635a2c723'
        'https://api.openweathermap.org/data/2.5/weather?q='+userInput+'&units=imperial&appid=fa0e2d502955fffde3147fb635a2c723'
        )
        .then(function(response1) {
          if (!response1.ok){ throw Error(response.statusText)}
            return response1.json();
        })
        .then(function(cordinates) {
            console.log(cordinates)

            var lat = cordinates['coord'].lat;
            var lon =  cordinates['coord'].lon
            var name = cordinates['name'];

            fetch(
                'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&units=imperial&appid=fa0e2d502955fffde3147fb635a2c723'
                )
                .then(function(response2) {
                    return response2.json();
                })
                .then(function(searchResults) {
                    console.log(searchResults)
                    var temperature = searchResults['current'].temp;
                    var humidity =  searchResults['current'].humidity;
                    var uvIndex =  searchResults['current'].uvi;
                    var wind =  searchResults['current'].wind_gust;


                    return searches[userInput] = {'name':name, 'temp':temperature, 'humidity':humidity, 'uvi':uvIndex, 'wind':wind};
                });

                if(localStorage.getItem('searchHistory')!=null){
                    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
                    searchHistory.push()
                }
                else {

                }

           
        })
        .catch(function(error){
            window.alert(error);
        });
        

    
    // var searchCityDate = document.createElement('p');
    
    
})
