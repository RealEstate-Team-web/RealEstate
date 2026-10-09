require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("../config/db.config");

const AGENTS = [
  {
    firstName: "Sara",
    lastName: "Tamrat",
    email: "sara.tamrat@betenya.com",
    phone: "0900000101",
    agencyName: "Betenya Realty",
    licenseNumber: "LIC-1001",
    experienceYears: 5,
    city: "Addis Ababa",
    specialization: "Apartments & Rentals",
    officeAddress: "Bole Road, Sunshine Building, 3rd Floor",
    bio: "Sara helps tenants and first-time buyers find apartments across Addis Ababa.",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Daniel",
    lastName: "Tesfaye",
    email: "daniel.tesfaye@betenya.com",
    phone: "0900000102",
    agencyName: "Betenya Realty",
    licenseNumber: "LIC-1002",
    experienceYears: 3,
    city: "Bahir Dar",
    specialization: "Family Homes",
    officeAddress: "Bahir Dar, Bridge Side Road",
    bio: "Daniel focuses on family houses and townhouses around Bahir Dar.",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Liya",
    lastName: "Bekele",
    email: "liya.bekele@betenya.com",
    phone: "0900000103",
    agencyName: "Skyline Properties",
    licenseNumber: "LIC-1003",
    experienceYears: 8,
    city: "Hawassa",
    specialization: "Land & Plots",
    officeAddress: "Hawassa, Lake View Road",
    bio: "Liya advises buyers on residential plots and land around Hawassa.",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Mekdes",
    lastName: "Alemu",
    email: "mekdes.alemu@betenya.com",
    phone: "0900000104",
    agencyName: "Skyline Properties",
    licenseNumber: "LIC-1004",
    experienceYears: 2,
    city: "Adama",
    specialization: "Commercial Properties",
    officeAddress: "Adama, Nazareth Road",
    bio: "Mekdes supports small businesses looking for shops and offices in Adama.",
    profileImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Hana",
    lastName: "Bekele",
    email: "hana.bekele@betenya.com",
    phone: "0900000105",
    agencyName: "Urban Nest",
    licenseNumber: "LIC-1005",
    experienceYears: 6,
    city: "Mekelle",
    specialization: "Residential Sales",
    officeAddress: "Mekelle, Axios Street",
    bio: "Hana handles residential sales and rentals for clients in Mekelle.",
    profileImageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Hana",
    lastName: "Tesfaye",
    email: "hana.tesfaye@betenya.com",
    phone: "0911245807",
    agencyName: "Betenya Realty",
    licenseNumber: "LIC-2001",
    experienceYears: 7,
    city: "Addis Ababa",
    specialization: "Residential Sales",
    officeAddress: "Bole Road, Brilliant Building, 4th Floor",
    bio: "Hana has helped dozens of families find their first homes in Addis Ababa, with a focus on Bole, Yeka, and Megenagna.",
    profileImageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Dawit",
    lastName: "Bekele",
    email: "dawit.bekele@betenya.com",
    phone: "0912367145",
    agencyName: "Skyline Properties",
    licenseNumber: "LIC-2002",
    experienceYears: 9,
    city: "Addis Ababa",
    specialization: "Luxury Villas",
    officeAddress: "Old Airport, Serbita Street",
    bio: "Dawit specializes in premium villas and standalone houses for buyers looking in Old Airport, Ayat, and the Bole corridor.",
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Meron",
    lastName: "Alemu",
    email: "meron.alemu@betenya.com",
    phone: "0913478256",
    agencyName: "Urban Nest",
    licenseNumber: "LIC-2003",
    experienceYears: 5,
    city: "Addis Ababa",
    specialization: "Apartments & Rentals",
    officeAddress: "Megenagna, Zefmesh Grand Mall, 2nd Floor",
    bio: "Meron works mainly with long-term rentals, matching tenants with furnished and unfurnished apartments across Addis Ababa.",
    profileImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Abel",
    lastName: "Girma",
    email: "abel.girma@betenya.com",
    phone: "0914583967",
    agencyName: "Habesha Homes",
    licenseNumber: "LIC-2004",
    experienceYears: 12,
    city: "Adama",
    specialization: "Commercial Properties",
    officeAddress: "Adama, Africa Avenue",
    bio: "Abel handles commercial listings along the Addis-Adama corridor, including offices, retail spaces, and warehouses.",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Sara",
    lastName: "Getachew",
    email: "sara.getachew@betenya.com",
    phone: "0915694078",
    agencyName: "Rift Valley Estates",
    licenseNumber: "LIC-2005",
    experienceYears: 4,
    city: "Hawassa",
    specialization: "Land & Plots",
    officeAddress: "Hawassa, Ring Road",
    bio: "Sara guides buyers through land purchases around Hawassa, Bishoftu, and the surrounding woredas.",
    profileImageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Natnael",
    lastName: "Haile",
    email: "natnael.haile@betenya.com",
    phone: "0920374856",
    agencyName: "Betenya Realty",
    licenseNumber: "LIC-2006",
    experienceYears: 6,
    city: "Addis Ababa",
    specialization: "New Developments",
    officeAddress: "Kazanchis, Ethio Trade Building",
    bio: "Natnael focuses on newly completed condominium projects and off-plan sales in emerging neighborhoods.",
    profileImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Selamawit",
    lastName: "Mekonnen",
    email: "selamawit.mekonnen@betenya.com",
    phone: "0930485967",
    agencyName: "Skyline Properties",
    licenseNumber: "LIC-2007",
    experienceYears: 8,
    city: "Bahir Dar",
    specialization: "Family Homes",
    officeAddress: "Bahir Dar, Millennium Road",
    bio: "Selamawit supports families buying and renting houses around Bahir Dar and the Lake Tana shoreline.",
    profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Yonatan",
    lastName: "Tadesse",
    email: "yonatan.tadesse@betenya.com",
    phone: "0940596078",
    agencyName: "Highland Property Center",
    licenseNumber: "LIC-2008",
    experienceYears: 10,
    city: "Mekelle",
    specialization: "Residential Sales",
    officeAddress: "Mekelle, Awatelo Street",
    bio: "Yonatan has a decade of experience helping clients buy and sell homes in Mekelle and the surrounding areas.",
    profileImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Bethlehem",
    lastName: "Worku",
    email: "bethlehem.worku@betenya.com",
    phone: "0950617483",
    agencyName: "Urban Nest",
    licenseNumber: "LIC-2009",
    experienceYears: 3,
    city: "Addis Ababa",
    specialization: "Apartments & Rentals",
    officeAddress: "Summit, Summit Square",
    bio: "Bethlehem specializes in affordable studio and one-bedroom rentals for young professionals in Addis Ababa.",
    profileImageUrl: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Bereket",
    lastName: "Assefa",
    email: "bereket.assefa@betenya.com",
    phone: "0960728594",
    agencyName: "Blue Nile Realty",
    licenseNumber: "LIC-2010",
    experienceYears: 11,
    city: "Gondar",
    specialization: "Family Homes",
    officeAddress: "Gondar, Debre Birhan Square",
    bio: "Bereket handles residential sales in Gondar, from historic homes near the castles to newly built houses.",
    profileImageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Rahel",
    lastName: "Desta",
    email: "rahel.desta@betenya.com",
    phone: "0970839605",
    agencyName: "Eastern Real Estate",
    licenseNumber: "LIC-2011",
    experienceYears: 5,
    city: "Dire Dawa",
    specialization: "Commercial Properties",
    officeAddress: "Dire Dawa, Megala Road",
    bio: "Rahel lists offices, shops, and commercial buildings for investors in Dire Dawa and the eastern corridor.",
    profileImageUrl: "https://images.unsplash.com/photo-1592621385612-4d7129426394?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "approved",
  },
  {
    firstName: "Kalkidan",
    lastName: "Mesfin",
    email: "kalkidan.mesfin@betenya.com",
    phone: "0980940716",
    agencyName: "Urban Nest",
    licenseNumber: "LIC-2012",
    experienceYears: 2,
    city: "Addis Ababa",
    specialization: "Land & Plots",
    officeAddress: "Jemo, Highlands Plaza",
    bio: "Kalkidan joined recently and focuses on residential plots and land investment around Addis Ababa's periphery.",
    profileImageUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "pending",
  },
  {
    firstName: "Henok",
    lastName: "Ayele",
    email: "henok.ayele@betenya.com",
    phone: "0990151827",
    agencyName: "Jimma Valley Properties",
    licenseNumber: "LIC-2013",
    experienceYears: 6,
    city: "Jimma",
    specialization: "Residential Sales",
    officeAddress: "Jimma, Main Road",
    bio: "Henok helps buyers and sellers with houses and small farms in Jimma and the surrounding highlands.",
    profileImageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80",
    verificationStatus: "pending",
  },
];

const PASSWORD = "Agent@123";

// Agents are matched by email first. A brand rename (nesthome -> betnya ->
// betenya) means older databases can still hold the same seeded person under
// a previous email domain, so we also match on first + last name to avoid
// inserting duplicate demo agents.
async function findExistingAgent(agent) {
  const [byEmail] = await pool.execute(
    "SELECT id, email FROM users WHERE role = 'agent' AND email = ? LIMIT 1",
    [agent.email]
  );
  if (byEmail.length) return byEmail[0];

  const [byName] = await pool.execute(
    "SELECT id, email FROM users WHERE role = 'agent' AND first_name = ? AND last_name = ? LIMIT 1",
    [agent.firstName, agent.lastName]
  );
  if (byName.length) return byName[0];

  return null;
}

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  let created = 0;
  let skipped = 0;

  for (const a of AGENTS) {
    const existing = await findExistingAgent(a);
    if (existing) {
      skipped += 1;
      console.log(
        `Skip (exists): ${a.firstName} ${a.lastName}` +
          (existing.email !== a.email ? ` [existing email: ${existing.email}]` : "")
      );
      continue;
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [res] = await conn.execute(
        "INSERT INTO users (first_name, last_name, email, phone, role, status, profile_image_url) VALUES (?, ?, ?, ?, 'agent', 'active', ?)",
        [a.firstName, a.lastName, a.email, a.phone, a.profileImageUrl || null]
      );
      const userId = res.insertId;

      await conn.execute(
        "INSERT INTO user_credentials (user_id, password_hash) VALUES (?, ?)",
        [userId, passwordHash]
      );
      await conn.execute(
        `INSERT INTO agent_profiles
           (user_id, agency_name, license_number, experience_years, specialization, office_address, city, bio, verification_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          a.agencyName,
          a.licenseNumber,
          a.experienceYears,
          a.specialization || null,
          a.officeAddress || null,
          a.city || null,
          a.bio || null,
          a.verificationStatus || "pending",
        ]
      );
      await conn.commit();
      created += 1;
      console.log(`Agent created -> ${a.firstName} ${a.lastName} (${a.email})`);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped}.`);
  console.log(`All seeded agents use password: ${PASSWORD}`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
  })
  .finally(() => pool.end());
