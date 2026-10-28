// js/calendar.js
/**
 * Moduł kartki z kalendarza.
 * 
 * Odpowiedzialność:
 * - Pobranie bieżącej daty systemowej (new Date())
 * - Sformatowanie dnia tygodnia, dnia i miesiąca w języku polskim
 *   (Wskazówka: new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }))
 * - Bezpieczne wstrzyknięcie sformatowanej treści do dedykowanego slotu DOM (Zero-XSS)
 */

export function initCalendar() { // definije i eksportuje funckcje z modułu
  const calendarBox = document.querySelector("#calendar-box");
  // odwołanie do id=calendar-box w CSS (u mnie jest w dziedziczeniu do div w widgets), dokument reprezentuje aktualnie otwarty plik w przeglądarce
  // querySelector wyszukuje pierwszy element pasujący w CSS
  if (!calendarBox) {
    throw new Error("Nie znaleziono kontenera kalendarza.");
  }

  // Pobieramy datę systemową użytkownika, aby zawsze wyświetlać bieżący dzień.
  const currentDate = new Date();

  // Intl.DateTimeFormat korzysta z polskich nazw dnia tygodnia i miesiąca.
  const formatter = new Intl.DateTimeFormat("pl-PL", { // służy do formatowania daty zgodnie z językiem - Lokalizacją
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Formatter zwraca polską datę od małej litery, dlatego
  // zamieniamy pierwszą literę na wielką przed wyświetleniem
  const formattedDate = formatter.format(currentDate); // format - nazwa metody w obiekcie formatter, currentDate to argument
  const readableDate = formattedDate.charAt(0).toLocaleUpperCase("pl-PL")
    + formattedDate.slice(1);

  // textContent bezpiecznie wstawia tekst i nie interpretuje go jako HTML.
  const dateElement = document.createElement("p"); // tworzy nowy element <p> w html w pamięci
  dateElement.className = "calendar-date"; // nadanie klasy
  dateElement.textContent = readableDate; // ustawiwa zawartość <p>
  calendarBox.append(dateElement); // dodaje do kontenera calendarBox
}
