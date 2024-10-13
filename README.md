Projektstruktur
Projektmappen innehåller följande filer och mappar:

project-root/
│
├── index.html          # Huvudsidan för spelet
├── script.js           # Spelets huvudskript som innehåller logiken
├── style.css           # CSS-fil för spelets utseende
├── manifest.json       # Manifestfil för PWA-support
├── serviceWorker.js    # Service Worker för offline-stöd
├── Image/              # Mapp som innehåller bilder och sprites
│   ├── player.png
│   ├── zombie.gif
│   └── ... (andra bilder)
├── Icon/               # Mapp som innehåller appens ikoner
│   ├── icon_192.png
│   └── icon_512.png



 Beskrivning av filer och mappar
index.html: Grundläggande HTML-struktur och länkning av nödvändiga resurser som JavaScript och CSS.
script.js: Innehåller all spelrelaterad logik och rendering av spelkomponenter.
style.css: Grundläggande stil för spelet och layouten av canvas-elementet.
manifest.json: Konfiguration för att göra spelet till en Progressive Web App (PWA) med stöd för ikoner och startskärm.
serviceWorker.js: Hanterar caching och offline-support genom att cachelagra nödvändiga resurser.





Huvudklasser och Funktioner
1. Platform
Hanterar ritning av plattformar som täcker skärmen.
draw(): Renderar plattformen på canvasen.
updateImage(imageSrc): Uppdaterar plattformens bild under spelets gång.
2. Player
Representerar spelarens karaktär med logik för rörelse och skjutande.
update(): Uppdaterar spelarens position och tillstånd, applicerar gravitation och kontrollerar dödsstatus.
draw(): Renderar spelaren på skärmen, inklusive en indikator för skjutriktningen.
handleDeath(): Hanterar spelarens död när en zombie träffar spelaren.
3. Zombie
Representerar zombies i spelet som jagar spelaren.
update(player): Uppdaterar zombiens position och kontrollerar kollision med spelaren.
animate(): Hanterar animationen av zombies genom att gå igenom sprite-bilder.
checkCollisionWithPlayer(player): Kontrollerar om zombien kolliderar med spelaren.
4. Bullet
Hanterar kulor som avfyras av spelaren.
update(): Uppdaterar kulans position och kontrollerar om den går utanför skärmen.
draw(): Renderar kulan som en cirkel.
5. Spawning & Animation
spawnZombies(): Skapar nya zombies vid slumpmässiga intervaller.
animate(): Huvudloopen som uppdaterar och renderar alla objekt (spelare, zombies, kulor och plattformar).
Kontroller
A: Flytta spelaren åt vänster.
D: Flytta spelaren åt höger.
W: Hoppa.
Space: Skjut en kula.
Upp/Ner pil: Justera skjutriktningen.
Enter: Starta om spelet efter "Game Over".
Service Worker & PWA Support
Spelet är utformat för att fungera som en Progressive Web App (PWA) med en Service Worker som hanterar caching av nödvändiga resurser. Detta gör att spelet kan spelas offline när det är installerat som en app.

Manifestfilen (manifest.json)
Manifestet innehåller information om appen såsom namn, ikoner och färgteman. Detta möjliggör installation på hemskärmen för mobila enheter.

Service Worker (serviceWorker.js)
Service Workern cachelagrar spelets resurser, vilket gör det möjligt att spela spelet offline efter att det har laddats första gången.

install: Cacherar alla resurser när appen installeras första gången.
activate: Aktiverar den senaste versionen av service workern och rensar gamla cacher.
fetch: Hanterar nätverksförfrågningar och returnerar cacherade resurser om de finns tillgängliga.
