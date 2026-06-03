// src/services/weatherService.ts
// src/services/weatherService.ts
interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    rain: number;
    weather_code: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  condition: string;
  dailyForecast?: {
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitation: number;
    condition: string;
  }[];
}

export class WeatherService {
  // Weather codes mapping based on WMO standard
  private static getWeatherCondition(code: number): string {
    const weatherCodes: Record<number, string> = {
      0: "Clear Sky",
      1: "Mainly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing Rime Fog",
      51: "Light Drizzle",
      53: "Moderate Drizzle",
      55: "Dense Drizzle",
      56: "Light Freezing Drizzle",
      57: "Dense Freezing Drizzle",
      61: "Slight Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      66: "Light Freezing Rain",
      67: "Heavy Freezing Rain",
      71: "Slight Snowfall",
      73: "Moderate Snowfall",
      75: "Heavy Snowfall",
      77: "Snow Grains",
      80: "Slight Rain Showers",
      81: "Moderate Rain Showers",
      82: "Violent Rain Showers",
      85: "Slight Snow Showers",
      86: "Heavy Snow Showers",
      95: "Thunderstorm",
      96: "Thunderstorm with Slight Hail",
      99: "Thunderstorm with Heavy Hail",
    };

    return weatherCodes[code] || "Unknown";
  }

  static async getWeatherData(
    latitude: number,
    longitude: number,
    includeDaily: boolean = true
  ): Promise<WeatherData> {
    try {
      // Open-Meteo API doesn't require an API key
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,rain,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`;

      console.log('🌤️ Fetching weather from Open-Meteo...');
      console.log('📍 Coordinates:', latitude, longitude);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: OpenMeteoResponse = await response.json();
      console.log('✅ Weather data received successfully');

      // Process current weather
      const weatherData: WeatherData = {
        temperature: Math.round(data.current.temperature_2m),
        humidity: Math.round(data.current.relative_humidity_2m),
        windSpeed: Math.round(data.current.wind_speed_10m),
        rainfall: Math.round(data.current.rain * 10) / 10,
        condition: this.getWeatherCondition(data.current.weather_code),
      };

      // Process daily forecast if requested and available
      if (includeDaily && data.daily && data.daily.time) {
        weatherData.dailyForecast = data.daily.time.map((date: string, index: number) => ({
          date: new Date(date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          maxTemp: Math.round(data.daily!.temperature_2m_max[index]),
          minTemp: Math.round(data.daily!.temperature_2m_min[index]),
          precipitation: Math.round(data.daily!.precipitation_sum[index] * 10) / 10,
          condition: this.getWeatherCondition(data.daily!.weather_code[index]),
        }));
      }

      return weatherData;
    } catch (error) {
      console.error('❌ Error fetching weather from Open-Meteo:', error);
      // Return default weather data in case of error
      return {
        temperature: 25,
        humidity: 65,
        windSpeed: 12,
        rainfall: 0,
        condition: "Partly Cloudy",
      };
    }
  }

  // Get weather based on farm location
  static async getFarmWeather(latitude?: number, longitude?: number): Promise<WeatherData> {
    // Default coordinates (Tanzania)
    const lat = latitude || -6.369028;
    const lon = longitude || 34.888822;
    
    return this.getWeatherData(lat, lon);
  }
}