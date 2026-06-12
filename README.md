# CelAR - PWA de constel·lacions per Android

Primera versió funcional d'una PWA educativa que superposa estrelles i constel·lacions damunt la càmera del mòbil.

## Com provar-la

1. Puja aquesta carpeta a un servidor HTTPS, per exemple GitHub Pages, Netlify, Vercel o el servidor del centre.
2. Obre l'URL amb Chrome en Android.
3. Dona permisos de càmera, ubicació i sensors.
4. Apunta el mòbil al cel.

També pots obrir-la en mode demostració sense permisos.

## Limitacions honestes

- La detecció es fa amb GPS, hora i orientació del mòbil, no amb reconeixement real de la imatge de les estrelles.
- La brúixola del mòbil pot tenir errors; per això inclou calibratge manual.
- Per funcionar bé necessita HTTPS.
- El catàleg inclòs és reduït i pensat com a MVP escolar. Es pot ampliar.

## Fitxers principals

- `index.html`: estructura de la PWA.
- `styles.css`: disseny visual.
- `app.js`: càlcul astronòmic, sensors i dibuix sobre Canvas.
- `manifest.webmanifest`: instal·lació com a PWA.
- `sw.js`: funcionament offline bàsic.
