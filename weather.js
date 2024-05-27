document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '68ca6fc28f4145e1bf294422242705';
    const city = 'London';
    // const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=London&days=5&aqi=no&alerts=no`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
});

function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-container');
    console.log(data.forecast.forecastday);
    const location = data.location.name;
    const region = data.location.region;
    const country = data.location.country;
    const temperature = data.current.temp_c;
    const condition = data.current.condition.text;
    const icon = data.current.condition.icon;

    weatherContainer.innerHTML = `
        <h2>${location}, ${region}, ${country}</h2>
        <img src="${icon}" alt="Weather icon">
        <p>Temperature: ${temperature}°C</p>
        <p>Condition: ${condition}</p>
    `;
}
