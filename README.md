# TV Show Browser 🎬

Ova aplikacija omogućava korisnicima pregled i istraživanje TV serija putem [TVMaze API-ja](https://www.tvmaze.com/api). Korisnici mogu pregledavati serije, njihove epizode, glumce, te spremati omiljene serije i glumce kao favorite.

 Ključne značajke

-  Početna stranica s listom TV serija (pretraga, sortiranje, paginacija)
-  Dinamičke rute za pojedinačne serije, glumce i epizode
-  Dodavanje/brisanje favorita (pohranjeno u localStorage)
-  /favorites stranica s pregledom označenih favorita
-  404 stranica za nepostojeće rute
-  Deploy na Vercel (Next.js serverless hosting)

 Lokalno pokretanje

1. Kloniraj repozitorij:

   ```bash
   git clone https://github.com/PetarZelic/edit-zavrsni-projekt.git
   cd naziv-repozitorija````

2. Instaliraj ovisnosti
    npm install
3. Pokreni razvojni server:
    npm run dev

1. Napravi produkcijski build:


    npm run build

2. Testiraj lokalno buildanu verziju:

    npm start

3. Aplikacija je deployana na Vercel:
     https://edit-zavrsni-projekt.vercel.app/



 Poznate greške / TODO
Epizode nekih serija s velikim brojem sezona (npr. Family Guy) ponekad uzrokuju timeout zbog velikog broja API poziva – potrebno razmotriti paralelno dohvaćanje ili keširanje.

Poboljšati prikaz paginacije (ukupni broj stranica, oznaka trenutne).

Dodati opciju filtriranja po žanrovima ili godini.