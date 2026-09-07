# Hoshi Sato: The Mirror Signal

A family-friendly browser adventure for **hoshisato.com**, with three playable collections: ten side-scrolling Star Chart journeys, ten top-down planetary Away Missions, and ten momentum-based Shuttle Bay flights. An original, non-commercial fan continuation inspired by Mirror Universe Hoshi Sato, with the Defiant as a shared home.

No combat, character deaths, accounts, analytics, remote asset CDNs, or server-side application are required. Scanners cause a gentle recall, and discoveries are never lost to a fall.

## Play and Develop

Use Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Choose **Begin Your Journey**, walk to the star chart aboard the Defiant, and interact to choose a mission. The title's Star Chart is also directly accessible. Continue resumes an unfinished mission's saved checkpoint.

All ten destinations are available immediately. The star chart explicitly marks **Available**, **In Progress**, and **Completed / Revisit**. Destinations supply the movement and signal equipment they require, so playing out of order cannot leave a mandatory receiver inaccessible. Mission completions still grow the Defiant independently of destination access.

Mission departures and returns have an original illustrated transit sequence. Skip using its button, Space, Escape, or a controller's A/Menu button. Reduced-motion mode uses a still approach and a shorter transition. Checkpoint restart skips transit entirely.

```sh
npm test
npx playwright install chromium
npm run test:browser
npm run build
npm run preview
```

`dist/` is the complete production site. Opening the development HTML directly with `file://` will not resolve ES modules; use the local server or serve the built directory. No PHP runtime is used.

## The Adventure

The Defiant has three independent mission terminals, all accessible from the first visit. **Star Chart** retains the original platforming campaign. **Away Missions** is on the lower deck beneath the autograph archive; **Shuttle Bay** is beneath the signal workshop. Mission menus also have collection tabs. All thirty missions are open immediately, with separate Available / In Progress / Completed labels, discoveries, checkpoints, and best completion times for the new collections.

### Away Missions

These are overhead, free-roaming planetary expeditions, not more platforming levels. Each contains a brief story, three connected encounters, environmental obstacles, an optional uncharted discovery, and an extraction point. Your scanner reveals quiet landmarks and hidden findings; contact and translation unfold through readable, short field reports.

| World       | Mission                      | Setting and mechanic                           |
| ----------- | ---------------------------- | ---------------------------------------------- |
| Neris IV    | The Shore That Answers       | Tidal archipelago and ocean-wide first contact |
| Velor       | The Orchard of Borrowed Suns | Living canopy and responsive root barriers     |
| Isen        | Under the Blue Ice           | Gliding traversal and a buried observatory     |
| Seral       | A Language Made of Rain      | Monsoon terraces and ordered translation       |
| Ochre Prime | The City With No Doors       | Mirage landmarks and desert winds              |
| Umbriel     | The Night Garden             | Scanner-lit nocturnal ecology                  |
| Khepri      | The Breathing Mountain       | Timed geothermal vents                         |
| Aer         | The Sky Beneath Your Feet    | Crosswinds and a suspended monastery           |
| Palimpsest  | Someone Else Remembers       | Ordered memories in resonant ruins             |
| Vesper      | The World Between Crowns     | Eclipse-window diplomacy                       |

Move with WASD/arrows or the controller's left stick. **F / X** scans, **E / Y** interacts, **Shift / B** makes a quick step, **M** opens the field survey, **H** returns home, and **Escape / Menu** pauses. Touch devices have a four-direction pad and dedicated actions. Objectives save immediately; a recall returns you to your latest completed site, keeping discoveries.

### Shuttle Bay

Pilot an original illustrated interpretation of the **Mirror Enterprise** in ten top-down flight operations. Thrust changes velocity; releasing thrust preserves drift. Turn, brake, and plan approaches. This collection is nonviolent: encounters focus on navigation, rescue, towing, escort, racing, and avoiding traffic monitors. Sensor decoys distract patrols rather than damaging them.

| Sector      | Mission                            | Flight objective                        |
| ----------- | ---------------------------------- | --------------------------------------- |
| Sol         | A Different Kind of Helm           | Navigation rings and precision docking  |
| Cinder Belt | A Thread Through Stone             | Asteroid slalom and close surveys       |
| Lacuna      | Lights in the Fog                  | Rescue rendezvous in a nebula           |
| Pelagic     | The Weight of a Promise            | Tractor towing and cargo handover       |
| Orison      | Around the Quiet Giant             | Gravity-well navigation                 |
| Aven        | The Long Way Home                  | Civilian escort with proximity checks   |
| Veil        | A Courtesy of Shadows              | Patrol evasion and sensor decoys        |
| Ion Sea     | Sailing the Aurora                 | Currents and field calibration          |
| Meridian    | The Empress Takes the Outside Line | Ordered racing gates and personal bests |
| Janus       | The Door Beyond the Map            | Anomaly windows and anchoring           |

**A/D** turn, **W** thrusts, **S** brakes, **Space** boosts, **F** scans/deploys a decoy, and **E** docks/interacts. Use the left stick/D-pad for turn/thrust/brake, A to boost, X to scan, and Y to interact. Docking, rescue, and transfer interactions require less than **85 m/s**. Racing/navigation rings trigger by flying through them. Cargo affects handling; escorted vessels follow only while you stay close. The local radar shows objectives, docking points, and the escorted vessel. Mission time excludes paused menus and is preserved at checkpoints; successful replays retain the fastest time.

Both new collections use the existing travel sequences and return to the walkable Defiant. Completion counts appear beneath their terminals, optional discoveries populate an expedition display, and **Field Logs** retains each completed story and uncharted finding. They do not falsely complete or unlock the original Star Chart campaign.

### Star Chart

| World | Journey                   | Identity                                                         |
| ----- | ------------------------- | ---------------------------------------------------------------- |
| 01    | A Quiet Coronation        | The Defiant: movement, receivers, and the first open channel     |
| 02    | The Long Way Up           | Imperial shipyard: moving lifts and phase steps                  |
| 03    | A Different Kind of Power | Vulcan sky gardens: updrafts, prism routing, the Choir Engine    |
| 04    | Things We Leave Behind    | Enterprise drift: low gravity and orbit boots                    |
| 05    | An Empress Incognito      | Lantern capital: rooftops, festival lights, scanner timing       |
| 06    | Everybody, Together       | Free Relay: chorus signals, shields, the Relay Keeper            |
| 07    | Between the Threads       | Tholian glassways: phase bridges and pulse curtains              |
| 08    | The Room That Remembers   | Mnemosyne Lab: ordered memories, lifts, the Memory Curator       |
| 09    | All the Lights of Home    | Return to the Defiant: combined traversal during a stellar storm |
| 10    | A Crown of Quiet Stars    | Mirror observatory: the Regent's final six-part harmony          |

Each mission includes five memory stars, a hidden archive, a world log, a checkpoint, and its own authored layout. Four large harmony encounters test signal selection and movement instead of combat. Explorer mode offers second chances; Voyager mode recalls Hoshi whenever a scanner finds her.

### Below the Official Maps

Every world now has a second, explorable vertical route: the Unlisted Deck, Foundry Below, Root Cathedral, Silent Hold, Beneath the Banners, Listening Vault, Glass Beneath, Mnemonic Catacombs, Empress's Passage, and First Empire. Enter through the marked descent console or the open shaft beside it. The lower chambers use three obstacle types: overridable bulkheads, low passages requiring crouching, and moving/phase bridges, alongside timed scanner curtains.

Each lower route includes its own saved checkpoint, two of the world's five memory stars, an optional imperial intelligence cache, and a return lift. Cache discoveries remain in the Defiant's listening post. The pause menu's **Deck Survey** shows physical platforms, the lower passage, Hoshi's position, and the return lift. The camera follows vertically; upper-deck hazards do not affect the chambers below.

### The Evolving Defiant

The hub is a walkable ship, not only a level selector. Its physical width increases as worlds reconnect:

- From the beginning: Star Chart, Away Missions, Shuttle Bay, Linda Park archive, signal workshop, listening post, and Navigator Ivo.
- Every return: recovered artifacts, illuminated world indicators, new incoming messages, and changing crew dialogue.
- Three worlds: the conservatory opens and T'Vel joins the ship.
- Six worlds: the listening gallery opens, with an artifact collection and expanded musical layers.
- Nine worlds: the observation room opens.
- Ten worlds: the ship's final story state and a room built for everyone.

Stars purchase permanent workshop improvements. Three secret archives unlock the Echo Lantern. Completion tracks the campaign, fifty stars, ten archives, and ten world logs. The original site's familiar arrow-key Easter egg also survives, without sending players away.

### Achievements and Unlisted Frequencies

**Achievements** is directly available on the title menu and every mode's pause menu. It lists the earned total, individual **Earned / Locked** states, and achievement hints. Earlier achievements remain intact in existing saves.

The keyboard sequence **Up, Up, Down, Down, Left, Right, Left, Right, B, A** unlocks **An Old Tradition** and a different badge/effect depending on Hoshi's location:

| Location               | Secret                                                                   |
| ---------------------- | ------------------------------------------------------------------------ |
| Title screen           | A Crown of Stars: a crown-shaped constellation over the observation deck |
| Defiant hub            | Tea, by Imperial Decree: a hovering ceremonial tea service               |
| Upper Star Chart route | A Very Royal Inspection: a temporary crown and starlight around Hoshi    |
| Lower passage          | Lanterns Below the Empire: a procession of floating lanterns             |
| Away Mission           | An Unexpected Bloom: a ring of luminous flowers                          |
| Shuttle Bay flight     | The Imperial Flypast: a formation of non-colliding holographic ships     |

Each effect is cosmetic, lasts 8.5 seconds, and can be replayed without awarding duplicate badges. Reduced-motion mode uses a still version. Effects clear on travel, scene changes, leaving the page, and repeat activation. Entering the code in a paused menu uses the current location and leaves gameplay paused. Input fields, modifier shortcuts, and travel sequences ignore it; a gap of more than five seconds between keys resets the sequence. The code never completes objectives, changes physics, or opens an external page.

**Linda's Instagram** is an explicit link in the title and pause menus. It opens `https://www.instagram.com/reallindapark` in a separate tab with `noopener noreferrer`, leaving the game tab and progress intact. The historical homepage retains its original behavior.

## Controls

| Action                               | Keyboard               | Standard Controller |
| ------------------------------------ | ---------------------- | ------------------- |
| Move / run                           | A / D or Left / Right  | Left stick or D-pad |
| Jump; jump again with orbit boots    | Space                  | A                   |
| Crouch                               | S or Down              | D-pad Down          |
| Drop through a ledge                 | Down + Space           | Down + A            |
| Send a signal                        | F                      | X                   |
| Aim up / manual aim                  | W or Up                | Right stick         |
| Interact / tune a nearby receiver    | E                      | Y                   |
| Cycle signal tools                   | Q                      | Right bumper        |
| Phase step, supplied from world 2    | Shift                  | B                   |
| Signal shield, supplied from world 6 | R                      | Left trigger        |
| Pause                                | Escape                 | Menu / Start        |
| Star chart                           | M                      | Pause menu          |
| Return to ship                       | H                      | Pause menu          |
| Navigate menus                       | Tab / Shift+Tab; Enter | D-pad Up/Down; A    |
| Close a menu                         | Escape                 | B or Menu           |

Hold jump for more height. Movement has acceleration, braking, 115 ms coyote time, and a 145 ms jump buffer. Nearby receivers are gently targeted in the direction Hoshi faces. Receiver names and numbers supplement color coding. Pulse, Prism, Chorus, and Echo differ in cadence, reach, spread, and supported frequencies.

Touch controls appear automatically on touch devices. Landscape provides a wider view. Menus use native accessible buttons and dialogs, with keyboard focus, captions, reduced motion, camera-feedback controls, independent audio sliders, and persistent mute. Controllers are implemented using the standard Gamepad API mapping; hardware-specific mappings may vary.

## Saves and Privacy

`localStorage['hoshi-mirror-signal-v1']` stores versioned progress, current checkpoint and receiver state, settings, discoveries, and upgrades on the current browser/device. Invalid fields are sanitized. Blocked storage falls back to an in-memory session with an on-screen notice. Reset Progress requires confirmation and preserves settings.

Lower-route intelligence is stored in the additive `routes` array; checkpoints now include a validated `y` coordinate. Existing version-1 saves migrate with an empty route collection and a surface checkpoint height, without clearing earlier progress. Out-of-order mission checkpoints are preserved.

`away` and `shuttle` each store their own `completed`, `discoveries`, `bestTimes`, and `checkpoint` fields. Their checkpoints hold objective IDs and elapsed mission time; `activeCollection` chooses the correct title-screen resume action. Legacy version-1 saves gain empty collection records automatically. Finishing or replaying an expedition clears only its collection checkpoint. Reset clears all three collections while retaining settings.

No data is sent to a server. Moving between domains, profiles, private browsing, or clearing site data does not transfer progress. Audio begins only after user interaction and is quieted when paused or backgrounded.

## Architecture

- `src/main.js`: application lifecycle, lazy engine loading, viewport observation, Easter egg.
- `src/data/easter-eggs.js`: context definitions, registered badge descriptions, and bounded keyboard sequence matching.
- `src/systems/easter-eggs.js`: contextual unlocks, temporary overlay lifecycle, input guards, and cleanup.
- `src/art/easter-eggs.js`: original cosmetic canvas effects, independent of the gameplay/physics scenes.
- `src/game/world.js`: shared Phaser scene, platform construction, mission/hub orchestration, checkpoints.
- `src/data/expeditions.js`: twenty authored Away/Shuttle stories, layouts, and objective rules.
- `src/game/expedition.js`: separate Away and Flight Phaser scenes, objectives, extraction, and isolated persistence.
- `src/game/expedition-pilot.js`: ground movement versus inertial thrust/turn/brake controls.
- `src/game/expedition-environment.js`: planetary cycles, asteroid motion, gravity/current fields, towing, escorts, and nonviolent patrols.
- `src/art/expeditions.js`: original planetary terrain, flora, ruins, landmarks, ships, stations, and deterministic asteroid layouts.
- `src/ui/expeditions.js`: collection catalogs, field logs, radar, surveys, telemetry, and mode-specific controls.
- `src/game/exploration.js`: lower chambers, collidable obstacles, descent, underground checkpoints, and return lifts.
- `src/data/exploration.js`: ten lower-route identities, geometry, and imperial intelligence.
- `src/systems/travel.js`: skippable canvas transit sequence, reduced motion, and cleanup.
- `src/art/hoshi.js`: shared photo-inspired original character drawing; native artwork faces left, with sprite flips matching movement.
- `src/game/player.js`: player movement, jump handling, phase steps, shields, safe recalls.
- `src/game/signals.js`: pooled signal motes and tool-specific tuning.
- `src/game/encounters.js`: reusable drone behaviors and multi-stage keepers.
- `src/game/effects.js`: bounded particle feedback and optional camera effects.
- `src/data/campaign.js`: ten authored layouts, palettes, dialogue, tools, achievements.
- `src/data/hub.js`: deck growth, crew reactions, and upgrade economy.
- `src/art/`: original canvas illustrations and lazily generated Phaser textures.
- `src/systems/`: versioned saves, keyboard/touch/controller input, original Web Audio soundscape.
- `src/ui/interface.js`: DOM menus, accessibility, HUD, archive, and controller menu navigation.
- `scripts/package-site.mjs`: explicit static deployment allowlist and license packaging.

Phaser 3 Arcade Physics handles collisions. Art is rendered from original drawing code, not extracted assets. Background textures are regenerated for the active world, particle and signal counts are capped, audio voices are bounded and disconnected after use, and scene shutdown cleans up its world objects. The title does not download Phaser until play begins. The production engine chunk is approximately 320 KB gzip; the game adds no remotely fetched art or music.

## GitHub Pages

The custom domain remains **hoshisato.com**. The original `CNAME` is unchanged and copied into `dist/` along with `.nojekyll`.

1. In repository **Settings > Pages > Build and deployment**, select **GitHub Actions** as the source.
2. Push reviewed changes to `main`. The included Pages workflow installs dependencies, builds the production site, and deploys the `dist/` artifact. Tests remain available locally but do not run in the deployment workflow.
3. Keep the existing domain/DNS settings. GitHub may require its normal domain verification and HTTPS provisioning.

The root source HTML now uses bundled dependencies, so the old "deploy directly from main / root" configuration must be changed to the build workflow. Alternatively, publish the contents of `dist/` with an existing static deployment pipeline. Relative asset URLs also support repository subpaths. The build contains no administrative PHP scripts or legacy credential/configuration examples.

## Preservation and Attribution

**The Linda Park autograph is sacred:** `images/LindaPark300x300.png` remains byte-for-byte unchanged. It is accessible from the title screen, the in-game archive, and the no-JavaScript fallback. Tests enforce its original SHA-256 and the original CNAME checksum.

The historical homepage is available at `archive/original-index.html`. Its obsolete counter is retired, its relative links are corrected, and a return link is added. The original homepage source remains in Git history. The existing `tools/`, `ai/`, `tmp/`, `images/`, and `media/` history is retained in the repository; only the archive's necessary files are copied into the new production site.

See **ASSETS.md** for origins, licenses, and the boundaries around pre-existing historical images. Third-party license texts are included in each production build under `licenses/`.

This is an unofficial fan-created project and is not affiliated with or endorsed by Paramount, CBS, Star Trek, or their respective rights holders.

## Verification

Unit checks cover preservation, save recovery, input normalization, progression, hub growth, the upgrade economy, and conservative ballistic reachability of required objects. Browser tests cover an input-only first mission, all ten scene objective paths and keeper phases, canvas pixels, mobile rotation/touch, simulated controller mapping, pause, checkpoints, storage, settings, and the autograph. The all-world integration test uses controlled placements to isolate objectives; it is not a human playthrough of every route.

Additional regressions cover left/right/idle/dash facing, open destinations, out-of-order equipment and save recovery, transit skipping and reduced motion, all ten lower chambers and exits, a keyboard-driven lower-route traversal, crouch-only clearance, and the deck survey. The photo reference is protected by a checksum test alongside the autograph and CNAME.

Expedition coverage exercises all twenty mission objective chains and discoveries, return loops, record isolation, towing resume, mobile/touch and simulated gamepad input, replay timekeeping, and reset. A representative Away Mission completes using normal keyboard movement, and a representative flight completes using input-controller steering/thrust/braking without teleporting or changing physics. The all-mission objective tests use controlled placement; they are not full manual playthroughs of every new mission.

Easter-egg tests type the actual keyboard sequence in all six locations, check nonblank effect pixels, saved/deduplicated badges, timeout and transition cleanup, unchanged mission progress, paused-menu behavior, input-field guards, and still reduced-motion rendering. Menu tests cover compact/mobile layouts and a mocked Instagram new-tab navigation; they do not contact or verify the live Instagram service.

The `?qa=1` development URL exposes `window.__mirror` for the browser suite. That hook is excluded from production. Test screenshots and traces are generated under `test-results/`, not deployed. Physical controller hardware, real-device thermal performance, and non-Chromium browsers need separate hardware/browser verification.
