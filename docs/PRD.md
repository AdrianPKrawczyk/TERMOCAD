# 📄 Specyfikacja Produktu (PRD) – Generator Kosztorysów XML (ArCADia-TERMO)

## 1. Cel projektu
Stworzenie lokalnej aplikacji webowej (Single Page Application), która zastąpi arkusze Excel w procesie generowania baz cenowych dla audytorów energetycznych. Aplikacja ma pozwalać na definiowanie globalnych cen materiałów/robocizny, zarządzanie różnymi technologiami dociepleń i automatyczne przeliczanie kosztów w zależności od grubości materiału. Finalnym krokiem jest eksport danych do specyficznego pliku XML kompatybilnego z programem ArCADia-TERMO.

## 2. Architektura i Wytyczne Technologiczne (Tech Stack)
Dla agenta AI narzucamy następujący, nowoczesny i szybki stos technologiczny:
* **Framework:** React 18+ uruchamiany przez Vite.
* **Język:** TypeScript (kluczowe dla uniknięcia błędów w obliczeniach i zachowania struktury).
* **Zarządzanie stanem (State Management):** Zustand (lekki, idealny do przechowywania globalnych zmiennych i zagnieżdżonego drzewa kategorii).
* **Styling:** Tailwind CSS (szybkie budowanie interfejsu, tabele, formularze).
* **Ikony:** Lucide React (standardowe ikony UI).
* **Eksport XML:** Wbudowany `DOMParser` / `XMLSerializer` z przeglądarki (nie ma potrzeby ciężkich bibliotek).
* **Zapis danych (Persistence):** Stan aplikacji (drzewo kategorii i ustawienia globalne) musi być zapisywany w `localStorage` przeglądarki (aby po odświeżeniu strony użytkownik nie stracił danych) z opcją eksportu/importu całego stanu do pliku `.json`.

## 3. Szczegółowy opis rozwiązań i działania aplikacji

### 3.1. Model Danych (Data Structure)
Aplikacja powinna opierać się na następującym modelu zagnieżdżonym (do zaimplementowania w Zustand):

```typescript
// Ustawienia globalne
interface GlobalSettings {
  hourlyRate: number; // np. 45 zł/h
  baseMaterials: Record<string, number>; // np. { "EPS_036": 245, "Klej": 42.5 }
}

// Pojedynczy wyliczony wariant (wiersz w tabeli)
interface Variant {
  id: string;
  thickness?: number; // np. 15 (cm)
  name: string; // np. "Fasada 0,036 - 15cm"
  unit: string; // np. "zł/m2"
  totalCost: number; // Wyliczona cena
}

// Technologia (np. "Styropian EPS 80")
interface Technology {
  id: string;
  name: string;
  calculationType: "AUTO" | "MANUAL";
  
  // Dla trybu AUTO
  thicknessStart?: number;
  thicknessEnd?: number;
  thicknessStep?: number;
  formulaConfig?: {
    materialBaseId: string; // Referencja do GlobalSettings
    fixedCost: number; // np. tynk, siatka
    laborCostPattern: string; // np. "fixed" | "linear_with_thickness"
  };
  
  // Zawsze zawiera ostateczne warianty (wygenerowane lub wpisane ręcznie)
  variants: Variant[]; 
}

// Kategoria główna (np. "Ściany zewnętrzne")
interface Category {
  id: string;
  name: string;
  technologies: Technology[];
}

// Główny stan
interface AppState {
  globalSettings: GlobalSettings;
  categories: Category[];
}
```

### 3.2. Podział Interfejsu (UI Layout)
Aplikacja powinna składać się z 3 głównych sekcji (layout CSS Grid/Flexbox):
1. **Sidebar (Pasek boczny - Nawigacja):** * Lista `Categories` z możliwością dodawania nowej (`+ Dodaj kategorię`).
   * Po rozwinięciu kategorii widać listę `Technologies` z możliwością dodania nowej.
2. **Top Bar (Górna belka):**
   * Przycisk "⚙️ Zmienne Globalne" (otwiera modal z ustawieniami).
   * Główny przycisk "💾 Zapisz Projekt (JSON)".
   * Główny przycisk **"🚀 Eksportuj do XML"**.
3. **Main Content (Główny widok):**
   * Zmienia się w zależności od tego, co kliknięto w Sidebarze.
   * Widok Technologii: Tytuł, przełącznik "Kalkulator (Auto) / Ręczne wpisywanie".
   * W trybie Auto: Formularz ustawiania zakresu (od 5cm do 30cm) oraz przycisk "Generuj tabelę". Pod spodem tabela wynikowa (`Variants`).
   * W trybie Ręcznym: Tabela z możliwością dodawania wierszy (Nazwa, Jednostka, Cena).

### 3.3. Logika przeliczania (Core Logic)
Dla trybu `AUTO` agent AI musi napisać funkcję, która w pętli od `thicknessStart` do `thicknessEnd` dodaje do tablicy `variants` obiekty, w których `totalCost` jest wyliczany w czasie rzeczywistym na podstawie zmiennych globalnych.
*(Przykładowa logika do przekazania AI: `koszt = (grubość_w_metrach * cena_za_kubik) + koszty_stale + robocizna`)*.

---

## 4. Dokładny opis i struktura końcowego XML

Agent AI musi stworzyć funkcję `generateXML(categories)`, która przechodzi przez całe drzewo danych (wszystkie kategorie -> wszystkie technologie -> wszystkie warianty), układa je w płaską listę i generuje ciąg znaków XML.

**Wytyczne dla parsera XML w kodzie:**
* Należy upewnić się, że plik ma nagłówek `<?xml version="1.0" encoding="utf-8"?>`.
* Główny węzeł to `<root>`.
* Lista elementów jest trzymana w `<o n="Data" t="JobBrandLibraryType"><o n="JobBrandList" t="$ObjectArray">`.
* **Krytyczne:** Każdy dodany wariant musi być obiektem `<o t="JobBrand" n="TUTAJ_KOLEJNY_INDEX_LICZBOWY_OD_0">`. Indeksy `n` muszą rosnąć o 1 bez przerw.
* Tag `<s n="Path">` to połączenie: `Nazwa Kategorii/Nazwa Technologii` (np. `Ściany zewnętrzne/Styropian EPS 80 0,036`). Przez ten tag program ArCADia zbuduje sobie strukturę folderów.
* Tag `<f n="UnitCost">` musi zawierać liczbę, gdzie separatorem dziesiętnym jest **kropka** (np. `350.50`), a nie przecinek.
* Pierwszy element o indeksie `0` (zawsze generowany z automatu na początku pliku) to element tzw. `$Dummy` o cenie `-1`.

**Wzorzec końcowego pliku (do wklejenia agentowi jako Expected Output Template):**

```xml
<?xml version="1.0" encoding="utf-8"?>
<root>
  <o n="Data" t="JobBrandLibraryType">
    <o n="JobBrandList" t="$ObjectArray">
      <o n="0" t="JobBrand">
        <s n="Path"></s>
        <s n="Unit"></s>
        <s n="Name">$Dummy</s>
        <s n="Costs"></s>
        <f n="UnitCost">-1</f>
      </o>
      <o n="1" t="JobBrand">
        <s n="Path">Ściany zewnętrzne/Styropian EPS 0,036</s>
        <s n="Unit">zł/m2</s>
        <s n="Name">Fasada 0,036 - 5cm</s>
        <s n="Costs"> </s>
        <f n="UnitCost">260.98</f>
      </o>
      <o n="2" t="JobBrand">
        <s n="Path">Ściany zewnętrzne/Styropian EPS 0,036</s>
        <s n="Unit">zł/m2</s>
        <s n="Name">Fasada 0,036 - 6cm</s>
        <s n="Costs"> </s>
        <f n="UnitCost">266.12</f>
      </o>
      <o n="3" t="JobBrand">
        <s n="Path">Ściany zewnętrzne/Tynki Perlitowe</s>
        <s n="Unit">zł/m2</s>
        <s n="Name">Tynk perlitowy 2cm</s>
        <s n="Costs"> </s>
        <f n="UnitCost">210.00</f>
      </o>
    </o>
  </o>
</root>
```