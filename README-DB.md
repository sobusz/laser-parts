# Baza danych

Katalog, artykuły, zapytania ofertowe i wiadomości kontaktowe trzymamy w MySQL.
Panel administracyjny pisze do tej samej bazy, z której czyta strona publiczna,
więc każda zmiana w `/admin` jest natychmiast widoczna w ofercie.

## Środowisko lokalne

Serwer to przenośne MySQL 8.4 rozpakowane **poza repozytorium**, w
`~/.laser-parts-db`. Dzięki temu katalog danych nie jest obserwowany przez Vite
ani widziany przez gita. Nasłuchuje na porcie **3307**, żeby nie kolidować z
ewentualnym systemowym MySQL, i nie jest zarejestrowany jako usługa Windows.

```powershell
pnpm db:start     # podnosi serwer (po restarcie komputera trzeba to powtórzyć)
pnpm db:migrate   # stosuje migracje z drizzle/
pnpm seed         # wgrywa katalog i zakłada konto administratora
pnpm dev
```

Ścieżkę instalacji można nadpisać zmienną `LASER_PARTS_DB_HOME`.

## Konfiguracja

Zmienne opisuje `.env.example`; `.env` nie jest commitowany. Dwie łatwe do
przeoczenia pułapki:

- `VITE_APP_ID` musi być niepuste. Trafia do tokenu sesji jako `appId`, a
  `verifySession()` odrzuca tokeny z pustym `appId` — przy braku tej zmiennej
  logowanie do panelu nie działa, nie zgłaszając błędu.
- Bez `DATABASE_URL` aplikacja startuje normalnie, ale wszystkie zapytania
  zwracają puste listy i oferta pokazuje „0 pozycji”.

## Migracje

`pnpm db:migrate` stosuje pliki z `drizzle/` według `drizzle/meta/_journal.json`.

Uwaga: migracja `0002_b2b_catalog.sql` została napisana ręcznie i nie ma
odpowiadającego jej snapshotu w `drizzle/meta/`. Dopóki go nie ma, **`pnpm
db:generate` wygeneruje migrację duplikującą zmiany z 0002** — przed pierwszym
użyciem tej komendy trzeba odtworzyć snapshot albo spłaszczyć historię migracji
do jednego pliku bazowego (bezpieczne, bo poza lokalnym środowiskiem nie ma
jeszcze żadnej wdrożonej bazy). Migracje `0000`/`0001` tworzą też tabele
`orders` i `order_items` po wycofanym sklepie — są nieużywane i można je usunąć
przy okazji tego porządku.

## Seed

`pnpm seed` jest idempotentny: dopasowuje pozycje po slugu, potem po nazwie i
grupie, a na końcu po unikalnym numerze referencyjnym, więc powtórne
uruchomienie aktualizuje istniejące wiersze zamiast tworzyć duplikaty. Zakłada
też konto administratora na podstawie `ADMIN_EMAIL` i `ADMIN_PASSWORD`.

## Testy

`server/catalog.db.test.ts` przechodzi realną ścieżkę zapisu: przez tRPC tworzy,
edytuje i usuwa własną pozycję testową w bazie i sprawdza, że publiczne zapytania
ją widzą, a użytkownik bez uprawnień admina nie może pisać. Test pomija się sam,
gdy `DATABASE_URL` nie jest ustawione.
