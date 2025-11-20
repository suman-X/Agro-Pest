import axios from 'axios';
import { env } from '../config/env';

interface WeatherData {
    main: {
        temp: number;
        humidity: number;
    };
    weather: Array<{
        main: string;
        description: string;
    }>;
    rain?: {
        '1h'?: number;
        '3h'?: number;
    };
}

export const getWeatherRisk = async (location: string) => {
    try {
        // If no API key, return placeholder data
        if (!env.OPENWEATHER_API_KEY) {
            console.warn('OpenWeather API key not configured, returning placeholder data');
            return {
                risk_level: 'Unknown',
                alert: 'Weather API not configured',
                forecast: {
                    temp: 25,
                    humidity: 60,
                    rainfall: 'Unknown'
                }
            };
        }

        // Call OpenWeather Geocoding API to get coordinates
        const geoResponse = await axios.get(
            `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${env.OPENWEATHER_API_KEY}`
        );

        if (!geoResponse.data || geoResponse.data.length === 0) {
            throw new Error('Location not found');
        }

        const { lat, lon } = geoResponse.data[0];

        // Call OpenWeather Current Weather API
        const weatherResponse = await axios.get<WeatherData>(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${env.OPENWEATHER_API_KEY}&units=metric`
        );

        const weatherData = weatherResponse.data;
        const temp = Math.round(weatherData.main.temp);
        const humidity = weatherData.main.humidity;
        const rainfall = weatherData.rain?.['1h'] || weatherData.rain?.['3h'] || 0;
        const weatherCondition = weatherData.weather[0].main;

        // Determine risk level based on weather conditions
        let riskLevel = 'Low';
        let alert = 'No immediate weather risks detected.';

        // High humidity increases pest risk
        if (humidity > 80) {
            riskLevel = 'High';
            alert = 'High humidity detected. Increased risk of fungal diseases and pest activity.';
        } else if (humidity > 70) {
            riskLevel = 'Medium';
            alert = 'Moderate humidity. Monitor for potential pest activity.';
        }

        // Rain increases disease risk
        if (rainfall > 5) {
            riskLevel = 'High';
            alert = 'Heavy rainfall detected. High risk of fungal diseases and pest spread.';
        } else if (rainfall > 0) {
            if (riskLevel === 'Low') {
                riskLevel = 'Medium';
                alert = 'Light rainfall. Moderate risk of disease development.';
            }
        }

        // Extreme temperatures
        if (temp > 35) {
            if (riskLevel === 'Low') {
                riskLevel = 'Medium';
                alert = 'High temperature. Some pests thrive in hot conditions.';
            }
        } else if (temp < 10) {
            riskLevel = 'Low';
            alert = 'Cool temperature. Reduced pest activity expected.';
        }

        return {
            risk_level: riskLevel,
            alert: alert,
            forecast: {
                temp: temp,
                humidity: humidity,
                rainfall: rainfall > 0 ? `${rainfall}mm` : 'None',
                condition: weatherCondition
            }
        };

    } catch (error) {
        console.error('Weather API Error:', error);
        // Return safe fallback data instead of throwing
        return {
            risk_level: 'Unknown',
            alert: 'Unable to fetch weather data. Please check location name.',
            forecast: {
                temp: 25,
                humidity: 60,
                rainfall: 'Unknown'
            }
        };
    }
};
