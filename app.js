const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express()
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/index.html");
})

app.post('/', (req,res) =>{
    const apiKey = process.env.API_KEY
    const cityName = req.body.cityId
    const url = `https://samples.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`

    https.get(url, (response) =>{
        console.log(response.statusCode);

        response.on("data", (data) =>{
           const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

            res.write(`<p>The weather is currently ${weatherDescription}</p>`);
            res.write(`<h1>The temperature in ${cityName} is ${temp} F.</h1>`)
            res.write("<img src=" + imgUrl +">");
            res.send()

        })
    })
    
    

  
})

app.listen(3000, () =>{
    console.log('server is up and running');
})

