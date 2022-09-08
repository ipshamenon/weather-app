const { response } = require("express");
const express = require ("express");
const ej = require("ejs");
const https = require('https');
const bodyParser = require("body-parser");
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const resultsInfo = [];

app.get("/", function(req, res){
    res.render("index", {results: resultsInfo});
   
});

app.get("/results", function(req, res){
    res.render("results", {results: resultsInfo});
   
});


app.post("/", function (req, res){
    const query = req.body.cityName;
    const apiKey = "0268716c6b42ef1495b318573786b781";
    const units = "imperial"
    
    const url =  "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + apiKey;
    
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function (data){
            const weatherData = JSON.parse(data); 
            const temperature = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const countryCode = weatherData.sys.country;
            const imageURL = "http://openweathermap.org/img/wn/" + icon +".png";
            const result = {
                query: query,
                temperature: Math.round(temperature),
                weatherDescription: weatherDescription,
                imageURL: imageURL,
                country: countryCode,
            }
            
            resultsInfo.unshift(result);
            res.redirect("results");

        });
        
    });
   
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port " + port);
});