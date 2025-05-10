import React, { useState, useEffect } from "react";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function WeatherComponent({ lat, lng, apiKey }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!lat || !lng || !apiKey || apiKey === "YOUR_API_KEY") {
        console.warn("Invalid weather parameters:", { lat, lng, apiKey });
        setWeatherError("Invalid coordinates or API key");
        setWeatherLoading(false);
        return;
      }

      // Fetch Current Weather
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
      console.log(
        "Weather API URL (without key):",
        weatherUrl.replace(apiKey, "****")
      );

      try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Weather API error: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
        const weatherData = await response.json();
        setWeather(weatherData);

        // Fetch 5-day/3-hour Forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
        console.log(
          "Forecast API URL (without key):",
          forecastUrl.replace(apiKey, "****")
        );
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
          const errorText = await forecastResponse.text();
          throw new Error(
            `Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText} - ${errorText}`
          );
        }
        const forecastData = await forecastResponse.json();
        setForecast(forecastData);

        setWeatherLoading(false);
      } catch (err) {
        console.error("Weather fetch error:", err.message);
        setWeatherError(`Failed to load weather details: ${err.message}`);
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng, apiKey]);

  // Convert Unix timestamp to local time with timezone offset
  const formatLocalTime = (unixTimestamp, timezoneOffset) => {
    if (!unixTimestamp || !timezoneOffset) return "N/A";
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  // Format timestamp for forecast (e.g., "May 10, 12:00")
  const formatForecastTime = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Convert wind direction (degrees) to cardinal direction
  const getWindDirection = (deg) => {
    if (deg === undefined) return "N/A";
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  // Bar Chart Data
  const barChartData = weather
    ? {
        labels: ["Temperature", "Feels Like", "Humidity", "Pressure"],
        datasets: [
          {
            label: "Weather Metrics",
            data: [
              weather.main.temp,
              weather.main.feels_like,
              weather.main.humidity,
              weather.main.pressure / 10, // Scale pressure for visibility
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 159, 64, 0.6)", // Corrected
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : {};

  // Pie Chart Data
  const pieChartData = weather
    ? {
        labels: ["Clouds", "Clear Sky"],
        datasets: [
          {
            data: [weather.clouds.all, 100 - weather.clouds.all],
            backgroundColor: [
              "rgba(150, 150, 150, 0.6)",
              "rgba(135, 206, 235, 0.6)",
            ],
            borderColor: ["rgba(150, 150, 150, 1)", "rgba(135, 206, 235, 1)"],
            borderWidth: 1,
          },
        ],
      }
    : {};

  // Line Chart Data (Forecast)
  const lineChartData = forecast
    ? {
        labels: forecast.list
          .slice(0, 8)
          .map((item) => formatForecastTime(item.dt_txt)), // First 24 hours (8 points)
        datasets: [
          {
            label: "Temperature (°C)",
            data: forecast.list.slice(0, 8).map((item) => item.main.temp),
            fill: false,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            tension: 0.4,
          },
        ],
      }
    : {};

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Weather</h2>
      {weatherLoading && (
        <div
          className="bg-white p-4 rounded-2xl animate-pulse"
          aria-live="polite"
        >
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      )}
      {weatherError && (
        <div
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle size={20} className="text-red-500" />
          <p className="text-red-700 text-sm">{weatherError}</p>
        </div>
      )}
      {weather && !weatherLoading && !weatherError && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
          {/* Basic Weather Info */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="w-12 h-12"
            />
            <div>
              <p className="text-lg font-semibold text-gray-800 capitalize">
                {weather.weather[0].description} (ID: {weather.weather[0].id})
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(weather.main.temp)}°C
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Feels Like
              </span>
              <span className="text-base text-gray-800">
                {Math.round(weather.main.feels_like)}°C
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Humidity
              </span>
              <span className="text-base text-gray-800">
                {weather.main.humidity}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Pressure
              </span>
              <span className="text-base text-gray-800">
                {weather.main.pressure} hPa
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Wind Speed
              </span>
              <span className="text-base text-gray-800">
                {weather.wind.speed} m/s
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Visibility
              </span>
              <span className="text-base text-gray-800">
                {weather.visibility / 1000} km
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Cloud Coverage
              </span>
              <span className="text-base text-gray-800">
                {weather.clouds.all}%
              </span>
            </div>
          </div>

          {/* Toggle Advanced Details */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold mb-4"
            aria-expanded={showAdvanced}
            aria-controls="advanced-weather-details"
          >
            {showAdvanced ? (
              <>
                Hide Advanced Details <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show Advanced Details <ChevronDown size={16} />
              </>
            )}
          </button>

          {/* Advanced Weather Details */}
          {showAdvanced && (
            <div
              id="advanced-weather-details"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Coordinates
                </span>
                <span className="text-base text-gray-800">
                  Lat: {weather.coord.lat}, Lon: {weather.coord.lon}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Temp Range
                </span>
                <span className="text-base text-gray-800">
                  Min: {Math.round(weather.main.temp_min)}°C, Max:{" "}
                  {Math.round(weather.main.temp_max)}°C
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Sea Level Pressure
                </span>
                <span className="text-base text-gray-800">
                  {weather.main.sea_level || "N/A"} hPa
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Ground Level Pressure
                </span>
                <span className="text-base text-gray-800">
                  {weather.main.grnd_level || "N/A"} hPa
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Wind Direction
                </span>
                <span className="text-base text-gray-800">
                  {getWindDirection(weather.wind.deg)} ({weather.wind.deg}°)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Wind Gust
                </span>
                <span className="text-base text-gray-800">
                  {weather.wind.gust ? `${weather.wind.gust} m/s` : "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Precipitation (1h)
                </span>
                <span className="text-base text-gray-800">
                  Rain: {weather.rain?.["1h"] || 0} mm, Snow:{" "}
                  {weather.snow?.["1h"] || 0} mm
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Sunrise
                </span>
                <span className="text-base text-gray-800">
                  {formatLocalTime(weather.sys.sunrise, weather.timezone)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Sunset
                </span>
                <span className="text-base text-gray-800">
                  {formatLocalTime(weather.sys.sunset, weather.timezone)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Last Update
                </span>
                <span className="text-base text-gray-800">
                  {formatLocalTime(weather.dt, weather.timezone)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Timezone Offset
                </span>
                <span className="text-base text-gray-800">
                  {weather.timezone / 3600} hours
                </span>
              </div>
            </div>
          )}

          {/* Toggle Graphs */}
          <button
            onClick={() => setShowGraphs(!showGraphs)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold mb-4"
            aria-expanded={showGraphs}
            aria-controls="weather-graphs"
          >
            {showGraphs ? (
              <>
                Hide Graphs <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show Graphs <ChevronDown size={16} />
              </>
            )}
          </button>

          {/* Weather Graphs */}
          {showGraphs && (
            <div id="weather-graphs" className="space-y-6">
              {/* Bar Chart */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Weather Metrics
                </h3>
                <div className="h-64">
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) =>
                              `${context.label}: ${
                                context.parsed.y.toFixed(1) +
                                (context.label === "Pressure"
                                  ? " hPa"
                                  : context.label === "Humidity"
                                  ? "%"
                                  : "°C")
                              }`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: "Value" },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Cloud Coverage
                </h3>
                <div className="h-64">
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top" },
                        tooltip: {
                          callbacks: {
                            label: (context) =>
                              `${context.label}: ${context.parsed}%`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Line Chart */}
              {forecast && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Temperature Forecast (Next 24h)
                  </h3>
                  <div className="h-64">
                    <Line
                      data={lineChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: "top" },
                          tooltip: {
                            callbacks: {
                              label: (context) =>
                                `Temperature: ${context.parsed.y.toFixed(1)}°C`,
                            },
                          },
                        },
                        scales: {
                          x: { title: { display: true, text: "Time" } },
                          y: {
                            title: { display: true, text: "Temperature (°C)" },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WeatherComponent;
