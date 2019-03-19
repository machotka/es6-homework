# ES6 Homework

## Co je cílem

Aplikace provolává public movie api (dokumentace viz. http://www.omdbapi.com), ze kterého je na základě hledané fráze schopna získat seznam filmů a jejich detailů.

Úkolem je naimplementovat následující komponenty:

* **MoviesScreen**
  * vykresluje search input a volá search endpoint movie api, response předá `MovieList` komponentě
* **MovieList**
  * komponenta přijímá pole filmů a strukturovaně jej zobrazí
  * uživatel má možnost pro každý film zobrazit jeho detail
  * tato komponenta NEvyužívá (=neimportuje) komponentu `MovieDetail`
  * v průběhu requestu informuje uživatele o načítání dat
* **MovieDetail**
  * komponenta přijímá `imdbID`, provolá movie api pro detail filmu a zobrazí jej uživateli
  * v průběhu requestu informuje uživatele o načítání dat

## Bonusové úkoly:

1. Zbavit se search buttonu a zobrazovat výsledky hledání na základě změny textu v search inputu (pozor: neprovolávat search endpoint zbytečně po stisku každé klávesy, počkat na "utichnutí" uživatelského vstupu).
2. Přepsat service funkce a jejich volání pomocí async/await (nevyužívat promise resolve/reject handlery).

