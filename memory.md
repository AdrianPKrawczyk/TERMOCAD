# Pamięć Projektu: Kalkulator ArCADia-TERMO

## 🎯 Cel Projektu
Stworzenie lokalnej aplikacji webowej (SPA) służącej jako generator cenników XML dla audytorów energetycznych. Aplikacja zastępuje arkusze Excel, pozwalając na szybkie przeliczanie kosztów technologii dociepleniowych w zależności od grubości materiału i eksport wynikowych danych do formatu XML (dla ArCADia-TERMO).

## 💻 Stos Technologiczny
- React 18 (przez Vite)
- TypeScript (ścisłe typowanie)
- Tailwind CSS 4 (stylowanie UI)
- Zustand (zarządzanie stanem globalnym)
- Lucide React (ikony)
- Wbudowany DOMParser / XMLSerializer (do generowania XML)

## ✅ Ostatnio wykonane zadania
- [x] Utworzenie repozytorium/katalogu projektu.
- [x] Instalacja bazowych zależności.
- [x] **Krok 1-3**: UI Layout, Zustand Store, Globalne Ustawienia (materiały).
- [x] **Krok 4 (v0.4.6): Optymalizacja UI i Reordering**:
    - [x] Implementacja zmiany kolejności (Góra/Dół) dla kategorii i technologii.
    - [x] Rozszerzenie obszaru roboczego (max-w) i przebudowa kalkulatora przegród na układ pionowy.
    - [x] Dodanie pola "Koszty stałe / Montaż" dla okien i PV.
    - [x] Wdrożenie funkcji "Nowy materiał w bazie" bezpośrednio w widoku technologii.
- [x] **Krok 5: Eksport XML/XLibrary**:
    - [x] Generator zgodny z serializacją obiektów ArCADia.
    - [x] Pakowanie ZIP (xlibrary) przez jszip.
- [x] **Krok 6: Zapis i Odczyt projektów (JSON)**:
    - [x] Eksport/Import pełnego projektu.
    - [x] Eksport/Import złączeniowy samej bazy materiałowej.

## 📝 Zadania do zrobienia (Backlog)
- [ ] Opcjonalne optymalizacje, testy brzegowe i poprawki UX w miarę testowania przez audytorów.

- [x] **Zadania Wykonane (v0.5.2)**:
    - [x] Powiększenie szerokości Sidebaru do 500px (lepsza czytelność długich nazw).
    - [x] Usunięcie ucinania tekstu (truncate) w nazwach kategorii i technologii.
    - [x] Zmniejszenie marginesów zewnętrznych (padding p-2) i poszerzenie max-width do 1600px.

- [x] **Zadania Wykonane (v0.5.3)**:
    - [x] Modyfikacja `TechnologyView.tsx`:
    - [x] Dodanie importów `useRef`, `useEffect`, `useState`.
    - [x] Implementacja stanu `showNotes` (domyślnie `true`).
    - [x] Implementacja `useEffect` dla auto-rozszerzania textarea.
    - [x] Dodanie przycisku przełączania (ChevronUp/Down) do nagłówka.
    - [x] Dodanie warunkowego renderowania / animacji zwijania pola.
    - [x] Weryfikacja wizualna.
    - [x] Aktualizacja walkthrough.md.

- [x] **Zadania Wykonane (v0.5.4)**:
    - [x] Pełna obsługa składni Markdown w sekcji notatek (`react-markdown`).
    - [x] Dodanie przełącznika "Edytuj / Podgląd" dla notatek.
    - [x] Automatyczne formatowanie (nagłówki, listy, bold, linki) w trybie podglądu.

## ⚠️ Ważne notatki / Zasady
- Aktualna wersja programu: **0.5.4**
- Separator dziesiętny w XML: **kropka** (np. `UnitCost="124.50"`).
- Wzory cenowe:
    - **Przegrody**: `total = (thickness/100 * baseMatPrice * baseUsage) + sum(otherMatPrice * otherUsage) + fixed + labor`.
    - **Okna**: `price = base + ((U_start - U_current) / step) * extra + fixedCost`.
    - **PV**: `price = base + ((Eff_current - Eff_start) / step) * extra + fixedCost`.
- Struktura XML musi być płaska w `JobBrand`, ale ścieżka `Path` decyduje o strukturze folderów w ArCADia.