# Pamięć Projektu: Kalkulator ArCADia-TERMO

## 🎯 Cel Projektu
Stworzenie lokalnej aplikacji webowej (SPA) służącej jako generator cenników XML dla audytorów energetycznych. Aplikacja zastępuje arkusze Excel, pozwalając na szybkie przeliczanie kosztów technologii dociepleniowych w zależności od grubości materiału i eksport wynikowych danych do formatu XML (dla ArCADia-TERMO).

## 💻 Stos Technologiczny
- React 18 (przez Vite)
- TypeScript (ścisłe typowanie to priorytet)
- Tailwind CSS 4 (stylowanie UI)
- Zustand (zarządzanie stanem globalnym i drzewem kategorii)
- Lucide React (ikony)
- Wbudowany DOMParser / XMLSerializer (do generowania plików wyjściowych)

## ✅ Ostatnio wykonane zadania
- [x] Utworzenie repozytorium/katalogu projektu.
- [x] Instalacja bazowych zależności (Vite, React, Tailwind CSS 4, Zustand, Lucide React).
- [x] Utworzenie pliku `memory.md`.
- [x] Opracowanie Architektury Danych i wymagań dla XML.
- [x] **Krok 1: Szkielet UI (Layout)** - Zbudowanie bazowego układu z użyciem Tailwind CSS (Lewy Sidebar, TopBar, Main Content).

## 📝 Zadania do zrobienia (Backlog)
- [ ] **Krok 2: Stan Globalny (Zustand)** - Utworzenie pliku `store.ts` z interfejsami: `GlobalSettings`, `Category`, `Technology`, `Variant`.
- [ ] **Krok 3: Ustawienia Globalne** - Zbudowanie Modala pozwalającego na edycję bazowych cen (np. koszt roboczogodziny, bazowa cena m3 styropianu).
- [ ] **Krok 4: Kalkulator Wariantów (Tryb AUTO i MANUAL)** - Zbudowanie widoku, który dla wybranej technologii wyświetla formularz "od 5cm do 30cm" i na żywo generuje tabelę wyników (`totalCost`).
- [ ] **Krok 5: Eksport XML** - Napisanie skryptu iterującego po stanie Zustand, budującego string XML wg precyzyjnej struktury (element `$Dummy`, odpowiednie tagi `Path`, `UnitCost`) i pozwalającego pobrać plik na dysk.

## ⚠️ Ważne notatki / Zasady
- Aktualna wersja programu: **0.1.0**
- Cena w XML (tag `<f n="UnitCost">`) musi używać **kropki** jako separatora dziesiętnego.
- Każdy dodawany element `JobBrand` musi mieć po kolei rosnący indeks `n` (od zera).
- Ścieżka (tag `<s n="Path">`) buduje foldery w ArCADii, np. `Ściany zewnętrzne/Styropian EPS 80`.