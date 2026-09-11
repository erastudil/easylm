import { applyCors } from '../src/engine/origin';

export default async function handler(req: any, res: any) {
  if (applyCors(req, res)) return;

  const queryLoc = req.query?.q || req.query?.location || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('q') : '');
  const location = (queryLoc || '').trim();

  if (!location) {
    return res.status(400).json({ ok: false, error: 'Query parameter "q" or "location" is required.' });
  }

  try {
    // 1. Geocoding via Open-Meteo
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const geoResp = await fetch(geoUrl);
    if (!geoResp.ok) {
      return res.status(502).json({ ok: false, error: `Geocoding failed with status ${geoResp.status}` });
    }

    const geoData = await geoResp.json();
    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ ok: false, error: `Location "${location}" could not be found.` });
    }

    const place = geoData.results[0];
    const { latitude, longitude, name, admin1, country, timezone } = place;
    const locationName = [name, admin1, country].filter(Boolean).join(', ');

    // 2. Weather & Forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;

    const weatherResp = await fetch(weatherUrl);
    if (!weatherResp.ok) {
      return res.status(502).json({ ok: false, error: `Weather service failed with status ${weatherResp.status}` });
    }

    const weatherData = await weatherResp.json();
    const current = weatherData.current || {};
    const daily = weatherData.daily || {};

    const codeToDesc = (code: number): string => {
      if (code === 0) return 'Clear sky';
      if (code === 1) return 'Mainly clear';
      if (code === 2) return 'Partly cloudy';
      if (code === 3) return 'Overcast';
      if (code === 45 || code === 48) return 'Foggy';
      if (code >= 51 && code <= 55) return 'Drizzle';
      if (code >= 61 && code <= 65) return 'Rain';
      if (code >= 71 && code <= 77) return 'Snow';
      if (code >= 80 && code <= 82) return 'Rain showers';
      if (code >= 85 && code <= 86) return 'Snow showers';
      if (code >= 95) return 'Thunderstorm';
      return 'Scattered clouds';
    };

    const currentDesc = codeToDesc(current.weather_code);
    const tempF = Math.round(current.temperature_2m);
    const tempC = Math.round(((tempF - 32) * 5) / 9);
    const feelsF = Math.round(current.apparent_temperature);
    const humidity = current.relative_humidity_2m;
    const windSpeed = Math.round(current.wind_speed_10m);

    // Build 3-day forecast summary
    const forecastDays: string[] = [];
    const dates = daily.time || [];
    for (let i = 0; i < Math.min(dates.length, 3); i++) {
      const dayDate = dates[i];
      const maxF = Math.round(daily.temperature_2m_max?.[i] ?? 0);
      const minF = Math.round(daily.temperature_2m_min?.[i] ?? 0);
      const rainChance = daily.precipitation_probability_max?.[i] ?? 0;
      const desc = codeToDesc(daily.weather_code?.[i] ?? 0);
      forecastDays.push(`- ${dayDate}: ${desc}, High ${maxF}°F / Low ${minF}°F, Rain chance: ${rainChance}%`);
    }

    const summary = `**Weather for ${locationName}**:\n` +
      `• Current: ${tempF}°F (${tempC}°C), ${currentDesc}\n` +
      `• Feels Like: ${feelsF}°F · Humidity: ${humidity}% · Wind: ${windSpeed} mph\n` +
      `• Sunrise: ${(daily.sunrise?.[0] || '').split('T')[1] || 'N/A'} · Sunset: ${(daily.sunset?.[0] || '').split('T')[1] || 'N/A'}\n\n` +
      `**Forecast**:\n` +
      forecastDays.join('\n');

    return res.status(200).json({
      ok: true,
      location: locationName,
      timezone,
      current: {
        tempF,
        tempC,
        feelsLikeF: feelsF,
        condition: currentDesc,
        humidity,
        windMph: windSpeed
      },
      summary
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message || 'Internal weather service error' });
  }
}
