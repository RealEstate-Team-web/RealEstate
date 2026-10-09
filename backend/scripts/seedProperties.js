require("dotenv").config();
const { pool, query } = require("../config/db.config");

// Demo/seed data for development and testing.
//
// Conventions:
// - Reference data (categories, amenities) is ensured with INSERT IGNORE so
//   re-running never duplicates rows (same approach as seedCategories.js and
//   seedAmenities.js).
// - Demo agents are identified by email (see seedAgents.js) and demo
//   properties by title, so this script is safe to run repeatedly.
// - Cloudinary is NOT used for seed images: property_images.public_id stays
//   empty (the column is NOT NULL, and empty public ids are filtered out by
//   the Cloudinary cleanup paths, which drop falsy ids).
//
// Run:  node scripts/seedAgents.js && node scripts/seedProperties.js

const CATEGORIES = [
  { name: "Apartment", description: "Flats and apartments for sale or rent." },
  { name: "Villa", description: "Luxury villas and standalone houses." },
  { name: "House", description: "Family houses and townhouses." },
  { name: "Commercial", description: "Offices, shops, and commercial spaces." },
  { name: "Land", description: "Plots and land parcels." },
];

const AMENITIES = [
  "Parking",
  "Wi-Fi",
  "Swimming Pool",
  "Gym",
  "Balcony",
  "Elevator",
  "Furnished",
  "Garden",
  "Air Conditioning",
  "Security System",
  "Backup Power",
  "Water Tank",
];

const DEMO_AGENT_PASSWORD = "Agent@123";

const IMAGE_QUERY = "?auto=format&fit=crop&w=1400&q=80";

// Every photo id below was verified to return HTTP 200 from images.unsplash.com.
const IMAGE_POOLS = {
  house: [
    "photo-1568605114967-8130f3a36994",
    "photo-1570129477492-45c003edd2be",
    "photo-1600596542815-ffad4c1539a9",
    "photo-1564013799919-ab600027ffc6",
    "photo-1512917774080-9991f1c4c750",
    "photo-1580587771525-78b9dba3b914",
    "photo-1592595896551-12b371d546d5",
    "photo-1449844908441-8829872d2607",
    "photo-1523217582562-09d0def993a6",
    "photo-1605276374104-dee2a0ed3cd6",
    "photo-1613490493576-7fde63acd811",
    "photo-1600585154340-be6161a56a0c",
  ],
  apartment: [
    "photo-1545324418-cc1a3fa10c00",
    "photo-1460317442991-0ec209397118",
    "photo-1575517111478-7f6afd0973db",
    "photo-1560185007-cde436f6a4d0",
    "photo-1560448204-e02f11c3d0e2",
    "photo-1487958449943-2429e8be8625",
  ],
  office: [
    "photo-1497366216548-37526070297c",
    "photo-1497366754035-f200968a6e72",
    "photo-1497366811353-6870744d04b2",
    "photo-1524758631624-e2822e304c36",
    "photo-1497366858526-0766cadbe8fa",
    "photo-1556761175-5973dc0f32e7",
    "photo-1554435493-93422e8220c8",
  ],
  commercial: [
    "photo-1486406146926-c627a92ad1ab",
    "photo-1541123437800-1bb1317badc2",
    "photo-1460317442991-0ec209397118",
    "photo-1487958449943-2429e8be8625",
    "photo-1497366216548-37526070297c",
    "photo-1497366754035-f200968a6e72",
  ],
  land: [
    "photo-1500382017468-9049fed747ef",
    "photo-1416879595882-3373a0480b5b",
    "photo-1500076656116-558758c991c1",
    "photo-1441974231531-c6227db76b6e",
  ],
  living: [
    "photo-1600210492486-724fe5c67fb0",
    "photo-1600607687939-ce8a6c25118c",
    "photo-1493809842364-78817add7ffb",
    "photo-1522708323590-d24dbb6b0267",
    "photo-1586023492125-27b2c045efd7",
    "photo-1502672260266-1c1ef2d93688",
    "photo-1600607687920-4e2a09cf159d",
    "photo-1616486338812-3dadae4b4ace",
    "photo-1618221195710-dd6b41faaea6",
    "photo-1615874959474-d609969a20ed",
    "photo-1600566752355-35792bedcfea",
    "photo-1598928506311-c55ded91a20c",
  ],
  bedroom: [
    "photo-1600566753086-00f18fb6b3ea",
    "photo-1600566753190-17f0baa2a6c3",
    "photo-1522771739844-6a9f6d5f14af",
    "photo-1505691938895-1758d7feb511",
    "photo-1616594039964-ae9021a400a0",
    "photo-1617104678098-de229db51175",
    "photo-1617806118233-18e1de247200",
    "photo-1616137466211-f939a420be84",
  ],
  kitchen: [
    "photo-1600489000022-c2086d79f9d4",
    "photo-1556911220-bff31c812dba",
    "photo-1484154218962-a197022b5858",
    "photo-1556909212-d5b604d0c90d",
    "photo-1600585154526-990dced4db0d",
    "photo-1556228453-efd6c1ff04f6",
  ],
  bathroom: [
    "photo-1584622650111-993a426fbf0a",
    "photo-1600573472550-8090b5e0745e",
    "photo-1600047509807-ba8f99d2cdde",
    "photo-1600566752229-250ed79470f8",
  ],
};

const RESIDENTIAL_INTERIORS = [
  ...IMAGE_POOLS.living,
  ...IMAGE_POOLS.bedroom,
  ...IMAGE_POOLS.kitchen,
  ...IMAGE_POOLS.bathroom,
];

const COVER_POOLS = {
  house: IMAGE_POOLS.house,
  villa: IMAGE_POOLS.house,
  apartment: IMAGE_POOLS.apartment,
  office: IMAGE_POOLS.office,
  commercial: IMAGE_POOLS.commercial,
  land: IMAGE_POOLS.land,
};

const INTERIOR_POOLS = {
  house: RESIDENTIAL_INTERIORS,
  villa: RESIDENTIAL_INTERIORS,
  apartment: RESIDENTIAL_INTERIORS,
  office: [...IMAGE_POOLS.office, ...IMAGE_POOLS.living],
  commercial: [...IMAGE_POOLS.commercial, ...IMAGE_POOLS.office],
  land: IMAGE_POOLS.land,
};

const PROPERTIES = [
  // --- Hana Tesfaye (4) ---
  {
    agentEmail: "hana.tesfaye@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Modern 3-Bedroom Apartment in Bole",
    description:
      "Well-finished three-bedroom apartment on the fourth floor of a gated building in Bole, a short walk from Medhanialem. Large balconies, natural light throughout, and secure parking for two cars.",
    listingType: "rent",
    price: 65000,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    area: 165,
    city: "Addis Ababa",
    address: "Bole, near Medhanialem Church",
    latitude: 8.9989,
    longitude: 38.787,
    status: "available",
    amenities: ["Parking", "Wi-Fi", "Elevator", "Security System", "Backup Power", "Balcony"],
  },
  {
    agentEmail: "hana.tesfaye@betenya.com",
    category: "House",
    kind: "house",
    title: "Spacious Family House in Ayat",
    description:
      "Four-bedroom family house in a quiet Ayat neighbourhood, ideal for a growing family. Separate dining and living areas, a small garden, and reliable water supply.",
    listingType: "sale",
    price: 14500000,
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 2,
    area: 280,
    city: "Addis Ababa",
    address: "Ayat, Zone 4",
    latitude: 9.004,
    longitude: 38.843,
    status: "available",
    amenities: ["Parking", "Garden", "Security System", "Backup Power", "Water Tank"],
  },
  {
    agentEmail: "hana.tesfaye@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Furnished 2-Bedroom Apartment Near Megenagna",
    description:
      "Fully furnished two-bedroom apartment minutes from Megenagna square, close to restaurants, banks, and the light rail. Ready to move in with modern furniture and appliances.",
    listingType: "rent",
    price: 45000,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 110,
    city: "Addis Ababa",
    address: "Megenagna, behind Zefmesh Grand Mall",
    latitude: 9.01,
    longitude: 38.801,
    status: "available",
    amenities: ["Furnished", "Wi-Fi", "Parking", "Air Conditioning", "Security System", "Elevator"],
  },
  {
    agentEmail: "hana.tesfaye@betenya.com",
    category: "House",
    kind: "house",
    title: "Family House for Rent in Yeka",
    description:
      "Three-bedroom house available for long-term rent in Yeka, with a compound, guest room, and easy access to the Ring Road. Suitable for a family or shared housing.",
    listingType: "rent",
    price: 38000,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 140,
    city: "Addis Ababa",
    address: "Yeka, near Welcome Hotel",
    latitude: 9.037,
    longitude: 38.774,
    status: "available",
    amenities: ["Parking", "Garden", "Water Tank", "Security System"],
  },

  // --- Dawit Bekele (5, villas) ---
  {
    agentEmail: "dawit.bekele@betenya.com",
    category: "Villa",
    kind: "villa",
    title: "Luxury 5-Bedroom Villa in Old Airport",
    description:
      "Premium five-bedroom villa on a large plot in the Old Airport area, with ensuite bedrooms, a private garden, and staff quarters. One of the most sought-after addresses in Addis Ababa.",
    listingType: "sale",
    price: 68000000,
    bedrooms: 5,
    bathrooms: 5,
    parkingSpaces: 3,
    area: 520,
    city: "Addis Ababa",
    address: "Old Airport, Serbita Street",
    latitude: 9.002,
    longitude: 38.745,
    status: "available",
    amenities: ["Parking", "Garden", "Swimming Pool", "Security System", "Backup Power", "Air Conditioning"],
  },
  {
    agentEmail: "dawit.bekele@betenya.com",
    category: "Villa",
    kind: "villa",
    title: "Modern 4-Bedroom Villa in Bole Rwanda",
    description:
      "Contemporary villa with clean architectural lines, floor-to-ceiling windows, and a landscaped yard in Bole Rwanda. Includes a home office and a two-car garage.",
    listingType: "sale",
    price: 42000000,
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 2,
    area: 400,
    city: "Addis Ababa",
    address: "Bole Rwanda, behind Friendship Centre",
    latitude: 8.9912,
    longitude: 38.7855,
    status: "available",
    amenities: ["Parking", "Garden", "Security System", "Backup Power", "Balcony", "Water Tank"],
  },
  {
    agentEmail: "dawit.bekele@betenya.com",
    category: "Villa",
    kind: "villa",
    title: "Elegant Villa for Rent in Ayat",
    description:
      "Four-bedroom villa available for yearly rent in Ayat, fully gated with 24-hour security. Spacious living rooms, a fitted kitchen, and a covered parking area.",
    listingType: "rent",
    price: 120000,
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 2,
    area: 380,
    city: "Addis Ababa",
    address: "Ayat, Zone 2",
    latitude: 9.0015,
    longitude: 38.8395,
    status: "rented",
    amenities: ["Parking", "Garden", "Security System", "Backup Power", "Water Tank", "Air Conditioning"],
  },
  {
    agentEmail: "dawit.bekele@betenya.com",
    category: "Villa",
    kind: "villa",
    title: "Hillside Villa with Panoramic View in Yeka",
    description:
      "Five-bedroom hillside villa overlooking the city, with terraces on two levels and a private garden. Quiet location yet only fifteen minutes from the city centre.",
    listingType: "sale",
    price: 55000000,
    bedrooms: 5,
    bathrooms: 4,
    parkingSpaces: 3,
    area: 460,
    city: "Addis Ababa",
    address: "Yeka, Hillside Road",
    latitude: 9.0455,
    longitude: 38.796,
    status: "available",
    amenities: ["Parking", "Garden", "Swimming Pool", "Security System", "Backup Power"],
  },
  {
    agentEmail: "dawit.bekele@betenya.com",
    category: "Villa",
    kind: "villa",
    title: "Gated Compound Villa in CMC",
    description:
      "Six-bedroom villa inside a secure gated compound in CMC, with an ensuite master bedroom, family lounge, and space for a home cinema. Ideal for diplomatic or corporate rental.",
    listingType: "sale",
    price: 75000000,
    bedrooms: 6,
    bathrooms: 5,
    parkingSpaces: 4,
    area: 620,
    city: "Addis Ababa",
    address: "CMC, Sunshine Site",
    latitude: 8.997,
    longitude: 38.797,
    status: "available",
    amenities: ["Parking", "Garden", "Swimming Pool", "Gym", "Security System", "Elevator", "Backup Power"],
  },

  // --- Meron Alemu (5, rentals) ---
  {
    agentEmail: "meron.alemu@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Cozy Studio Apartment in Kazanchis",
    description:
      "Compact studio apartment in Kazanchis, perfect for a single professional. The building has a backup generator and constant water, within walking distance of Africa Avenue.",
    listingType: "rent",
    price: 18000,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 0,
    area: 45,
    city: "Addis Ababa",
    address: "Kazanchis, near Unity Park",
    latitude: 9.015,
    longitude: 38.762,
    status: "available",
    amenities: ["Wi-Fi", "Security System", "Backup Power", "Water Tank"],
  },
  {
    agentEmail: "meron.alemu@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Bright 2-Bedroom Apartment in Gerji",
    description:
      "Sunlit two-bedroom apartment on the second floor of a newly painted building in Gerji. Close to supermarkets and the main road, with secure parking.",
    listingType: "rent",
    price: 28000,
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 1,
    area: 90,
    city: "Addis Ababa",
    address: "Gerji, near Bole Road junction",
    latitude: 9.0135,
    longitude: 38.7495,
    status: "available",
    amenities: ["Parking", "Balcony", "Water Tank", "Security System"],
  },
  {
    agentEmail: "meron.alemu@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Affordable 1-Bedroom Apartment in Jemo",
    description:
      "One-bedroom apartment in a well-managed building in Jemo, suitable for students or young professionals. Water tank and generator are included in the rent.",
    listingType: "rent",
    price: 15000,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 0,
    area: 55,
    city: "Addis Ababa",
    address: "Jemo, Block 25",
    latitude: 8.9885,
    longitude: 38.7615,
    status: "rented",
    amenities: ["Water Tank", "Backup Power", "Security System"],
  },
  {
    agentEmail: "meron.alemu@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Serviced 3-Bedroom Apartment in Summit",
    description:
      "Serviced three-bedroom apartment in Summit with housekeeping available on request. The building includes a gym and elevator, close to several international schools.",
    listingType: "rent",
    price: 72000,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    area: 175,
    city: "Addis Ababa",
    address: "Summit, Summit Square",
    latitude: 9.0245,
    longitude: 38.768,
    status: "available",
    amenities: ["Gym", "Elevator", "Parking", "Wi-Fi", "Security System", "Air Conditioning"],
  },
  {
    agentEmail: "meron.alemu@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Modern Condominium in Ayat, 2-Bedroom",
    description:
      "Two-bedroom condominium unit in a new Ayat development, with an open-plan living and dining area and a balcony facing the green space.",
    listingType: "rent",
    price: 32000,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 95,
    city: "Addis Ababa",
    address: "Ayat, Roundabout Area",
    latitude: 9.0055,
    longitude: 38.8455,
    status: "available",
    amenities: ["Parking", "Balcony", "Security System", "Water Tank"],
  },

  // --- Abel Girma (4, Adama commercial) ---
  {
    agentEmail: "abel.girma@betenya.com",
    category: "Commercial",
    kind: "office",
    title: "Modern Office for Rent in Adama",
    description:
      "Open-plan office on the first floor of a modern building on Africa Avenue, Adama. Suitable for a small company, with a reception area and two meeting rooms.",
    listingType: "rent",
    price: 26000,
    bedrooms: null,
    bathrooms: 2,
    parkingSpaces: 3,
    area: 140,
    city: "Adama",
    address: "Africa Avenue, Adama",
    latitude: 8.54,
    longitude: 39.27,
    status: "available",
    amenities: ["Parking", "Wi-Fi", "Air Conditioning", "Security System", "Backup Power"],
  },
  {
    agentEmail: "abel.girma@betenya.com",
    category: "Commercial",
    kind: "commercial",
    title: "Commercial Building for Sale in Adama",
    description:
      "Two-storey commercial building on a main road in Adama with ground-floor retail space and offices above. Strong foot traffic and high visibility for investors.",
    listingType: "sale",
    price: 24000000,
    bedrooms: null,
    bathrooms: 4,
    parkingSpaces: 6,
    area: 520,
    city: "Adama",
    address: "Nazareth Road, Adama",
    latitude: 8.5565,
    longitude: 39.2835,
    status: "available",
    amenities: ["Parking", "Security System", "Backup Power", "Water Tank"],
  },
  {
    agentEmail: "abel.girma@betenya.com",
    category: "Commercial",
    kind: "commercial",
    title: "Retail Shop for Rent on Africa Avenue",
    description:
      "Ground-floor retail shop of 60 square metres on Africa Avenue, ideal for a boutique, pharmacy, or electronics store. High pedestrian traffic all week.",
    listingType: "rent",
    price: 22000,
    bedrooms: null,
    bathrooms: 1,
    parkingSpaces: 1,
    area: 60,
    city: "Adama",
    address: "Africa Avenue, Shop 4",
    latitude: 8.5415,
    longitude: 39.2715,
    status: "available",
    amenities: ["Security System", "Backup Power"],
  },
  {
    agentEmail: "abel.girma@betenya.com",
    category: "Commercial",
    kind: "commercial",
    title: "Warehouse for Rent near Adama Industrial Park",
    description:
      "Clear-span warehouse of 800 square metres with roller shutter access, an office block, and yard space, a few minutes from the industrial park.",
    listingType: "rent",
    price: 65000,
    bedrooms: null,
    bathrooms: 2,
    parkingSpaces: 8,
    area: 800,
    city: "Adama",
    address: "Industrial Park Road, Adama",
    latitude: 8.5495,
    longitude: 39.3045,
    status: "available",
    amenities: ["Parking", "Security System", "Water Tank", "Backup Power"],
  },

  // --- Sara Getachew (4, land) ---
  {
    agentEmail: "sara.getachew@betenya.com",
    category: "Land",
    kind: "land",
    title: "Residential Plot for Sale in Hawassa",
    description:
      "600 square metre residential plot in a developing part of Hawassa, fully fenced with a title deed ready for transfer. Water and electricity are available at the boundary.",
    listingType: "sale",
    price: 3200000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 600,
    city: "Hawassa",
    address: "Tabor Area, Hawassa",
    latitude: 7.0621,
    longitude: 38.4765,
    status: "available",
    amenities: [],
  },
  {
    agentEmail: "sara.getachew@betenya.com",
    category: "Land",
    kind: "land",
    title: "Large Plot with Lake View in Hawassa",
    description:
      "1,500 square metre plot along the lake corridor in Hawassa, suitable for a resort, villa compound, or apartment project. Unobstructed views of the water.",
    listingType: "sale",
    price: 6800000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 1500,
    city: "Hawassa",
    address: "Lake Corridor, Hawassa",
    latitude: 7.0585,
    longitude: 38.4695,
    status: "available",
    amenities: [],
  },
  {
    agentEmail: "sara.getachew@betenya.com",
    category: "Land",
    kind: "land",
    title: "500m² Plot for Sale in Bishoftu",
    description:
      "Level 500 square metre plot in Bishoftu, ten minutes from the town centre and close to the new bypass. Clean documents, ready for immediate purchase.",
    listingType: "sale",
    price: 2850000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 500,
    city: "Bishoftu",
    address: "Bishoftu, near Kersa Road",
    latitude: 8.75,
    longitude: 38.98,
    status: "available",
    amenities: [],
  },
  {
    agentEmail: "sara.getachew@betenya.com",
    category: "Land",
    kind: "land",
    title: "Farm Land for Sale near Bishoftu",
    description:
      "Five thousand square metres of fertile farm land on the outskirts of Bishoftu, with road frontage. Suitable for greenhouse farming or a country residence.",
    listingType: "sale",
    price: 4500000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 5000,
    city: "Bishoftu",
    address: "Bishoftu, Debre Zeit Road",
    latitude: 8.7385,
    longitude: 38.9615,
    status: "available",
    amenities: [],
  },

  // --- Natnael Haile (4, new developments) ---
  {
    agentEmail: "natnael.haile@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Newly Built 1-Bedroom Studio in Lamberet",
    description:
      "Brand-new studio unit in a recently completed building in Lamberet. Modern kitchenette, tiled floors, and elevator access; an ideal first purchase.",
    listingType: "sale",
    price: 2350000,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 1,
    area: 48,
    city: "Addis Ababa",
    address: "Lamberet, New Building",
    latitude: 8.9955,
    longitude: 38.737,
    status: "available",
    amenities: ["Elevator", "Security System", "Backup Power", "Parking"],
  },
  {
    agentEmail: "natnael.haile@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "2-Bedroom Condominium for Sale in Saris",
    description:
      "Two-bedroom condominium in a gated estate in Saris, with underground parking, a children's play area, and 24-hour security. Payment plans available through partner banks.",
    listingType: "sale",
    price: 4800000,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 96,
    city: "Addis Ababa",
    address: "Saris, near Abo Corner",
    latitude: 8.9795,
    longitude: 38.7985,
    status: "sold",
    amenities: ["Parking", "Security System", "Garden", "Water Tank", "Elevator"],
  },
  {
    agentEmail: "natnael.haile@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Modern 3-Bedroom Condominium in CMC",
    description:
      "Three-bedroom condominium in a new CMC project, with an open-plan living room, balcony, and fitted kitchen. Title deed available for immediate transfer.",
    listingType: "sale",
    price: 7500000,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 140,
    city: "Addis Ababa",
    address: "CMC, Lafto Side",
    latitude: 8.9935,
    longitude: 38.8005,
    status: "available",
    amenities: ["Parking", "Balcony", "Elevator", "Security System", "Backup Power"],
  },
  {
    agentEmail: "natnael.haile@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Luxury 3-Bedroom Apartment for Sale in Bole",
    description:
      "High-spec three-bedroom apartment in a boutique building in Bole, with marble floors, a fitted kitchen, and a private balcony overlooking the avenue.",
    listingType: "sale",
    price: 11500000,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    area: 180,
    city: "Addis Ababa",
    address: "Bole, near Edna Mall",
    latitude: 8.9945,
    longitude: 38.7945,
    status: "available",
    amenities: ["Parking", "Elevator", "Air Conditioning", "Security System", "Gym", "Balcony"],
  },

  // --- Selamawit Mekonnen (4, Bahir Dar) ---
  {
    agentEmail: "selamawit.mekonnen@betenya.com",
    category: "House",
    kind: "house",
    title: "Four-Bedroom Family Home in Bahir Dar",
    description:
      "Well-maintained four-bedroom home in a quiet residential area of Bahir Dar, with a large compound and mature fruit trees. Close to schools and the lake shore.",
    listingType: "sale",
    price: 6200000,
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 2,
    area: 230,
    city: "Bahir Dar",
    address: "Bahir Dar, Shum Oak Area",
    latitude: 11.586,
    longitude: 37.388,
    status: "available",
    amenities: ["Parking", "Garden", "Water Tank", "Security System"],
  },
  {
    agentEmail: "selamawit.mekonnen@betenya.com",
    category: "House",
    kind: "house",
    title: "3-Bedroom House for Rent near Lake Tana",
    description:
      "Three-bedroom house for yearly rent a short drive from the Lake Tana waterfront, with a fenced yard and servant room. Quiet neighbourhood with paved access.",
    listingType: "rent",
    price: 32000,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 160,
    city: "Bahir Dar",
    address: "Bahir Dar, near Lake Tana Road",
    latitude: 11.5945,
    longitude: 37.3845,
    status: "available",
    amenities: ["Parking", "Garden", "Backup Power", "Water Tank"],
  },
  {
    agentEmail: "selamawit.mekonnen@betenya.com",
    category: "House",
    kind: "house",
    title: "Modern Townhouse in Bahir Dar",
    description:
      "Newly built townhouse in a small development of eight units, with three bedrooms, a private terrace, and shared green space. Ideal for a family relocating to the city.",
    listingType: "sale",
    price: 4900000,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 1,
    area: 175,
    city: "Bahir Dar",
    address: "Bahir Dar, Millennium Area",
    latitude: 11.5915,
    longitude: 37.3975,
    status: "available",
    amenities: ["Parking", "Balcony", "Security System", "Water Tank"],
  },
  {
    agentEmail: "selamawit.mekonnen@betenya.com",
    category: "Land",
    kind: "land",
    title: "Land for Sale in Bahir Dar",
    description:
      "1,200 square metre titled plot in a rapidly growing area of Bahir Dar, suitable for a guesthouse or family compound. Road access and utilities nearby.",
    listingType: "sale",
    price: 5400000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 1200,
    city: "Bahir Dar",
    address: "Bahir Dar, Tana Sub-city",
    latitude: 11.6045,
    longitude: 37.3955,
    status: "sold",
    amenities: [],
  },

  // --- Yonatan Tadesse (5, Mekelle) ---
  {
    agentEmail: "yonatan.tadesse@betenya.com",
    category: "House",
    kind: "house",
    title: "Spacious 3-Bedroom House for Rent in Mekelle",
    description:
      "Three-bedroom house available for rent in a secure neighbourhood in Mekelle, with a compound wall, water reservoir, and covered parking.",
    listingType: "rent",
    price: 35000,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    area: 160,
    city: "Mekelle",
    address: "Mekelle, Ayder Road",
    latitude: 13.496,
    longitude: 39.469,
    status: "available",
    amenities: ["Parking", "Garden", "Water Tank", "Security System"],
  },
  {
    agentEmail: "yonatan.tadesse@betenya.com",
    category: "House",
    kind: "house",
    title: "4-Bedroom Family House for Sale in Mekelle",
    description:
      "Four-bedroom house with a large living room and fitted kitchen on a quiet street in Mekelle. Excellent condition and ready to move in.",
    listingType: "sale",
    price: 5800000,
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 2,
    area: 240,
    city: "Mekelle",
    address: "Mekelle, Kihet Area",
    latitude: 13.5065,
    longitude: 39.4775,
    status: "available",
    amenities: ["Parking", "Garden", "Backup Power", "Water Tank"],
  },
  {
    agentEmail: "yonatan.tadesse@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Two-Bedroom Apartment for Rent in Mekelle",
    description:
      "Two-bedroom apartment in the city centre of Mekelle, close to markets and public transport. The building has a shared courtyard and a constant water supply.",
    listingType: "rent",
    price: 16000,
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 1,
    area: 85,
    city: "Mekelle",
    address: "Mekelle, Commercial Area",
    latitude: 13.4925,
    longitude: 39.4705,
    status: "available",
    amenities: ["Parking", "Water Tank", "Security System"],
  },
  {
    agentEmail: "yonatan.tadesse@betenya.com",
    category: "Land",
    kind: "land",
    title: "Commercial Plot in Mekelle",
    description:
      "900 square metre commercial-zoned plot along a busy road in Mekelle, suitable for a showroom, hotel, or office block. Clear title and easy transfer.",
    listingType: "sale",
    price: 3900000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 900,
    city: "Mekelle",
    address: "Mekelle, Adwa Road",
    latitude: 13.5125,
    longitude: 39.4555,
    status: "available",
    amenities: [],
  },
  {
    agentEmail: "yonatan.tadesse@betenya.com",
    category: "Villa",
    kind: "villa",
    title: "Villa for Sale in Mekelle",
    description:
      "Five-bedroom villa with a walled garden and staff quarters in a prime Mekelle district. Spacious rooms, fireplaces, and a two-car garage.",
    listingType: "sale",
    price: 12500000,
    bedrooms: 5,
    bathrooms: 4,
    parkingSpaces: 2,
    area: 420,
    city: "Mekelle",
    address: "Mekelle, Bus Terminal Road",
    latitude: 13.4885,
    longitude: 39.4765,
    status: "available",
    amenities: ["Parking", "Garden", "Security System", "Backup Power", "Water Tank"],
  },

  // --- Bethlehem Worku (4, affordable Addis rentals) ---
  {
    agentEmail: "bethlehem.worku@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Furnished Studio near Bole Medhanialem",
    description:
      "Furnished studio apartment a five-minute walk from Bole Medhanialem, ideal for short or long stays. Includes wifi, weekly cleaning, and secure entry.",
    listingType: "rent",
    price: 16500,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 0,
    area: 40,
    city: "Addis Ababa",
    address: "Bole, near Medhanialem",
    latitude: 8.9975,
    longitude: 38.7885,
    status: "available",
    amenities: ["Furnished", "Wi-Fi", "Security System", "Backup Power"],
  },
  {
    agentEmail: "bethlehem.worku@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Two-Bedroom Apartment in Lebu",
    description:
      "Two-bedroom apartment in Lebu, close to the university and the main road. Bright rooms, tiled floors, and a shared water tank for the building.",
    listingType: "rent",
    price: 24000,
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 1,
    area: 88,
    city: "Addis Ababa",
    address: "Lebu, near Kality Junction",
    latitude: 9.0095,
    longitude: 38.7595,
    status: "available",
    amenities: ["Parking", "Water Tank", "Balcony"],
  },
  {
    agentEmail: "bethlehem.worku@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "One-Bedroom Apartment in Kolfe",
    description:
      "Affordable one-bedroom apartment in Kolfe, suitable for a single tenant or a couple. Quiet compound with gated access and a small parking area.",
    listingType: "rent",
    price: 14500,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 1,
    area: 52,
    city: "Addis Ababa",
    address: "Kolfe, Keranio Sub-city",
    latitude: 9.012,
    longitude: 38.733,
    status: "available",
    amenities: ["Parking", "Security System", "Water Tank"],
  },
  {
    agentEmail: "bethlehem.worku@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Two-Bedroom Apartment near Summit",
    description:
      "Quiet two-bedroom apartment near Summit, with a balcony and good natural light. The building has backup power and is close to several schools.",
    listingType: "rent",
    price: 26500,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 92,
    city: "Addis Ababa",
    address: "Summit, behind Summit Hotel",
    latitude: 9.026,
    longitude: 38.7655,
    status: "draft",
    amenities: ["Parking", "Balcony", "Backup Power", "Security System"],
  },

  // --- Bereket Assefa (4, Gondar) ---
  {
    agentEmail: "bereket.assefa@betenya.com",
    category: "House",
    kind: "house",
    title: "Three-Bedroom House for Sale in Gondar",
    description:
      "Three-bedroom house on a quiet street in Gondar, with a garden and store room. Recently renovated roof and plumbing, close to the university.",
    listingType: "sale",
    price: 4300000,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 175,
    city: "Gondar",
    address: "Gondar, near Fasil Area",
    latitude: 12.599,
    longitude: 37.469,
    status: "sold",
    amenities: ["Parking", "Garden", "Water Tank"],
  },
  {
    agentEmail: "bereket.assefa@betenya.com",
    category: "House",
    kind: "house",
    title: "Family Home for Rent in Gondar",
    description:
      "Three-bedroom family home available for rent in a safe neighbourhood of Gondar, with a fenced compound and space for a small garden.",
    listingType: "rent",
    price: 18500,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 150,
    city: "Gondar",
    address: "Gondar, Quaha Area",
    latitude: 12.6075,
    longitude: 37.4765,
    status: "available",
    amenities: ["Parking", "Garden", "Water Tank"],
  },
  {
    agentEmail: "bereket.assefa@betenya.com",
    category: "Land",
    kind: "land",
    title: "Corner Residential Plot in Gondar",
    description:
      "650 square metre corner plot in Gondar with road access on two sides, ideal for a guesthouse or duplex. All documents ready for transfer.",
    listingType: "sale",
    price: 2400000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 650,
    city: "Gondar",
    address: "Gondar, Ring Road Area",
    latitude: 12.5925,
    longitude: 37.4625,
    status: "available",
    amenities: [],
  },
  {
    agentEmail: "bereket.assefa@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Historic-Town Apartment for Rent in Gondar",
    description:
      "Two-bedroom apartment within walking distance of the royal castles in Gondar, recently painted with new kitchen fittings. Ideal for a small family.",
    listingType: "rent",
    price: 12500,
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 0,
    area: 78,
    city: "Gondar",
    address: "Gondar, Debre Birhan Square",
    latitude: 12.6015,
    longitude: 37.4735,
    status: "rented",
    amenities: ["Water Tank", "Security System"],
  },

  // --- Rahel Desta (4, Dire Dawa) ---
  {
    agentEmail: "rahel.desta@betenya.com",
    category: "Commercial",
    kind: "commercial",
    title: "Retail Space for Rent in Dire Dawa",
    description:
      "95 square metre retail space on Megala Road in Dire Dawa, with a wide shop front and a storage room behind. High visibility for retail or service businesses.",
    listingType: "rent",
    price: 32000,
    bedrooms: null,
    bathrooms: 1,
    parkingSpaces: 2,
    area: 95,
    city: "Dire Dawa",
    address: "Megala Road, Dire Dawa",
    latitude: 9.593,
    longitude: 41.857,
    status: "available",
    amenities: ["Parking", "Security System", "Backup Power"],
  },
  {
    agentEmail: "rahel.desta@betenya.com",
    category: "Commercial",
    kind: "office",
    title: "Office for Rent in Dire Dawa CBD",
    description:
      "Fitted office of 140 square metres in the city centre of Dire Dawa, including a reception, two private offices, and a meeting room.",
    listingType: "rent",
    price: 28000,
    bedrooms: null,
    bathrooms: 2,
    parkingSpaces: 3,
    area: 140,
    city: "Dire Dawa",
    address: "Dire Dawa, CBD",
    latitude: 9.5965,
    longitude: 41.8625,
    status: "available",
    amenities: ["Parking", "Wi-Fi", "Air Conditioning", "Security System"],
  },
  {
    agentEmail: "rahel.desta@betenya.com",
    category: "Commercial",
    kind: "commercial",
    title: "Commercial Building for Sale in Dire Dawa",
    description:
      "Three-storey building with retail on the ground floor and offices above, located on a main junction. Currently tenanted, an attractive yield for investors.",
    listingType: "sale",
    price: 18500000,
    bedrooms: null,
    bathrooms: 5,
    parkingSpaces: 5,
    area: 460,
    city: "Dire Dawa",
    address: "Dire Dawa, Railway Area",
    latitude: 9.5885,
    longitude: 41.8645,
    status: "sold",
    amenities: ["Parking", "Backup Power", "Security System", "Water Tank"],
  },
  {
    agentEmail: "rahel.desta@betenya.com",
    category: "Land",
    kind: "land",
    title: "Plot near Bypass Road, Dire Dawa",
    description:
      "800 square metre plot close to the bypass road in Dire Dawa, suitable for a warehouse, fuel station, or residential compound. Flat and easy to develop.",
    listingType: "sale",
    price: 2100000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 800,
    city: "Dire Dawa",
    address: "Bypass Road, Dire Dawa",
    latitude: 9.6055,
    longitude: 41.8495,
    status: "available",
    amenities: [],
  },

  // --- Kalkidan Mesfin (4, Addis land) ---
  {
    agentEmail: "kalkidan.mesfin@betenya.com",
    category: "Land",
    kind: "land",
    title: "Prime Residential Plot in Jemo",
    description:
      "700 square metre residential plot in Jemo, inside a growing area with new buildings around. The title deed is clean and ready for immediate transfer.",
    listingType: "sale",
    price: 4200000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 700,
    city: "Addis Ababa",
    address: "Jemo, Block 15",
    latitude: 8.9865,
    longitude: 38.7585,
    status: "available",
    amenities: [],
  },
  {
    agentEmail: "kalkidan.mesfin@betenya.com",
    category: "Land",
    kind: "land",
    title: "Residential Plot in Gerji",
    description:
      "400 square metre plot in Gerji, a short drive from Bole International Airport. Flat terrain with electricity and water connections at the edge of the plot.",
    listingType: "sale",
    price: 1950000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 400,
    city: "Addis Ababa",
    address: "Gerji, behind the condominium",
    latitude: 9.0155,
    longitude: 38.7475,
    status: "available",
    amenities: [],
  },
  {
    agentEmail: "kalkidan.mesfin@betenya.com",
    category: "Land",
    kind: "land",
    title: "Investment Plot in Saris",
    description:
      "1,000 square metre plot near the bypass in Saris, suited for a warehouse or apartment project. Strong demand in the area and easy financing options.",
    listingType: "sale",
    price: 3600000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 1000,
    city: "Addis Ababa",
    address: "Saris, near Bypass Road",
    latitude: 8.9765,
    longitude: 38.7925,
    status: "draft",
    amenities: [],
  },
  {
    agentEmail: "kalkidan.mesfin@betenya.com",
    category: "Land",
    kind: "land",
    title: "Land for Sale in Ayat",
    description:
      "900 square metre titled plot in Ayat, surrounded by new villas and condominiums. Ideal for a family home or a small residential project.",
    listingType: "sale",
    price: 5100000,
    bedrooms: null,
    bathrooms: null,
    parkingSpaces: null,
    area: 900,
    city: "Addis Ababa",
    address: "Ayat, Zone 3",
    latitude: 9.0075,
    longitude: 38.8405,
    status: "available",
    amenities: [],
  },

  // --- Henok Ayele (4, Jimma) ---
  {
    agentEmail: "henok.ayele@betenya.com",
    category: "House",
    kind: "house",
    title: "Modern 3-Bedroom House for Rent in Jimma",
    description:
      "Newly built three-bedroom house for rent in Jimma, with a fitted kitchen, tiled floors, and a fenced compound. Reliable water supply and backup power.",
    listingType: "rent",
    price: 20000,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 145,
    city: "Jimma",
    address: "Jimma, Main Road",
    latitude: 7.669,
    longitude: 36.834,
    status: "available",
    amenities: ["Parking", "Garden", "Backup Power", "Water Tank"],
  },
  {
    agentEmail: "henok.ayele@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Two-Bedroom Apartment for Rent in Jimma",
    description:
      "Two-bedroom apartment in the centre of Jimma, close to the market and public transport. Suitable for a small family or two colleagues sharing.",
    listingType: "rent",
    price: 14000,
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 0,
    area: 80,
    city: "Jimma",
    address: "Jimma, Aba Jifar Area",
    latitude: 7.6735,
    longitude: 36.8385,
    status: "available",
    amenities: ["Water Tank", "Security System"],
  },
  {
    agentEmail: "henok.ayele@betenya.com",
    category: "House",
    kind: "house",
    title: "Family House for Sale in Jimma",
    description:
      "Four-bedroom family house on a large plot in Jimma, with a garden, store room, and space to extend. Quiet area with paved road access.",
    listingType: "sale",
    price: 3800000,
    bedrooms: 4,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 210,
    city: "Jimma",
    address: "Jimma, Koshe Area",
    latitude: 7.6645,
    longitude: 36.8275,
    status: "available",
    amenities: ["Parking", "Garden", "Water Tank"],
  },
  {
    agentEmail: "henok.ayele@betenya.com",
    category: "Apartment",
    kind: "apartment",
    title: "Serviced Apartment for Rent in Jimma",
    description:
      "Two-bedroom serviced apartment with weekly cleaning and internet, close to Jimma University. Furnished and ready for immediate move-in.",
    listingType: "rent",
    price: 21000,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    area: 95,
    city: "Jimma",
    address: "Jimma, University Road",
    latitude: 7.6775,
    longitude: 36.8435,
    status: "rented",
    amenities: ["Furnished", "Wi-Fi", "Parking", "Security System"],
  },
];

const DEMO_SUBSCRIPTIONS = [
  { agentEmail: "hana.tesfaye@betenya.com", planSlug: "premium" },
  { agentEmail: "dawit.bekele@betenya.com", planSlug: "premium" },
  { agentEmail: "meron.alemu@betenya.com", planSlug: "pro" },
  { agentEmail: "abel.girma@betenya.com", planSlug: "pro" },
  { agentEmail: "natnael.haile@betenya.com", planSlug: "basic" },
  { agentEmail: "selamawit.mekonnen@betenya.com", planSlug: "pro" },
];

let imageRotation = 0;

function toImageUrl(photoId) {
  return `https://images.unsplash.com/${photoId}${IMAGE_QUERY}`;
}

function pickImageUrls(kind, index) {
  const coverPool = COVER_POOLS[kind] || IMAGE_POOLS.apartment;
  const interiorPool = INTERIOR_POOLS[kind] || RESIDENTIAL_INTERIORS;
  const isLand = kind === "land";
  const targetCount = isLand ? Math.min(coverPool.length, 4) : 3 + (index % 4);

  const photoIds = [coverPool[(index + imageRotation) % coverPool.length]];

  let cursor = (index * 3 + imageRotation) % interiorPool.length;
  let guard = 0;
  while (photoIds.length < targetCount && guard < interiorPool.length * 2) {
    const candidate = interiorPool[cursor % interiorPool.length];
    cursor += 1;
    guard += 1;
    if (!photoIds.includes(candidate)) photoIds.push(candidate);
  }

  imageRotation += 1;
  return photoIds.map(toImageUrl);
}

async function ensureReferenceData() {
  for (const category of CATEGORIES) {
    await query("INSERT IGNORE INTO property_categories (name, description) VALUES (?, ?)", [
      category.name,
      category.description,
    ]);
  }

  const placeholders = AMENITIES.map(() => "(?, ?)").join(", ");
  const params = AMENITIES.flatMap((name) => [name, null]);
  await query(`INSERT IGNORE INTO amenities (name, description) VALUES ${placeholders}`, params);
}

async function loadAgentsByEmails(emails) {
  const uniqueEmails = [...new Set(emails)];
  const placeholders = uniqueEmails.map(() => "?").join(", ");
  const rows = await query(
    `SELECT id, email FROM users WHERE role = 'agent' AND email IN (${placeholders})`,
    uniqueEmails
  );

  const byEmail = new Map(rows.map((row) => [row.email, row.id]));
  const missing = uniqueEmails.filter((email) => !byEmail.has(email));
  if (missing.length) {
    throw new Error(
      `Missing demo agents: ${missing.join(", ")}. Run "node scripts/seedAgents.js" first.`
    );
  }
  return byEmail;
}

async function loadAmenityIds() {
  const rows = await query("SELECT id, name FROM amenities");
  return new Map(rows.map((row) => [row.name, row.id]));
}

async function loadCategoryIds() {
  const rows = await query("SELECT id, name FROM property_categories");
  return new Map(rows.map((row) => [row.name, row.id]));
}

async function findExistingProperty(title) {
  const rows = await query("SELECT id FROM properties WHERE title = ? LIMIT 1", [title]);
  return rows[0] || null;
}

async function insertProperty(property, agentId, categoryId, amenityIds, index) {
  const createdDaysAgo = 1 + ((index * 7) % 85);
  const views = (index * 37) % 600;
  const imageUrls = pickImageUrls(property.kind, index);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO properties
         (agent_id, category_id, title, description, listing_type, price,
          bedrooms, bathrooms, parking_spaces, area, country, city, address,
          latitude, longitude, status, views, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Ethiopia', ?, ?, ?, ?, ?, ?,
               DATE_SUB(NOW(), INTERVAL ? DAY))`,
      [
        agentId,
        categoryId,
        property.title,
        property.description,
        property.listingType,
        property.price,
        property.bedrooms,
        property.bathrooms,
        property.parkingSpaces,
        property.area,
        property.city,
        property.address,
        property.latitude,
        property.longitude,
        property.status,
        views,
        createdDaysAgo,
      ]
    );
    const propertyId = result.insertId;

    for (let i = 0; i < imageUrls.length; i += 1) {
      await connection.execute(
        `INSERT INTO property_images (property_id, image_url, public_id, sort_order, is_cover)
         VALUES (?, ?, '', ?, ?)`,
        [propertyId, imageUrls[i], i, i === 0 ? 1 : 0]
      );
    }

    for (const amenityName of property.amenities) {
      const amenityId = amenityIds.get(amenityName);
      if (!amenityId) throw new Error(`Amenity not found: ${amenityName}`);
      await connection.execute(
        "INSERT IGNORE INTO property_amenities (property_id, amenity_id) VALUES (?, ?)",
        [propertyId, amenityId]
      );
    }

    await connection.commit();
    return { propertyId, imageCount: imageUrls.length };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function seedDemoSubscriptions(agentIds) {
  const plans = await query(
    "SELECT id, slug, price, duration_days FROM subscription_plans WHERE is_active = 1"
  );
  const plansBySlug = new Map(plans.map((plan) => [plan.slug, plan]));

  let created = 0;
  for (const item of DEMO_SUBSCRIPTIONS) {
    const plan = plansBySlug.get(item.planSlug);
    const userId = agentIds.get(item.agentEmail);
    if (!plan || !userId) continue;

    const existing = await query(
      "SELECT id FROM subscriptions WHERE user_id = ? AND status = 'active' LIMIT 1",
      [userId]
    );
    if (existing.length) {
      console.log(`Skip subscription (already active): ${item.agentEmail}`);
      continue;
    }

    await query(
      `INSERT INTO subscriptions
         (user_id, plan_id, status, amount, currency, duration_days, starts_at, expires_at)
       VALUES (?, ?, 'active', ?, 'ETB', ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))`,
      [userId, plan.id, plan.price, plan.duration_days, plan.duration_days]
    );
    created += 1;
    console.log(`Subscription created -> ${item.agentEmail} (${item.planSlug})`);
  }
  return created;
}

async function main() {
  await ensureReferenceData();

  const agentIds = await loadAgentsByEmails(PROPERTIES.map((property) => property.agentEmail));
  const categoryIds = await loadCategoryIds();
  const amenityIds = await loadAmenityIds();

  let created = 0;
  let skipped = 0;
  let insertedImages = 0;
  let amenityLinks = 0;

  for (let index = 0; index < PROPERTIES.length; index += 1) {
    const property = PROPERTIES[index];

    const existing = await findExistingProperty(property.title);
    if (existing) {
      skipped += 1;
      continue;
    }

    const categoryId = categoryIds.get(property.category);
    if (!categoryId) throw new Error(`Category not found: ${property.category}`);

    for (const amenityName of property.amenities) {
      if (!amenityIds.has(amenityName)) {
        throw new Error(
          `Amenity not found: ${amenityName}. Run "node scripts/seedAmenities.js" first.`
        );
      }
    }

    const result = await insertProperty(
      property,
      agentIds.get(property.agentEmail),
      categoryId,
      amenityIds,
      index
    );

    created += 1;
    insertedImages += result.imageCount;
    amenityLinks += property.amenities.length;
    console.log(`Property created -> ${property.title} (id ${result.propertyId})`);
  }

  const subscriptionsCreated = await seedDemoSubscriptions(agentIds);

  console.log(`\nDone. Properties created: ${created}, skipped (already seeded): ${skipped}.`);
  console.log(`Property images inserted: ${insertedImages}`);
  console.log(`Amenity links inserted: ${amenityLinks}`);
  console.log(`Demo subscriptions created: ${subscriptionsCreated}`);
  console.log(`Demo agent password: ${DEMO_AGENT_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
  })
  .finally(() => pool.end());
