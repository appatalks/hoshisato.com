const point = (x, y, name, text, kind = 'survey') => ({ x, y, name, text, kind });

export const AWAY_MISSIONS = [
  {
    id: 0,
    title: 'The Shore That Answers',
    place: 'NERIS IV / TIDAL ARCHIPELAGO',
    theme: 'garden',
    biome: 'shore',
    mechanic: 'Tides and first contact',
    rule: 'tide',
    briefing:
      'A coastline is broadcasting your name before you arrive. Follow the tidal stones and find out who taught the sea to speak.',
    ending:
      'The voice belongs to an ocean-wide intelligence. It calls you a visitor, not an Empress. You accept the distinction, for now.',
    palette: ['#235158', '#487a71', '#afd6be', '#e8c78e'],
    start: [300, 1450],
    exit: [2110, 360],
    objectives: [
      point(
        640,
        1220,
        'Tidal stone',
        'The stone records the last visitor: a ship from another century.',
      ),
      point(
        1490,
        1150,
        'Listening pool',
        'A patient voice asks why your people put borders around water.',
      ),
      point(
        1840,
        490,
        'Ocean ambassador',
        'Hoshi offers a listening channel, without an imperial seal.',
        'contact',
      ),
    ],
    walls: [
      [1050, 850, 180, 460],
      [700, 430, 560, 150],
    ],
    hazards: [[1050, 1340, 620, 210, 'tide']],
    relic: [470, 450],
    discovery:
      'NERIS / The tide keeps names, not records of rank. Yours has been added to its long, slow song.',
  },
  {
    id: 1,
    title: 'The Orchard of Borrowed Suns',
    place: 'VELOR / LIVING CANOPY',
    theme: 'garden',
    biome: 'forest',
    mechanic: 'Living paths and botanical puzzles',
    rule: 'roots',
    briefing:
      'The trees fold their paths around strangers. Imperial surveyors called it a maze. A botanist called it manners.',
    ending:
      'The orchard grows a path to your landing site. Permission, freely given, is a remarkably efficient technology.',
    palette: ['#163f36', '#42754f', '#b6d292', '#efb4bd'],
    start: [280, 1430],
    exit: [2080, 440],
    objectives: [
      point(
        540,
        1010,
        'Seed choir',
        'Three notes awaken the root network. A path unfolds to the east.',
        'grow',
      ),
      point(
        1560,
        1240,
        'Sun fruit',
        'A fruit stores enough daylight to illuminate a cabin for a year.',
        'sample',
      ),
      point(
        1930,
        600,
        'Canopy elder',
        'The elder asks that the fruit be planted, not displayed.',
        'contact',
      ),
    ],
    walls: [
      [900, 620, 160, 600],
      [1360, 380, 450, 120],
      [1430, 1430, 340, 100],
    ],
    hazards: [[1100, 680, 180, 670, 'roots']],
    relic: [480, 400],
    discovery:
      'VELOR / The oldest tree holds seeds from a world no longer on any chart. A new sapling will travel aboard the Defiant.',
  },
  {
    id: 2,
    title: 'Under the Blue Ice',
    place: 'ISEN / AURORA BASIN',
    theme: 'drift',
    biome: 'ice',
    mechanic: 'Gliding movement and lost observations',
    rule: 'ice',
    briefing:
      'An observatory under the ice is still measuring stars that vanished centuries ago. Its last astronomer has left you a route.',
    ending:
      'The observatory was looking through time. Its final image shows a future that has not yet decided what to become.',
    palette: ['#29435d', '#6f9cae', '#d3eced', '#e8acb7'],
    start: [290, 1460],
    exit: [2010, 330],
    objectives: [
      point(
        760,
        1250,
        'Buried antenna',
        'The antenna points below the horizon. These are not ordinary star charts.',
      ),
      point(
        1660,
        1060,
        'Ice lens',
        'The lens is warm. Someone has maintained it through every winter.',
        'sample',
      ),
      point(
        1510,
        360,
        'Last observation',
        'A recording asks you to leave the future unclaimed.',
        'contact',
      ),
    ],
    walls: [
      [1060, 420, 170, 760],
      [430, 690, 420, 160],
      [1570, 1320, 460, 140],
    ],
    hazards: [[480, 980, 850, 150, 'wind']],
    relic: [650, 350],
    discovery:
      'ISEN / The astronomer calculated the movement of a single snowflake. The result takes sixteen volumes.',
  },
  {
    id: 3,
    title: 'A Language Made of Rain',
    place: 'SERAL / MONSOON TERRACES',
    theme: 'relay',
    biome: 'rain',
    mechanic: 'Translation sequence and storm shelters',
    rule: 'sequence',
    briefing:
      'The inhabitants write with rainfall. Read three terraces in order, before an imperial translator declares the weather a diplomatic insult.',
    ending: 'The message reads: welcome, traveler. Your translator has been quietly updated.',
    palette: ['#1a3841', '#3d6f77', '#afd1c8', '#e5cd92'],
    start: [290, 1490],
    exit: [2140, 470],
    ordered: true,
    objectives: [
      point(
        680,
        1190,
        'First terrace',
        'The first cadence means a guest who arrives without being summoned.',
        'translate',
      ),
      point(
        1480,
        1400,
        'Second terrace',
        'The second cadence means a door held open during a storm.',
        'translate',
      ),
      point(
        1630,
        540,
        'Third terrace',
        'Together they form an invitation, not a warning.',
        'translate',
      ),
    ],
    walls: [
      [1060, 720, 170, 550],
      [480, 670, 430, 140],
      [1530, 830, 450, 130],
    ],
    hazards: [[1330, 800, 160, 430, 'vent']],
    relic: [510, 400],
    discovery:
      'SERAL / A dry terrace holds a single word: silence. It is the most respectful greeting of all.',
  },
  {
    id: 4,
    title: 'The City With No Doors',
    place: 'OCHRE PRIME / MIRAGE CITY',
    theme: 'capital',
    biome: 'desert',
    mechanic: 'Wind, false landmarks and hidden streets',
    rule: 'mirage',
    briefing:
      'Every map of the city is accurate. None of them describes the same streets. Use your scanner to separate stone from memory.',
    ending:
      'The city is a library arranged by the questions of its visitors. It has made an entire district for yours.',
    palette: ['#655458', '#ab8273', '#e7c7aa', '#8cd7d1'],
    start: [330, 1400],
    exit: [2080, 380],
    objectives: [
      point(640, 980, 'Unmoving sundial', 'The shadow belongs to a tower that is no longer here.'),
      point(
        1510,
        1180,
        'Memory square',
        'The square remembers the city before its first emperor.',
        'translate',
      ),
      point(
        1770,
        460,
        'Archivist of dust',
        'The archivist declines to index your title. Your questions are more useful.',
        'contact',
      ),
    ],
    walls: [
      [980, 730, 220, 650],
      [1320, 650, 650, 160],
      [450, 470, 480, 140],
    ],
    hazards: [[400, 1300, 1350, 200, 'wind']],
    relic: [700, 310],
    discovery:
      'OCHRE / A small street has appeared behind you. Its name translates as: the Empress changed her mind.',
  },
  {
    id: 5,
    title: 'The Night Garden',
    place: 'UMBRIEL / BIOLUMINESCENT HOLLOW',
    theme: 'web',
    biome: 'night',
    mechanic: 'Scanner light and nocturnal ecology',
    rule: 'dark',
    briefing:
      'Beneath the permanent night, a garden answers footsteps with light. Keep your scanner close. Not everything luminous is a path.',
    ending:
      'The garden recognizes the rhythm of your footsteps. It leaves a trail of light all the way home.',
    palette: ['#192037', '#31434e', '#75cebc', '#dfabd5'],
    start: [330, 1450],
    exit: [2090, 460],
    objectives: [
      point(
        710,
        1260,
        'Lantern colony',
        'These lights are a community, not a collection.',
        'sample',
      ),
      point(
        1490,
        950,
        'Sleeping river',
        'The river travels beneath the roots. Its pulse marks a safe crossing.',
      ),
      point(
        1770,
        420,
        'Moonless bloom',
        'The bloom opens only when your scanner stops asking questions.',
        'contact',
      ),
    ],
    walls: [
      [1050, 940, 170, 500],
      [600, 690, 560, 140],
      [1600, 1170, 400, 180],
    ],
    hazards: [[1200, 520, 200, 450, 'tide']],
    relic: [510, 360],
    discovery:
      'UMBRIEL / A tiny constellation grows inside a fallen branch. The crew cannot agree whether it is a map or a greeting.',
  },
  {
    id: 6,
    title: 'The Breathing Mountain',
    place: 'KHEPRI / BASALT CALDERA',
    theme: 'yard',
    biome: 'volcanic',
    mechanic: 'Timed vents and geothermal engineering',
    rule: 'vent',
    briefing:
      'A settlement has built its calendar around a mountain that breathes. Restore its pressure gauges, and do not interrupt the exhale.',
    ending:
      'The settlement has another season. Its engineers offer you a model volcano for the bridge. You accept on the condition that it is quiet.',
    palette: ['#302832', '#5a4955', '#d89580', '#efcf8b'],
    start: [300, 1490],
    exit: [2130, 410],
    objectives: [
      point(
        650,
        1110,
        'Western gauge',
        'The mountain is not becoming louder. The old gauge is becoming less accurate.',
      ),
      point(
        1510,
        1290,
        'Pressure archive',
        'Generations have recorded the same rhythm. One note is missing.',
        'translate',
      ),
      point(
        1730,
        470,
        'Caldera regulator',
        'The regulator restores the mountain to its familiar cadence.',
        'grow',
      ),
    ],
    walls: [
      [1060, 520, 170, 690],
      [1420, 720, 570, 140],
    ],
    hazards: [
      [600, 1290, 340, 130, 'vent'],
      [1280, 890, 650, 160, 'vent'],
    ],
    relic: [580, 400],
    discovery:
      'KHEPRI / The settlement names its mountains after good listeners. There is a newly named hill on the eastern horizon.',
  },
  {
    id: 7,
    title: 'The Sky Beneath Your Feet',
    place: 'AER / SUSPENDED MONASTERY',
    theme: 'throne',
    biome: 'cloud',
    mechanic: 'Crosswinds and floating causeways',
    rule: 'wind',
    briefing:
      'The monastery floats on a promise nobody remembers making. Recover its anchor songs before the islands drift out of speaking distance.',
    ending: 'The islands settle into a new arrangement. The monks insist the view has improved.',
    palette: ['#455c72', '#a5b8be', '#eef1d6', '#d8abbb'],
    start: [310, 1430],
    exit: [2110, 360],
    objectives: [
      point(
        730,
        1240,
        'First anchor',
        'The anchor is a resonant stone. Weight is not what holds this place together.',
      ),
      point(
        1530,
        1110,
        'Wind cloister',
        'A monk lends you a song with a very practical chorus.',
        'contact',
      ),
      point(
        1740,
        410,
        'Horizon bell',
        'The bell reminds the islands where the others are.',
        'translate',
      ),
    ],
    walls: [
      [1040, 710, 180, 570],
      [500, 670, 450, 130],
      [1620, 720, 400, 180],
    ],
    hazards: [[1260, 650, 200, 750, 'wind']],
    relic: [620, 360],
    discovery:
      'AER / A single empty chair faces the horizon. The monastery has been expecting a visitor who does not yet exist.',
  },
  {
    id: 8,
    title: 'Someone Else Remembers',
    place: 'PALIMPSEST / RESONANT RUINS',
    theme: 'lab',
    biome: 'ruins',
    mechanic: 'Memory order and adaptive architecture',
    rule: 'sequence',
    ordered: true,
    briefing:
      'Your communicator contains a message you have not recorded yet. Follow its coordinates, and resist the urge to correct your own tone.',
    ending: 'The message was not a command. It was a reminder: leave the door open. You do.',
    palette: ['#294049', '#68848a', '#c3d3b9', '#dca6ad'],
    start: [290, 1440],
    exit: [2130, 450],
    objectives: [
      point(
        560,
        1060,
        'Yesterday chamber',
        'Your own voice says: start with the smallest room.',
        'translate',
      ),
      point(
        1480,
        1410,
        'Tomorrow chamber',
        'Your own voice says: the answer is not a possession.',
        'translate',
      ),
      point(
        1640,
        480,
        'Unwritten chamber',
        'This time, you leave the recording for whoever arrives next.',
        'translate',
      ),
    ],
    walls: [
      [880, 560, 180, 780],
      [1280, 730, 650, 130],
    ],
    hazards: [[1130, 870, 160, 480, 'roots']],
    relic: [630, 350],
    discovery:
      'PALIMPSEST / The records contain a thousand versions of the same meeting. In every one, someone chooses to listen.',
  },
  {
    id: 9,
    title: 'The World Between Crowns',
    place: 'VESPER / ECLIPSE SANCTUARY',
    theme: 'home',
    biome: 'eclipse',
    mechanic: 'Eclipse windows and first-contact diplomacy',
    rule: 'eclipse',
    briefing:
      'For seven minutes, two suns share a shadow. The sanctuary opens for neither emperor nor empire. Arrive as yourself.',
    ending:
      'The sanctuary offers no allegiance. It offers an invitation to return. Hoshi files it somewhere more important than the imperial treaties.',
    palette: ['#312e45', '#65657c', '#bbbccb', '#e7c48c'],
    start: [320, 1430],
    exit: [2080, 410],
    objectives: [
      point(
        680,
        1140,
        'Eastern shadow',
        'The first sun marks a boundary nobody has ever enforced.',
      ),
      point(1530, 1250, 'Western shadow', 'The second sun marks a meeting place.', 'sample'),
      point(
        1720,
        460,
        'The unclaimed seat',
        'Hoshi waits for the shared shadow, then answers without a title.',
        'contact',
      ),
    ],
    walls: [
      [1040, 620, 180, 680],
      [1420, 760, 540, 140],
    ],
    hazards: [[1380, 340, 160, 390, 'eclipse']],
    relic: [610, 370],
    discovery:
      'VESPER / An empty space is reserved on the sanctuary wall. It is not for a portrait. It is for the next question.',
  },
].map((mission) => ({ ...mission, collection: 'away', width: 2400, height: 1800 }));

export const SHUTTLE_MISSIONS = [
  {
    id: 0,
    title: 'A Different Kind of Helm',
    place: 'SOL / IMPERIAL TRAINING CORRIDOR',
    theme: 'defiant',
    biome: 'orbit',
    rule: 'training',
    mechanic: 'Thrust, drift and precision docking',
    start: [300, 1400],
    exit: [2100, 360],
    briefing:
      'Take the Mirror Enterprise through its navigation trials. A crown does not exempt anyone from learning the brakes.',
    ending:
      'The dockmaster approves your approach. He has also stopped calling you a visiting dignitary.',
    objectives: [
      point(
        700,
        1200,
        'Navigation buoy',
        'Course correction logged. Momentum carries on after thrust stops.',
        'ring',
      ),
      point(
        1430,
        1020,
        'Calibration station',
        'Instruments synchronized. Slow to docking speed before making contact.',
        'dock',
      ),
      point(
        1800,
        530,
        'Final alignment',
        'Alignment confirmed. The return corridor is open.',
        'ring',
      ),
    ],
    rocks: 12,
    fields: [],
    relic: [500, 450],
    discovery:
      'SOL / A pre-imperial flight manual says exactly the same thing: a good landing is a patient one.',
  },
  {
    id: 1,
    title: 'A Thread Through Stone',
    place: 'CINDER BELT / SURVEY SECTOR',
    theme: 'yard',
    biome: 'belt',
    rule: 'asteroids',
    mechanic: 'Asteroid slalom and close surveys',
    start: [270, 1420],
    exit: [2110, 390],
    briefing:
      'A shortcut through the belt could connect three isolated outposts. Chart it without turning a survey into a spectacle.',
    ending: "The new corridor is narrow, safe, and entirely absent from the admirals' maps.",
    objectives: [
      point(
        620,
        1030,
        'Inner marker',
        'The belt rotates around an empty center. Something moved long ago.',
        'survey',
      ),
      point(
        1470,
        1320,
        'Sheltered waypoint',
        'An old service route remains clear beneath the larger rocks.',
        'ring',
      ),
      point(
        1760,
        440,
        'Outer marker',
        'The survey is complete. Three outposts now have a way home.',
        'survey',
      ),
    ],
    rocks: 48,
    fields: [],
    relic: [480, 350],
    discovery:
      'CINDER / A small rock carries a carved star chart. Someone made this crossing before there were engines.',
  },
  {
    id: 2,
    title: 'Lights in the Fog',
    place: 'LACUNA / NEBULAR RESCUE',
    theme: 'web',
    biome: 'nebula',
    rule: 'rescue',
    mechanic: 'Sensor pulses and rescue rendezvous',
    start: [320, 1440],
    exit: [2090, 370],
    briefing:
      'Three survey crews lost their bearings in the nebula. Find their capsules and bring everyone back to the docking tender.',
    ending:
      'All crews accounted for. One asks whether an Empress normally makes her own rescue calls. You do not answer.',
    objectives: [
      point(
        680,
        1130,
        'Capsule Aster',
        'Two researchers aboard. They saved their samples and their sandwiches.',
        'rescue',
      ),
      point(
        1480,
        1360,
        'Capsule Vela',
        'One navigator aboard. She has been mapping the fog by sound.',
        'rescue',
      ),
      point(1730, 430, 'Capsule Lyra', 'The last crew is safe. Return to the tender.', 'rescue'),
    ],
    rocks: 18,
    fields: [[1000, 830, 200, 'fog']],
    relic: [500, 370],
    discovery:
      'LACUNA / The lost crews recorded a repeating signal inside the fog. It sounds like a welcome.',
  },
  {
    id: 3,
    title: 'The Weight of a Promise',
    place: 'PELAGIC / FREIGHT APPROACH',
    theme: 'relay',
    biome: 'cargo',
    rule: 'tow',
    mechanic: 'Tractor towing and low-speed transfers',
    start: [290, 1410],
    exit: [2130, 400],
    briefing:
      'An atmospheric processor is stranded outside its colony. Establish a tractor link, mind the added mass, and deliver the sky.',
    ending:
      'The colony opens its first outdoor garden. The manifest describes your contribution as one atmosphere, delivered intact.',
    objectives: [
      point(
        650,
        1160,
        'Processor crate',
        'Tractor link engaged. The extra mass changes your turning and braking.',
        'tow',
      ),
      point(
        1500,
        1190,
        'Transfer station',
        'The processor is secured. Handling is back to normal.',
        'deliver',
      ),
      point(
        1760,
        500,
        'Colony confirmation',
        'Atmospheric startup confirmed. The colony sends its thanks.',
        'dock',
      ),
    ],
    ordered: true,
    rocks: 24,
    fields: [],
    relic: [460, 460],
    discovery:
      'PELAGIC / The crate contains a seed tucked under the inspection label. The engineers planned ahead.',
  },
  {
    id: 4,
    title: 'Around the Quiet Giant',
    place: 'ORISON / GRAVITY SURVEY',
    theme: 'throne',
    biome: 'gravity',
    rule: 'gravity',
    mechanic: 'Gravity wells and curved approaches',
    start: [270, 1450],
    exit: [2120, 380],
    briefing:
      'An unlit star bends every straight line in this sector. Set the survey beacons and use its pull rather than arguing with it.',
    ending:
      'The beacons describe an elegant curve. Hoshi orders the route named after the navigator, not herself.',
    objectives: [
      point(650, 1110, 'Near-field beacon', "The first beacon reveals the well's edge.", 'survey'),
      point(
        1500,
        1370,
        'Periapsis buoy',
        'The approach uses less thrust when you follow the curve.',
        'ring',
      ),
      point(1750, 470, 'Far-field beacon', 'The navigation model is complete.', 'survey'),
    ],
    rocks: 12,
    fields: [[1180, 800, 280, 'gravity']],
    relic: [550, 330],
    discovery:
      'ORISON / A tiny moon circles the dark star once every eleven minutes. It has done so without a name for millennia.',
  },
  {
    id: 5,
    title: 'The Long Way Home',
    place: 'AVEN / CIVILIAN CONVOY',
    theme: 'capital',
    biome: 'convoy',
    rule: 'escort',
    mechanic: 'Escort pacing and navigation support',
    start: [310, 1460],
    exit: [2110, 410],
    briefing:
      'A freighter captain has requested an escort, not a commander. Keep nearby, clear the route signals, and let her set the pace.',
    ending:
      'The freighter arrives on schedule. Its captain invites you for coffee, on the condition that you leave your title at the airlock.',
    objectives: [
      point(
        690,
        1200,
        'Convoy rendezvous',
        'Escort handshake accepted. The freighter follows while you remain nearby.',
        'escort',
      ),
      point(
        1460,
        1110,
        'Channel checkpoint',
        'Both vessels are together. The narrow channel is behind you.',
        'escort-check',
      ),
      point(
        1800,
        500,
        'Arrival handover',
        'The civilian pilot has the approach. Escort complete.',
        'escort-check',
      ),
    ],
    ordered: true,
    rocks: 23,
    fields: [],
    relic: [490, 400],
    discovery:
      "AVEN / The freighter's hold contains musical instruments. The colony has waited a very long time for its orchestra.",
  },
  {
    id: 6,
    title: 'A Courtesy of Shadows',
    place: 'VEIL / DISPUTED TRANSIT',
    theme: 'home',
    biome: 'patrol',
    rule: 'stealth',
    mechanic: 'Patrol evasion and signal decoys',
    start: [300, 1470],
    exit: [2120, 360],
    briefing:
      'Rival traffic monitors have closed a perfectly legal corridor. Cross quietly. A sensor decoy may be more persuasive than a complaint.',
    ending: 'Your flight plan is stamped approved. Nobody is quite certain who approved it.',
    objectives: [
      point(
        650,
        1210,
        'Silent transponder',
        'Your signature is now a very uninteresting weather probe.',
        'survey',
      ),
      point(
        1440,
        1350,
        'Unlisted corridor',
        'The patrol has taken an interest in your decoy instead.',
        'ring',
      ),
      point(1780, 490, 'Departure seal', 'Exit clearance confirmed. No argument required.', 'dock'),
    ],
    rocks: 19,
    fields: [],
    patrols: [
      [1070, 1000],
      [1710, 850],
    ],
    relic: [530, 400],
    discovery:
      'VEIL / The restricted route was once a public ferry lane. Your navigator restores its original name.',
  },
  {
    id: 7,
    title: 'Sailing the Aurora',
    place: 'ION SEA / MAGNETIC FRONT',
    theme: 'drift',
    biome: 'ion',
    rule: 'current',
    mechanic: 'Ion currents and field calibration',
    start: [280, 1430],
    exit: [2130, 390],
    briefing:
      'The ion front carries ships like a river carries leaves. Calibrate its navigation array, and find a course through the current.',
    ending:
      'The array paints a safe passage across the aurora. It is visible from the observation deck for three nights.',
    objectives: [
      point(
        650,
        1190,
        'Current vane',
        'The vane shows a crosswind between the two ion bands.',
        'survey',
      ),
      point(
        1460,
        1300,
        'Field sampler',
        'The sampler is full of light. Engineering insists that is a technical description.',
        'dock',
      ),
      point(
        1740,
        470,
        'Aurora gate',
        'The field is charted. The current will carry you to the exit.',
        'ring',
      ),
    ],
    rocks: 15,
    fields: [
      [1070, 880, 300, 'current'],
      [1760, 1090, 230, 'current'],
    ],
    relic: [500, 380],
    discovery:
      "ION SEA / Beneath the interference is a pulse that matches the Defiant's new garden lighting.",
  },
  {
    id: 8,
    title: 'The Empress Takes the Outside Line',
    place: 'MERIDIAN / ORBITAL REGATTA',
    theme: 'yard',
    biome: 'race',
    rule: 'race',
    mechanic: 'Ordered racing gates and clean turns',
    start: [300, 1420],
    exit: [2110, 400],
    briefing:
      'The regatta has one rule: everyone flies the same course. Hoshi finds the idea refreshing. Set a time worth remembering.',
    ending:
      'The judges record your time under Hoshi, without the title. You request a copy for the bridge.',
    objectives: [
      point(620, 1030, 'Gate one', 'A clean entry into the first bend.', 'ring'),
      point(1160, 480, 'Gate two', 'The outer line gives you room to turn.', 'ring'),
      point(1710, 1270, 'Gate three', 'The long descent is behind you.', 'ring'),
      point(1950, 540, 'Finish gate', 'Course complete. Your time is recorded.', 'ring'),
    ],
    ordered: true,
    rocks: 26,
    fields: [],
    relic: [440, 360],
    discovery:
      'MERIDIAN / The oldest trophy is a teacup. The original organizers could not afford anything else.',
  },
  {
    id: 9,
    title: 'The Door Beyond the Map',
    place: 'JANUS / MIRROR PASSAGE',
    theme: 'lab',
    biome: 'rift',
    rule: 'rift',
    mechanic: 'Anomaly windows and precision return',
    start: [300, 1450],
    exit: [2110, 370],
    briefing:
      'A quiet aperture opens between familiar stars. Anchor both sides, read what lies within, and leave a route for the next explorer.',
    ending:
      'The aperture closes gently behind you. On the other side, another ship has begun to answer your greeting.',
    objectives: [
      point(660, 1220, 'Near anchor', 'The first anchor holds the local coordinates.', 'dock'),
      point(1480, 1130, 'Far anchor', 'The second anchor hears a different sky.', 'dock'),
      point(
        1790,
        470,
        'Mirror aperture',
        'A greeting crosses the boundary. Return before the next window closes.',
        'survey',
      ),
    ],
    ordered: true,
    rocks: 22,
    fields: [
      [1160, 720, 210, 'gravity'],
      [1840, 790, 160, 'rift'],
    ],
    relic: [470, 350],
    discovery:
      'JANUS / The reply contains no coordinates. Only a name, and the sound of someone relieved to be heard.',
  },
].map((mission) => ({
  ...mission,
  collection: 'shuttle',
  width: 2400,
  height: 1800,
  palette: ['#101822', '#344354', '#a1cbd3', '#e9c68e'],
}));

export const COLLECTIONS = {
  away: {
    name: 'Away Missions',
    subtitle: 'TEN WORLDS / PLANETARY EXPLORATION',
    missions: AWAY_MISSIONS,
  },
  shuttle: {
    name: 'Shuttle Bay',
    subtitle: 'MIRROR ENTERPRISE / FLIGHT OPERATIONS',
    missions: SHUTTLE_MISSIONS,
  },
};

export function expedition(collection, id) {
  return COLLECTIONS[collection]?.missions[id];
}

export function objectiveReady(mission, index, completed) {
  return (
    !mission.ordered ||
    mission.objectives.slice(0, index).every((_, previous) => completed.includes(previous))
  );
}
