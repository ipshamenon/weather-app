const { response } = require("express");
const express = require ("express");
const app = express();
const https = require('https');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res){
    const query = req.body.cityName;
    const apiKey = "0268716c6b42ef1495b318573786b781";
    const units = "imperial"
    
    const url =  "https://api.openweathermap.org/data/2.5/weather?q="+ query + "&units=" + units + "&appid=" + apiKey;
    
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function (data){
            const weatherData = JSON.parse(data); 
            const temperature = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon +"@2x.png";

            res.write("<h1>The temperature in " + query +  " is " + temperature + " degrees Fahrenheit</h1>");
            res.write("<h3> The weather is currently " + weatherDescription + "</h3>");
            res.write("<img src=" + imageURL + ">");
            res.send();

        });
    });
})

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
