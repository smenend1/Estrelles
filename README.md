# CelAR - PWA de constel·lacions per Android

Segona versió funcional d'una PWA educativa que superposa estrelles, constel·lacions, Lluna i planetes damunt la càmera del mòbil.

## Novetats d'aquesta versió

- Brúixola visual amb punts cardinals.
- Horitzó amb línia i indicadors N, E, S i O.
- Lluna amb fase aproximada.
- Planetes visibles principals: Mercuri, Venus, Mart, Júpiter i Saturn.
- Cercador millorat per estrelles, constel·lacions, Lluna i planetes.
- Guia de direcció: indica si cal girar a dreta/esquerra o pujar/baixar el mòbil.
- Fitxes educatives tocant un objecte del cel.
- Calibratge amb objecte conegut: cerca un objecte, centra'l i prem "Centrar objecte cercat".
- Mode nit i funcionament offline bàsic.

## Com provar-la

1. Puja aquesta carpeta a un servidor HTTPS, per exemple GitHub Pages, Netlify, Vercel o el servidor del centre.
2. Obre l'URL amb Chrome en Android.
3. Dona permisos de càmera, ubicació i sensors.
4. Apunta el mòbil al cel.

També pots obrir-la en mode demostració sense permisos.

## Limitacions honestes

- La detecció es fa amb GPS, hora i orientació del mòbil, no amb reconeixement real de la imatge de les estrelles.
- La brúixola del mòbil pot tenir errors; per això inclou calibratge manual i calibratge amb objecte conegut.
- Les posicions dels planetes i de la Lluna són aproximades. Són útils per orientar-se i per ús educatiu, però no per mesures astronòmiques de precisió.
- Per funcionar bé necessita HTTPS.
- El catàleg d'estrelles encara és reduït. Es pot ampliar amb més constel·lacions i estrelles visibles.

## Fitxers principals

- `index.html`: estructura de la PWA.
- `styles.css`: disseny visual.
- `app.js`: càlcul astronòmic, sensors i dibuix sobre Canvas.
- `manifest.webmanifest`: instal·lació com a PWA.
- `sw.js`: funcionament offline bàsic.
