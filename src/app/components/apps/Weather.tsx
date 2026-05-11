'use client';

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

interface WeatherData {
  name: string;
  main: { temp: number; humidity: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number };
}

interface ForecastItem {
  dt: number;
  main: { temp: number };
  weather: Array<{ main: string; description: string; icon: string }>;
}

const API_KEY = '9df93e2e16bb4e07b2f9ff45de8ec8c3';
const STORAGE_KEY = 'weather-last-city';

function Weather() {
  const [searchInput, setSearchInput] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      const data = await response.json();
      setWeatherData(data);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );
      const forecastData = await forecastResponse.json();

      const dailyForecast = forecastData.list.filter(
        (_item: ForecastItem, index: number) => index % 8 === 0
      );
      setForecast(dailyForecast);
    } catch {
      setError("Sorry, we couldn't retrieve the weather data at this time");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`
      );
      const data = await response.json();
      setWeatherData(data);
      if (data.name) {
        localStorage.setItem(STORAGE_KEY, data.name);
      }

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=imperial`
      );
      const forecastData = await forecastResponse.json();

      const dailyForecast = forecastData.list.filter(
        (_item: ForecastItem, index: number) => index % 8 === 0
      );
      setForecast(dailyForecast);
    } catch {
      setError("Sorry, we couldn't retrieve the weather data at this time");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedCity = localStorage.getItem(STORAGE_KEY);
    if (savedCity) {
      fetchWeatherByCity(savedCity);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeatherByCity("london");
        }
      );
    } else {
      fetchWeatherByCity("london");
    }
  }, [fetchWeatherByCoords, fetchWeatherByCity]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetchWeatherByCity(searchInput);
  }

  if (loading) return <div className="wrapper">Loading...</div>;

  return (
    <div className="wrapper">
      <form onSubmit={handleSearch} className="search">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter city name"
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
      {error && <p className="error">{error}</p>}

      {weatherData && weatherData.main && weatherData.weather && (
        <>
          <div className="header">
            <h1 className="city">{weatherData.name}</h1>
            <p className="temperature">{weatherData.main.temp}°F</p>
            <p className="condition">{weatherData.weather[0].main}</p>
          </div>
          <div className="weather-details">
            <div >
              <p >Humidity</p>
              <p style={{ fontWeight: "bold" }}>{Math.round(weatherData.main.humidity)}%</p>
            </div>
            <div>
              <p>Wind Speed</p>
              <p style={{ fontWeight: "bold" }}>{Math.round(weatherData.wind.speed)} mph</p>
            </div>
          </div>
        </>
      )}

      {forecast.length > 0 && (
        <>
          <div className="forecast">
            <h2 className="forecast-header">5-Day Forecast</h2>
            <div className="forecast-days">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <Image
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    width={50}
                    height={50}
                    unoptimized
                  />
                  <p>{Math.round(day.main.temp)}°F</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Weather; 