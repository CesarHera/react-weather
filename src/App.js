import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [location, setLocation] = useState('guadalajara, mx');
  const [cityName, setCityName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [temp, setTemp] = useState('');
  const [feelsLike, setFeelsLike] = useState('');
  const [weatherDescription, setWeatherDescription] = useState('');
  const [dateObject, setDateObject] = useState(new Date());
  const [background, setBackground] = useState(false);

  const dateBuilder = (dateObject) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];

    const day = days[dateObject.getDay()];
    const date = dateObject.getDate();
    const month = months[dateObject.getMonth()];
    const year = dateObject.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  useEffect(() => {
    getWeather();
  }, []);
 
  const handleChange = (e) => {
    setLocation(e.target.value);
  }
  
  const handleOnSubmit = () => {
    setBackground(!background);
    getWeather();
    setDateObject(new Date());
  }

  const getWeather = async () => {
    const geoLocationJSON = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=6d4a65953ba8cec445880da21d6fac71`)
    .then((res) => res.json());
    const [{ lon, lat }]= geoLocationJSON;

    const weatherJSON = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6d4a65953ba8cec445880da21d6fac71`)
      .then((res) => res.json());

    console.log(weatherJSON)
    setCityName(weatherJSON.name);
    setCountryCode(weatherJSON.sys.country);
    setWeatherDescription(weatherJSON.weather[0].description);
    setTemp(weatherJSON.main.temp)
    setFeelsLike(weatherJSON.main.feels_like)
  }

  const tempBG = () => {
    const backgrounds = ['cold', 'warm'];
    let idx = background ? 1 : 0;

    return backgrounds[idx]
  }
  
  return (
    <main className='weather' id={tempBG()}>
      <div className='weather-content-wrapper'>
        <form onSubmit={(e) => {handleOnSubmit(); e.preventDefault();}}>
          <input className='weather__search' type='text' placeholder='CityName, CountryCode' value={location} onChange={(e) => handleChange(e)}/>
        </form>

        <div>
          <h1 className='weather__location'>{cityName === '' ? '-------- --' : `${cityName} ${countryCode}`}</h1>
          <h3 className='weather__date'>{dateBuilder(dateObject)}</h3>
        </div>

        <div className='weather__temperature'>
          <h2 className='weather__temperature__degrees'>
            {temp === '' ? '--°C' : `${Math.round(temp)}°C`}
          </h2>
          <h3 className='weather__temperature__feels-like'>{feelsLike === '' ? 'Feels like --°C' : `Feels like ${Math.round(feelsLike)}°C`}</h3>
        </div>

        <div>
          <h2 className='weather__description'>
            {weatherDescription === '' ? '--- ----' : weatherDescription}
          </h2>
        </div>
        <div className='links'>
          <a className='links__github' href='https://github.com/CesarHera'>
            <img alt='Github logo png' src='https://cdn-icons-png.flaticon.com/512/25/25231.png'/>
          </a>
          <a className='links__web-portfolio' href='https://cesarhera.github.io/web-portfolio/'>Web Portfolio</a>
        </div>
      </div>
    </main>
  );
}

export default App;
