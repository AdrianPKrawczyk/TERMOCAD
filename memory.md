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
- [x] **Krok 4 (v0.4.0): Wielomateriałowość i Nowe Typy Kalkulatorów**:
    - [x] Przebudowa store'a o obsługę typów: Przegrody, Okna/Drzwi, PV.
    - [x] Implementacja wielomateriałowej tabeli dla przegród (materiał BAZOWY vs stałe zużycie).
    - [x] Dodanie kalkulatora okien (współczynnik U) i PV (sprawność) z automatycznymi wzorami dopłat.
    - [x] Implementacja zmiany nazw kategorii i technologii bezpośrednio w Sidebarze.
    - [x] Dodanie pola "Uwagi" do każdej technologii.
    - [x] Reset stanu aplikacji (klucz v4) w celu zachowania spójności z nowym modelem danych.

## 📝 Zadania do zrobienia (Backlog)
- [ ] **Krok 5: Eksport XML** - Implementacja generatora XML. Musi uwzględniać ścieżki (Path) budowane z nowych kategorii i technologii.
- [ ] **Krok 6: Persistence & JSON Export** - Eksport/import całego projektu do pliku .json.

## ⚠️ Ważne notatki / Zasady
- Aktualna wersja programu: **0.4.0**
- Separator dziesiętny w XML: **kropka** (np. `UnitCost="124.50"`).
- Wzory cenowe:
    - **Przegrody**: `total = (thickness/100 * baseMatPrice * baseUsage) + sum(otherMatPrice * otherUsage) + fixed + labor`.
    - **Okna**: `price = base + ((U_start - U_current) / step) * extra`.
    - **PV**: `price = base + ((Eff_current - Eff_start) / step) * extra`.
- Struktura XML musi być płaska w `JobBrand`, ale ścieżka `Path` decyduje o strukturze folderów w ArCADia.