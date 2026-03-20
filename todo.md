# Laser Parts – TODO

## Baza danych i backend
- [x] Schemat: tabele products, categories, orders, order_items, contact_messages
- [x] Migracja SQL i synchronizacja z Drizzle
- [x] tRPC: procedury dla produktów (CRUD admin)
- [x] tRPC: procedury dla kategorii
- [x] tRPC: procedury dla zamówień
- [x] tRPC: procedura dla formularza kontaktowego
- [x] tRPC: Stripe checkout session

## Globalne style i layout
- [x] Paleta kolorów korporacyjna (jasna, niebiesko-szara)
- [x] Typografia (Inter)
- [x] Navbar z logo, nawigacją i ikoną koszyka
- [x] Footer z danymi firmy, linkami i kontaktem
- [x] CartContext z localStorage persistence

## Strona główna
- [x] Hero section z hasłem i CTA
- [x] Sekcja kategorii produktów
- [x] Sekcja wyróżnionych produktów
- [x] Sekcja zaufania (marki: Trumpf, Bystronic, Mazak, LVD)
- [x] CTA kontaktowy

## Katalog produktów
- [x] Strona katalogu z filtrowaniem po kategorii
- [x] Wyszukiwarka produktów
- [x] Karta produktu (zdjęcie, nazwa, nr ref., cena, dodaj do koszyka)
- [x] Strona szczegółów produktu

## Koszyk i zamówienia
- [x] Widok koszyka (lista, ilości, suma)
- [x] Formularz zamówienia (dane firmy, NIP, adres dostawy)
- [x] Checkout z integracją Stripe
- [x] Strona potwierdzenia zamówienia

## Panel administracyjny
- [x] Strona /admin z sidebar nawigacją
- [x] Dashboard z metrykami
- [x] Lista produktów z możliwością edycji/usuwania
- [x] Formularz dodawania/edycji produktu
- [x] Zarządzanie kategoriami
- [x] Lista zamówień z podglądem i zmianą statusu
- [x] Lista wiadomości kontaktowych

## Pozostałe podstrony
- [x] Strona "Technologia laserowa"
- [x] Strona "Oprogramowanie JETCAM"
- [x] Strona "Kontakt" z formularzem i danymi firmy

## Testy i finalizacja
- [x] Testy vitest dla procedur tRPC (15 testów)
- [x] Checkpoint i prezentacja użytkownikowi

## Placeholdery (do implementacji w przyszłości)
- [ ] Webhook Stripe (automatyczne oznaczanie zamówień jako opłacone)
- [ ] Konto klienta (historia zamówień)
- [ ] Kalkulator kosztów wysyłki
- [ ] Integracja z systemem fakturowania
- [ ] Strona regulamin i polityka prywatności
- [ ] Zdjęcia produktów (upload do S3)
- [ ] Import produktów z CSV/Excel
- [ ] Seed danych: przykładowe produkty i kategorie
