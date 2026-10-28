// js/theme.js
/**
 * Moduł motywu (Dark / Light Mode).
 * 
 * Odpowiedzialność:
 * - Reakcja na kliknięcie kontrolki motywu w interfejsie
 * - Przełączanie klasy motywu (np. 'dark') na elemencie <body>
 * - Trwały zapis i odczyt preferencji użytkownika w localStorage
 */

export function initTheme() {
  const themeToggle = document.querySelector("#theme-toggle"); // szuka w CSS id theme-toggle
  const savedThemeKey = "portfolio-theme"; // nazwa klucza w localStorage
  const savedTheme = localStorage.getItem(savedThemeKey); // pobranie zapisanego motywu

  if (!themeToggle) {
    throw new Error("Nie znaleziono kontrolki przełączania motywu.");
  }

  // Używamy tylko znanych wartości, aby nie dopuścić do nieprawidłowego stanu.
  const initialTheme = savedTheme === "dark" ? "dark" : "light"; // Ustalamy motyw początkowy
  applyTheme(initialTheme);

  // Kliknięcie przełącza motyw, aktualizuje stan ARIA i zapisuje wybór użytkownika.
  themeToggle.addEventListener("click", () => { // funkcja strzałkowa - wykonywana po kliknięciu
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark"; // czy body w html zawiera klasę dark, jeśli tak to ustaw do zmiennej jasny

    applyTheme(nextTheme);
    localStorage.setItem(savedThemeKey, nextTheme); // zapisanie pary klucz - wartość
  });

  function applyTheme(theme) {
    const isDark = theme === "dark"; // czy motyw jest czarny

    document.body.classList.toggle("dark", isDark); // metoda toggle może dodać lub usunąć klasę, jeśli isDark jest true to doda klasę dark, jak nie to usunie klasę w body
    themeToggle.setAttribute("aria-checked", String(isDark)); // ustawia atrybut dla czytników odnośnie wybranego motywu, plus odpowiada za aktywacje animacji przełącznika
  }
}
