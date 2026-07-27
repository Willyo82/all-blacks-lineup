window.ALL_BLACKS_SQUAD_PHOTO_ROOT = "assets/players/";

// Reuse existing player IDs between squad versions so additions, retained
// players, removals and injury-related unavailability compare automatically.
window.ALL_BLACKS_SQUADS = [
  {
    id: "2026-current",
    label: "Current 2026 squad",
    shortLabel: "Current squad",
    status: "released",
    announced: "2026 home season",
    compareTo: null,
    players: [
      { id: "asafo-aumua", name: "Asafo Aumua", number: 1163, unit: "front-row", role: "Hooker" },
      { id: "scott-barrett", name: "Scott Barrett", number: 1155, unit: "locks", role: "Lock" },
      { id: "george-bower", name: "George Bower", number: 1194, unit: "front-row", role: "Loosehead prop" },
      { id: "sam-darry", name: "Sam Darry", number: 1220, unit: "locks", role: "Lock" },
      { id: "ethan-de-groot", name: "Ethan de Groot", number: 1197, unit: "front-row", role: "Loosehead prop" },
      { id: "jamie-hannah", name: "Jamie Hannah", number: 1235, unit: "locks", role: "Lock" },
      { id: "fabian-holland", name: "Fabian Holland", number: 1224, unit: "locks", role: "Lock" },
      { id: "tyrel-lomax", name: "Tyrel Lomax", number: 1180, unit: "front-row", role: "Tighthead prop" },
      { id: "josh-lord", name: "Josh Lord", number: 1199, unit: "locks", role: "Lock" },
      { id: "fletcher-newell", name: "Fletcher Newell", number: 1205, unit: "front-row", role: "Tighthead prop" },
      { id: "xavier-numia", name: "Xavier Numia", number: 1233, unit: "front-row", role: "Loosehead prop" },
      { id: "samisoni-taukeiaho", name: "Samisoni Taukei’aho", number: 1198, unit: "front-row", role: "Hooker" },
      { id: "codie-taylor", name: "Codie Taylor", number: 1143, unit: "front-row", role: "Hooker" },
      { id: "pasilio-tosi", name: "Pasilio Tosi", number: 1219, unit: "front-row", role: "Prop" },
      { id: "patrick-tuipulotu", name: "Patrick Tuipulotu", number: 1133, unit: "locks", role: "Lock" },
      { id: "tupou-vaai", name: "Tupou Vaa’i", number: 1188, unit: "locks", role: "Lock" },
      { id: "tamaiti-williams", name: "Tamaiti Williams", number: 1209, unit: "front-row", role: "Prop" },

      { id: "luke-jacobson", name: "Luke Jacobson", number: 1183, unit: "loose-forwards", role: "Loose forward" },
      { id: "peter-lakai", name: "Peter Lakai", number: 1222, unit: "loose-forwards", role: "Loose forward" },
      { id: "simon-parker", name: "Simon Parker", number: 1230, unit: "loose-forwards", role: "Loose forward" },
      { id: "ardie-savea", name: "Ardie Savea", number: 1147, unit: "loose-forwards", role: "No. 8 / flanker", captain: true },
      { id: "anton-segner", name: "Anton Segner", number: 1237, unit: "loose-forwards", role: "Flanker" },
      { id: "wallace-sititi", name: "Wallace Sititi", number: 1218, unit: "loose-forwards", role: "Flanker / No. 8" },

      { id: "beauden-barrett", name: "Beauden Barrett", number: 1115, unit: "inside-backs", role: "First five-eighth" },
      { id: "jordie-barrett", name: "Jordie Barrett", number: 1159, unit: "midfield", role: "Second five-eighth" },
      { id: "anton-lienert-brown", name: "Anton Lienert-Brown", number: 1153, unit: "midfield", role: "Midfield" },
      { id: "ruben-love", name: "Ruben Love", number: 1223, unit: "inside-backs", role: "First five-eighth" },
      { id: "damian-mckenzie", name: "Damian McKenzie", number: 1154, unit: "inside-backs", role: "First five-eighth" },
      { id: "kyle-preston", name: "Kyle Preston", number: 1231, unit: "inside-backs", role: "Halfback" },
      { id: "billy-proctor", name: "Billy Proctor", number: 1215, unit: "midfield", role: "Centre" },
      { id: "cortez-ratima", name: "Cortez Ratima", number: 1214, unit: "inside-backs", role: "Halfback" },
      { id: "cameron-roigard", name: "Cameron Roigard", number: 1210, unit: "inside-backs", role: "Halfback" },

      { id: "leroy-carter", name: "Leroy Carter", number: 1232, unit: "outside-backs", role: "Wing" },
      { id: "caleb-clarke", name: "Caleb Clarke", number: 1187, unit: "outside-backs", role: "Wing" },
      { id: "leicester-faingaanuku", name: "Leicester Fainga’anuku", number: 1200, unit: "outside-backs", role: "Wing / centre" },
      { id: "fehi-fineanganofo", name: "Fehi Fineanganofo", number: 1234, unit: "outside-backs", role: "Wing" },
      { id: "will-jordan", name: "Will Jordan", number: 1191, unit: "outside-backs", role: "Wing / fullback" },
      { id: "josh-moorby", name: "Josh Moorby", number: 1236, unit: "outside-backs", role: "Wing / fullback" }
    ]
  },
  {
    id: "2026-sa-tour",
    label: "2026 South Africa tour squad",
    shortLabel: "SA tour squad",
    status: "released",
    announced: "27 July 2026",
    compareTo: "2026-current",
    unavailable: [
      { id: "tamaiti-williams", detail: "Injury" },
      { id: "scott-barrett", detail: "Injury" },
      { id: "leicester-faingaanuku", detail: "Injury" }
    ],
    players: [
      { id: "asafo-aumua", name: "Asafo Aumua", number: 1163, unit: "front-row", role: "Hooker", caps: 22 },
      { id: "codie-taylor", name: "Codie Taylor", number: 1143, unit: "front-row", role: "Hooker", caps: 109 },
      { id: "samisoni-taukeiaho", name: "Samisoni Taukei’aho", number: 1198, unit: "front-row", role: "Hooker", caps: 44 },
      { id: "george-bell", name: "George Bell", number: 1217, unit: "front-row", role: "Hooker", caps: 4 },
      { id: "ethan-de-groot", name: "Ethan de Groot", number: 1197, unit: "front-row", role: "Loosehead prop", caps: 43 },
      { id: "george-bower", name: "George Bower", number: 1194, unit: "front-row", role: "Loosehead prop", caps: 26 },
      { id: "xavier-numia", name: "Xavier Numia", number: 1233, unit: "front-row", role: "Loosehead prop", caps: 2 },
      { id: "ollie-norris", name: "Ollie Norris", number: 1227, unit: "front-row", role: "Prop", caps: 3 },
      { id: "tyrel-lomax", name: "Tyrel Lomax", number: 1180, unit: "front-row", role: "Tighthead prop", caps: 51 },
      { id: "fletcher-newell", name: "Fletcher Newell", number: 1205, unit: "front-row", role: "Tighthead prop", caps: 37 },
      { id: "pasilio-tosi", name: "Pasilio Tosi", number: 1219, unit: "front-row", role: "Prop", caps: 17 },
      { id: "siale-lauaki", name: "Siale Lauaki", number: null, unit: "front-row", role: "Prop", caps: 0, debut: true },

      { id: "tupou-vaai", name: "Tupou Vaa’i", number: 1188, unit: "locks", role: "Lock", caps: 47 },
      { id: "patrick-tuipulotu", name: "Patrick Tuipulotu", number: 1133, unit: "locks", role: "Lock", caps: 57 },
      { id: "josh-lord", name: "Josh Lord", number: 1199, unit: "locks", role: "Lock", caps: 15 },
      { id: "sam-darry", name: "Sam Darry", number: 1220, unit: "locks", role: "Lock", caps: 10 },
      { id: "fabian-holland", name: "Fabian Holland", number: 1224, unit: "locks", role: "Lock", caps: 12 },

      { id: "peter-lakai", name: "Peter Lakai", number: 1222, unit: "loose-forwards", role: "Loose forward", caps: 10 },
      { id: "simon-parker", name: "Simon Parker", number: 1230, unit: "loose-forwards", role: "Loose forward", caps: 8 },
      { id: "ethan-blackadder", name: "Ethan Blackadder", number: 1195, unit: "loose-forwards", role: "Loose forward", caps: 14 },
      { id: "luke-jacobson", name: "Luke Jacobson", number: 1183, unit: "loose-forwards", role: "Loose forward", caps: 27 },
      { id: "anton-segner", name: "Anton Segner", number: 1237, unit: "loose-forwards", role: "Flanker", caps: 2 },
      { id: "ardie-savea", name: "Ardie Savea", number: 1147, unit: "loose-forwards", role: "No. 8 / flanker", caps: 109, captain: true },
      { id: "wallace-sititi", name: "Wallace Sititi", number: 1218, unit: "loose-forwards", role: "Flanker / No. 8", caps: 21 },
      { id: "semisi-tupou-taeiloa", name: "Semisi Tupou Ta’eiloa", number: null, unit: "loose-forwards", role: "Loose forward", caps: 0, debut: true },

      { id: "cameron-roigard", name: "Cameron Roigard", number: 1210, unit: "inside-backs", role: "Halfback", caps: 20 },
      { id: "cortez-ratima", name: "Cortez Ratima", number: 1214, unit: "inside-backs", role: "Halfback", caps: 24 },
      { id: "kyle-preston", name: "Kyle Preston", number: 1231, unit: "inside-backs", role: "Halfback", caps: 1 },
      { id: "ruben-love", name: "Ruben Love", number: 1223, unit: "inside-backs", role: "First five-eighth", caps: 8 },
      { id: "beauden-barrett", name: "Beauden Barrett", number: 1115, unit: "inside-backs", role: "First five-eighth", caps: 144 },
      { id: "damian-mckenzie", name: "Damian McKenzie", number: 1154, unit: "inside-backs", role: "First five-eighth", caps: 77 },
      { id: "josh-jacomb", name: "Josh Jacomb", number: null, unit: "inside-backs", role: "First five-eighth", caps: 0, debut: true },

      { id: "jordie-barrett", name: "Jordie Barrett", number: 1159, unit: "midfield", role: "Second five-eighth", caps: 81 },
      { id: "quinn-tupaea", name: "Quinn Tupaea", number: 1193, unit: "midfield", role: "Midfield", caps: 26 },
      { id: "billy-proctor", name: "Billy Proctor", number: 1215, unit: "midfield", role: "Centre", caps: 13 },
      { id: "anton-lienert-brown", name: "Anton Lienert-Brown", number: 1153, unit: "midfield", role: "Midfield", caps: 90 },
      { id: "timoci-tavatavanawai", name: "Timoci Tavatavanawai", number: 1228, unit: "midfield", role: "Midfield", caps: 2 },

      { id: "caleb-clarke", name: "Caleb Clarke", number: 1187, unit: "outside-backs", role: "Wing", caps: 35 },
      { id: "fehi-fineanganofo", name: "Fehi Fineanganofo", number: 1234, unit: "outside-backs", role: "Wing", caps: 1 },
      { id: "leroy-carter", name: "Leroy Carter", number: 1232, unit: "outside-backs", role: "Wing", caps: 7 },
      { id: "josh-moorby", name: "Josh Moorby", number: 1236, unit: "outside-backs", role: "Wing / fullback", caps: 2 },
      { id: "will-jordan", name: "Will Jordan", number: 1191, unit: "outside-backs", role: "Wing / fullback", caps: 57 },
      { id: "rieko-ioane", name: "Rieko Ioane", number: 1156, unit: "outside-backs", role: "Wing / centre", caps: 88 },
      { id: "emoni-narawa", name: "Emoni Narawa", number: 1208, unit: "outside-backs", role: "Wing", caps: 4 }
    ]
  }
];
