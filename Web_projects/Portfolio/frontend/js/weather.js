// js/weather.js
/**
 * Moduł danych meteorologicznych (IMGW REST API).
 * 
 * Endpoint API: https://danepubliczne.imgw.pl/api/data/synop/station/{stacja}
 * Domyślna stacja: 'krakow' (lub np. 'warszawa', 'wroclaw', 'gdansk')
 * 
 * Kluczowe pola w zwracanym obiekcie JSON:
 * - data.stacja              (np. "Kraków")
 * - data.temperatura         (np. "12.4")
 * - data.cisnienie           (np. "1024.2")
 * - data.predkosc_wiatru     (np. "3")
 * - data.wilgotnosc_wzgledna (np. "78.5")
 * 
 * Odpowiedzialność:
 * - Asynchroniczne pobranie danych dla wybranej stacji (fetch, async/await, weryfikacja response.ok)
 * - Obsługa stanu ładowania (loading state) oraz prezentacja błędów sieciowych w UI (bez blokującego alert())
 * - Bezpieczne wyrenderowanie danych pogodowych w dedykowanym kafelku DOM (Zero-XSS)
 */

export async function initWeather(city = "krakow") {
  const weatherBox = document.querySelector("#weather-box");

  if (!weatherBox) {
    throw new Error("Nie znaleziono kontenera pogody.");
  }

  // Informujemy użytkownika, że dane są właśnie pobierane z zewnętrznego API.
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Ładowanie danych pogodowych...";
  weatherBox.append(loadingMessage);

  try {
    // Pobieramy dane synoptyczne dla stacji Kraków.
    const response = await fetch(
      `https://danepubliczne.imgw.pl/api/data/synop/station/${encodeURIComponent(city)}`
    );

    // Odpowiedź HTTP spoza zakresu 200-299 traktujemy jako błąd.
    if (!response.ok) {
      throw new Error(`Serwer IMGW zwrócił status ${response.status}.`);
    }

    const weatherData = await response.json(); // oczekiwanie na odp i przeksztalcanie jej na JSON
    loadingMessage.remove(); // usuniecie tekstu o czekaniu na odpowiedz
    renderWeather(weatherBox, weatherData);
  } catch (error) {
    loadingMessage.remove();

    // Błąd jest prezentowany w interfejsie zamiast przez blokujące okno alert().
    const errorMessage = document.createElement("p");
    errorMessage.textContent =
      "Nie udało się pobrać danych pogodowych. Spróbuj ponownie później.";
    errorMessage.className = "weather-error";
    weatherBox.append(errorMessage);

    console.error("Błąd pobierania danych pogodowych:", error);
  }
}

/**
 * Renderuje dane otrzymane z API bez użycia innerHTML.
 * Dzięki textContent wartości z odpowiedzi nie są interpretowane jako HTML.
 */
function renderWeather(weatherBox, weatherData) {
  const data = [
    ["Stacja", weatherData.stacja],
    ["Temperatura", `${weatherData.temperatura} °C`],
    ["Ciśnienie", `${weatherData.cisnienie} hPa`],
    ["Wiatr", `${weatherData.predkosc_wiatru} m/s`],
  ];

  const weatherDetails = document.createElement("div");
  weatherDetails.className = "weather-details";

  data.forEach(([label, value]) => {
    const detail = document.createElement("p");
    const labelElement = document.createElement("strong");

    labelElement.textContent = `${label}: `;
    detail.append(labelElement, document.createTextNode(value)); // tworzymy kanapkę do <p> dodajemy <strong> z label i dodajemy pole tekstowe
    weatherDetails.append(detail);
  });

  weatherBox.append(weatherDetails);
}
