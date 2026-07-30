/* ============================================================
   BAZA KART — jedno miejsce z definicjami WSZYSTKICH kart w grze.
   gra.html i walka.html czytają dane stąd — żeby dodać nową kartę,
   NIE trzeba nic zmieniać w tamtych plikach (o ile karta używa
   jednego z już obsługiwanych rodzajów efektu — patrz sekcje niżej).

   JAK DODAĆ NOWĄ KARTĘ:
   1) Wybierz unikalny kod (nie może się powtórzyć).
   2) Skopiuj jedną z linijek poniżej z tej samej sekcji, zmień
      kod, nazwę, opis i wartości w "efekt".
   3) Wklej do tego pliku, zapisz, wgraj na GitHub.
   Appka sama ją "zobaczy" — nic więcej nie trzeba robić.

   Jeśli kiedyś wymyślisz kartę o efekcie, którego jeszcze nie ma
   na liście "dostępne rodzaje efektu w walce" (np. coś zupełnie
   nowego) — to jedyny przypadek, kiedy będę musiał dopisać kawałek
   kodu w walka.html. Wszystko inne to czysta edycja tego pliku.
   ============================================================ */

const KARTY = {

  // ============================================================
  // KARTY EKONOMII — wpływają na złoto.
  // Ciągnięte i używane w Panelu Gry (przycisk "➕ Dodaj kartę").
  // efekt: { zloto: liczba }  (dodatnia = zysk, ujemna = strata)
  // ============================================================
  "101": { kategoria: "ekonomia", nazwa: "Zastrzyk złota",  opis: "Zyskujesz 10 złota.",  efekt: { zloto: 10 } },
  "102": { kategoria: "ekonomia", nazwa: "Podatek",         opis: "Tracisz 5 złota.",     efekt: { zloto: -5 } },
  "103": { kategoria: "ekonomia", nazwa: "Łupy wojenne",    opis: "Zyskujesz 20 złota.",  efekt: { zloto: 20 } },

  // ============================================================
  // KARTY WOJSKA — trwale zmieniają statystyki jednostek.
  // Ciągnięte i używane w Panelu Gry (przycisk "➕ Dodaj kartę").
  // efekt: { jednostka: "wojownicy"|"lancjerzy"|"lucznicy",
  //          staty: "atak"|"zdrowie", wartosc: liczba }
  // ============================================================
  "201": { kategoria: "wojsko", nazwa: "Trening wojowników",   opis: "Twoi wojownicy: +10 zdrowia.", efekt: { jednostka: "wojownicy", staty: "zdrowie", wartosc: 10 } },
  "202": { kategoria: "wojsko", nazwa: "Zmęczenie łuczników",  opis: "Twoi łucznicy: -5 ataku.",     efekt: { jednostka: "lucznicy",  staty: "atak",    wartosc: -5 } },
  "203": { kategoria: "wojsko", nazwa: "Ostrzenie broni",      opis: "Twoi lancjerzy: +8 ataku.",    efekt: { jednostka: "lancjerzy", staty: "atak",    wartosc: 8 } },

  // ============================================================
  // KARTY SPECJALNE — UŻYCIE W PANELU GRY.
  // Kupowane za złoto (bez kodu), używane przez "➕ Dodaj kartę"
  // (dopiero tam wpisujesz kod) — działają jak karty wojska,
  // ale są ukryte do momentu zagrania.
  // efekt: identyczny format jak w kartach wojska.
  // ============================================================
  "301": { kategoria: "specjalna", uzycie: "gra", nazwa: "Przypływ mocy", opis: "Twoi lancjerzy: +8 ataku (trwale).", efekt: { jednostka: "lancjerzy", staty: "atak", wartosc: 8 } },

  // ============================================================
  // KARTY SPECJALNE — UŻYCIE W WALCE.
  // Wnoszone do walki w przygotowaniu, aktywowane przyciskiem
  // w dowolnym momencie starcia.
  //
  // Dostępne na razie rodzaje efektu (pole "typ" w "efekt"):
  //   atkMult       {wartosc, czasTikow}  — mnożnik własnych obrażeń przez X tików
  //   freezeEnemy   {czasTikow}           — wróg nie zadaje obrażeń przez X tików
  //   heal          {wartosc}             — natychmiast leczy aktualnie walczącą jednostkę
  //   instantDamage {wartosc}             — natychmiastowe dodatkowe obrażenia na wroga
  //   stealGold     {wartosc}             — kradnie złoto z konta przeciwnika
  //   revive        {jednostka}           — przywraca do walki 1 jednostkę danego typu
  // ============================================================
  "401": { kategoria: "specjalna", uzycie: "walka", nazwa: "Podwojenie ataku",   opis: "Twoje jednostki zadają 2x obrażeń przez 5 tików.",        efekt: { typ: "atkMult",       wartosc: 2,  czasTikow: 5 } },
  "402": { kategoria: "specjalna", uzycie: "walka", nazwa: "Zamrożenie czasu",   opis: "Wrogie jednostki nie zadają obrażeń przez 3 tiki.",        efekt: { typ: "freezeEnemy",   czasTikow: 3 } },
  "403": { kategoria: "specjalna", uzycie: "walka", nazwa: "Uzdrowienie",       opis: "Przywraca 50 PŻ aktualnie walczącej jednostce.",           efekt: { typ: "heal",          wartosc: 50 } },
  "404": { kategoria: "specjalna", uzycie: "walka", nazwa: "Zasadzka",          opis: "Zadaje wrogowi natychmiast 60 dodatkowych obrażeń.",       efekt: { typ: "instantDamage", wartosc: 60 } },
  "405": { kategoria: "specjalna", uzycie: "walka", nazwa: "Kieszonkowiec",     opis: "Kradniesz 15 złota przeciwnikowi.",                        efekt: { typ: "stealGold",     wartosc: 15 } },
  "406": { kategoria: "specjalna", uzycie: "walka", nazwa: "Bohaterski powrót", opis: "Przywraca do walki 1 wojownika.",                          efekt: { typ: "revive",        jednostka: "wojownicy" } }

};
