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
- [x] **Krok 1: Szkielet UI (Layout)** - Zbudowanie bazowego układu z użyciem Tailwind CSS.
- [x] **Krok 2: Stan Globalny (Zustand)** - Implementacja store `useAppStore.ts` z obsługą `persist`.
- [x] **Krok 3: Ustawienia Globalne** - Zbudowanie modala do edycji stawek robocizny i bazy materiałowej.
- [x] **Krok 4: Kalkulator Wariantów (Tryb AUTO i MANUAL)** - Implementacja widoku technologii, logiki generowania wariantów wg wzoru oraz ręcznej edycji tabeli.

## 📝 Zadania do zrobienia (Backlog)
- [ ] **Krok 5: Eksport XML** - Napisanie skryptu iterującego po stanie Zustand, budującego string XML wg precyzyjnej struktury (element `$Dummy`, odpowiednie tagi `Path`, `UnitCost`) i pozwalającego pobrać plik na dysk.
- [ ] **Krok 6: Persistence & JSON Export** - Dodanie przycisku "Zapisz Projekt (JSON)" do Top Baru, pozwalającego na pobranie całego stanu aplikacji jako plik .json (obok localStorage).

## ⚠️ Ważne notatki / Zasady
- Aktualna wersja programu: **0.3.0**
- Cena w XML (tag `<f n="UnitCost">`) musi używać **kropki** jako separatora dziesiętnego.
- Każdy dodawany element `JobBrand` musi mieć po kolei rosnący indeks `n` (od zera).
- Ścieżka (tag `<s n="Path">`) buduje foldery w ArCADii, np. `Ściany zewnętrzne/Styropian EPS 80`.
- Wzór kalkulatora: `Koszt = (grubość_cm / 100) * cena_bazowa_m3 + koszty_stałe + robocizna`.