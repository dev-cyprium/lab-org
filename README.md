# LabOrg

Aplikacija za vođenje laboratorije koja ispituje bezbednost hrane i vode. Uzorkovači donose
uzorke (namirnice, voda, brisevi), laboranti ih zasejavaju na podloge i rade mikrobiološke i
hemijske analize, a rezultati se porede sa zakonskim granicama i dobijaju ocenu **ISPRAVAN** ili
**NEISPRAVAN**.

Aplikacija je **multi-tenant** — više firmi (klijenata) koristi isti sistem, a svaka vidi samo
svoje podatke.

## Tehnologije

- **Angular 17** (modularna arhitektura, lazy-loaded feature moduli)
- **Angular Material** za UI
- **Firebase** — Authentication (email/lozinka + Google) i Cloud Firestore (baza)
- Reaktivne forme, RxJS

## Funkcionalnosti

- Prijava i registracija (email/lozinka i Google nalog); registracija kreira novu firmu ili se
  pridružuje postojećoj
- Onboarding za novu firmu — kreiranje prve laboratorije ili uvoz demo podataka
- CRUD nad resursima: laboratorije, zaposleni, podloge/reagensi, uzorci, zasejavanja i analize
- Katalog mikroorganizama (globalni, čita se iz JSON-a)
- Dashboard sa statistikom (broj uzoraka, analiza, neispravnih nalaza, isteklih podloga)
- Pretraga i filteri po listama, custom pipe-ovi (CFU, ocena, datum, istek roka...) i direktive

## Pokretanje

```bash
npm install
npm start
```

Aplikacija se otvara na `http://localhost:4200/`.

## Firebase podešavanje

Projekat koristi Firebase. Konfiguracija se nalazi u `src/environments/environment.ts`. Da bi
aplikacija radila potrebno je na Firebase konzoli:

1. Uključiti **Authentication → Sign-in method → Email/Password** (i po želji **Google**).
2. Napraviti **Firestore** bazu.
3. Postaviti sigurnosna pravila (multi-tenant izolacija) iz fajla `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

Pravila obezbeđuju da korisnik može da čita i menja samo podatke svoje kompanije.

## Demo podaci

Nakon prijave kao administrator firme, na onboarding ekranu postoji dugme **Uvezi demo podatke**
koje popunjava firmu kompletnim primerom (laboratorije, zaposleni, podloge, uzorci, zasejavanja,
analize). Podaci se učitavaju iz JSON fajlova u `src/assets/data/`.

## Struktura projekta

```
src/app/
  core/           servisi, modeli, guard, layout (navbar/sidebar/footer)
  shared/         Material moduli, custom pipe-ovi i direktive, deljene komponente
  features/       feature moduli (auth, dashboard, onboarding, laboratorije, zaposleni,
                  podloge, uzorci, zasejavanja, analize, mikroorganizmi)
  assets/data/    JSON podaci (katalog mikroorganizama + seed za demo)
```

## Build

```bash
npm run build
```

Rezultat se nalazi u `dist/` direktorijumu.
