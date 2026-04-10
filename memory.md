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
    - [x] Refaktoryzacja Sidebaru (naprawa zagnieżdżonych przycisków i dostępności ikon).

## 📝 Zadania do zrobienia (Backlog)
- [ ] **Krok 5: Eksport XML** - Implementacja generatora XML. Musi uwzględniać ścieżki (Path) budowane z nowych kategorii i technologii.
- [ ] **Krok 6: Persistence & JSON Export** - Eksport/import całego projektu do pliku .json.

## ⚠️ Ważne notatki / Zasady
- Aktualna wersja programu: **0.4.6**
- Separator dziesiętny w XML: **kropka** (np. `UnitCost="124.50"`).
- Wzory cenowe:
    - **Przegrody**: `total = (thickness/100 * baseMatPrice * baseUsage) + sum(otherMatPrice * otherUsage) + fixed + labor`.
    - **Okna**: `price = base + ((U_start - U_current) / step) * extra + fixedCost`.
    - **PV**: `price = base + ((Eff_current - Eff_start) / step) * extra + fixedCost`.
- Struktura XML musi być płaska w `JobBrand`, ale ścieżka `Path` decyduje o strukturze folderów w ArCADia.