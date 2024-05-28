function getIP(callback) {

    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            callback(ip);
        })
        .catch(error => {
            console.log('Error:', error);
        })

}

function getWeather(latitude, longitude) {
    const apiKey = '68ca6fc28f4145e1bf294422242705';
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5&aqi=no&alerts=no`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    getIP(function (ip) {
        const apiKey = "a25ad4b491824dd28d0ecf74b70838fa";
        const url = `https://api.ipgeolocation.io/ipgeo?ip=${ip}&apiKey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const latitude = parseFloat(data.latitude);
                const longitude = parseFloat(data.longitude);
                getWeather(latitude, longitude);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});

function showHourlyDetails() {
    document.getElementById('showHourlyDetailsSection').className = 'd-block'
    document.getElementById('hideHourlyDetailsBtn').className += 'btn btn-warning mt-3 mb-5 d-block'
}

function hideHourlyDetails() {
    document.getElementById('showHourlyDetailsSection').className = 'd-none'
    document.getElementById('hideHourlyDetailsBtn').className += 'btn btn-warning mt-3 mb-5 d-none'
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-container');
    const location = data.location.name;
    const country = data.location.country;
    const temperature = data.current.temp_c;
    const condition = data.current.condition.text;
    const icon = data.current.condition.icon;
    const wind = data.current.wind_kph;

    // Forecast data
    const forecast = data.forecast.forecastday;
    let forecastHTML = '';
    forecast.forEach(day => {
        const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const dayIcon = day.day.condition.icon;
        const maxTemp = day.day.maxtemp_c;
        const minTemp = day.day.mintemp_c;
        forecastHTML += `
                <div class="col-md-2 forecast">
                    <div class="day">${date}</div>
                    <img src="${dayIcon}" alt="weather icon">
                    <div>${maxTemp}°C</div>
                    <div class="small-text">${minTemp}°C</div>
                </div>
            `;
    });

    weatherContainer.innerHTML = `
            <h1>${location}, ${country}</h1>
            <div class="temperature">${temperature}°C</div>
            <div>${condition}</div>
            <div>Wind: ${wind} km/h</div>
            <hr>
            <div class="row justify-content-center">
                ${forecastHTML}
            </div>
            <hr>
            <div class="row justify-content-between mx-3 px-5">
                <button id="showHourlyDetailsBtn" class="btn btn-light mt-3 mb-5 " onclick="showHourlyDetails()">Show Hourly Details</button>
                <button id="hideHourlyDetailsBtn" class="btn btn-warning mt-3 mb-5 d-none" onclick="hideHourlyDetails()">X</button>
            </div>
            <div id="showHourlyDetailsSection" class="d-none">
                <div class="row justify-content-center">
                    <ul class="nav nav-tabs" id="hourlyTabs" role="tablist">
                        ${forecast.slice(0, 3).map((day, index) => `
                            <li class="nav-item">
                                <a class="nav-link text-white ${index === 0 ? 'active' : ''}" id="tab-${index}" data-toggle="tab" href="#day-${index}" role="tab" aria-controls="day-${index}" aria-selected="${index === 0}">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="tab-content" id="hourlyTabContent">
                    ${forecast.slice(0, 3).map((day, index) => `
                        <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="day-${index}" role="tabpanel" aria-labelledby="tab-${index}">
                            <div class="row text-center hourly-forecast">
                                ${day.hour.map(hour => {
        const time = new Date(hour.time).getHours();
        const hourIcon = hour.condition.icon;
        const temp = hour.temp_c;
        const wind = hour.wind_kph;
        const precip = hour.chance_of_rain;
        return `
                        <div class="col">
                            <div class="small-text">${time}:00</div>
                            <img src="${hourIcon}" alt="weather icon">
                            <div>${temp}°C</div>
                            <div>${wind} km/h</div>
                            <div>${precip}%</div>
                        </div>
                    `;
    }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
}


