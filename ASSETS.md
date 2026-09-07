# Asset Origins and Licensing

## Original Game Material

The new game's Hoshi illustration, crew figures, drones, signal tools, receivers, artifacts, environments, UI motif, particles, and animation frames are original procedural drawings implemented in `src/art/` and `src/game/`. They use Canvas and Phaser drawing APIs. No television screenshots, traced photographs, extracted game sprites, commercial textures, ship models, or remote generated-asset services were used.

The revised Hoshi illustration in `src/art/hoshi.js` uses the existing `media/hoshisatoblu.jpg` as a visual reference for swept-back hair, a dark high-collared uniform, teal piping, and facial styling. It is an original stylized drawing, not a traced or embedded photograph. The sleeve insignia and imperial standards use original signal/orbit motifs. Both the reference photo and autograph remain unmodified. The travel shuttle, transit starfield, and underground chambers are also original procedural illustrations.

`src/art/expeditions.js` adds original overhead planetary terrain, coral, vegetation, glacial ridges, ruins, alien contacts, space stations, freighters, rescue/cargo objects, asteroids, and an illustrated Mirror Enterprise interpretation for the new Away Missions and Shuttle Bay collections. They are drawn from code and do not use extracted ship models, traced screenshots, stock textures, or externally downloaded assets. The twenty new mission narratives are original fan fiction, and their worlds are imaginative settings rather than claims of franchise canon.

All new music, ambience, and sound effects are synthesized locally by `src/systems/audio.js`. The notes and sound design are original, with no recorded voices, sampled episode audio, commercial soundtrack material, or recognizable franchise themes.

The contextual Konami surprises in `src/art/easter-eggs.js` use original canvas-drawn constellations, crowns, tea cups, lanterns, and flowers. The ceremonial flight formation reuses the game's original generated ship texture. No new external images, audio, fonts, or asset services are used for these effects.

The story and world dialogue are original fan fiction. Hoshi Sato, the Defiant, the Mirror Universe premise, and related franchise names remain associated with their respective rights holders. No ownership or endorsement of that intellectual property is claimed.

## Third-Party Dependencies

| Material      | Source                                          | License                                            | Usage                                                    |
| ------------- | ----------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| Phaser 3      | https://phaser.io/                              | MIT                                                | Rendering, input integration, Arcade Physics             |
| Lucide        | https://lucide.dev/                             | ISC; inherited Feather portions retain MIT notices | Interface icons                                          |
| Rajdhani      | https://fonts.google.com/specimen/Rajdhani      | SIL Open Font License 1.1                          | Display typography, locally bundled through Fontsource   |
| Space Grotesk | https://fonts.google.com/specimen/Space+Grotesk | SIL Open Font License 1.1                          | Interface typography, locally bundled through Fontsource |
| Vite          | https://vite.dev/                               | MIT                                                | Development/build tooling, not a runtime service         |
| Playwright    | https://playwright.dev/                         | Apache-2.0                                         | Development test tooling, not shipped in the game        |

Exact installed versions and integrity hashes are in `package-lock.json`. `scripts/package-site.mjs` copies the installed runtime packages' original license texts to `dist/licenses/`. Do not remove those notices when redistributing the build. Font binaries are locally bundled; the game makes no font-provider requests.

## Protected Historical Material

The following files predate this reconstruction. They are not newly generated game assets and are not covered by the dependency licenses above:

- `images/LindaPark300x300.png`: the site's original Linda Park autograph. SHA-256: `7d6de292fe2181f4f568ca494e68f2b90d9ca1660a3c5a506ff34f14a2ae4c7c`. Displayed directly from the existing file, without edits, tracing, recompression, or replacement. Its light background is CSS only; the original bytes and transparency remain intact.
- `media/hoshisato.jpg` and `media/hoshisatoblu.jpg`: existing historical homepage images, retained solely for the archive. Their original acquisition rights cannot be established from this repository. No new redistribution license is asserted.
- `tools/konami.js`: existing script used by the historical page. It remains unchanged. The new game's Easter egg is independently implemented and does not navigate away.
- Other existing photographs, scripts, galleries, and historical materials remain untouched in the repository. They are not imported into the new game or included in its build unless explicitly listed by the archive packaging allowlist.

The autograph and archive are preserved at the site owner's explicit request. Preservation is not a claim that historical material is freely reusable, and does not imply Linda Park's or any rights holder's endorsement. Review pre-existing image rights before redistributing those historical files outside this site.

## Fan Project Notice

This is an unofficial fan-created project and is not affiliated with or endorsed by Paramount, CBS, Star Trek, or their respective rights holders.

The experience is free and non-commercial. No account, advertising system, purchase flow, or donation prompt is part of the new game.
