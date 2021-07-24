let stuff;
//Current day data search
$('.btn').on('click', function(){
    var userInput = document.querySelector('#query').value
    // console.log(userInput)
    fetch(
        'https://api.openweathermap.org/data/2.5/weather?q='+userInput+'&units=imperial&appid=fa0e2d502955fffde3147fb635a2c723'
        )
        .then(function(response) {
          if (!response.ok){ throw Error(response.statusText)}
            return response.json();
        })
        .then(function(data) {
           return stuff = data;
        })
        .catch(function(error){
            window.alert(error);
        });
    
    var searchCityDate = document.createElement('p');
    
    
})
