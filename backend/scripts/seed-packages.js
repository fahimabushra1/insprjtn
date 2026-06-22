/**
 * Development seed script — run after MongoDB is connected:
 * node scripts/seed-packages.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { setServers } from "dns/promises";
import { Package } from "../src/models/Package.model.js";
import { slugify } from "../src/utils/slugify.js";

setServers(["8.8.8.8"]);
dotenv.config();

const packages = [
  {
    title: "Sundarban Day Tour",
    description:
      "Experience the magic of Sundarban in a single day. Cruise through mangrove channels, spot wildlife, and visit a forest station. Perfect for first-time visitors.",
    duration: "1 Day",
    price: 3500,
    location: "Sundarban, Khulna",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    ],
    featured: true,
    included: ["Boat ride", "Forest guide", "Lunch", "Life jacket"],
    excluded: ["Personal expenses", "Tips"],
    itinerary: [
      { day: 1, title: "Mangrove Cruise", description: "Morning departure, channel cruise, wildlife spotting, and return by evening." },
    ],
  },
  {
    title: "Sundarban 2 Days 1 Night",
    description:
      "An overnight adventure deep into the Sundarban. Stay on a houseboat, explore remote channels at dawn, and experience the forest after dark.",
    duration: "2 Days 1 Night",
    price: 8500,
    location: "Sundarban, Bagerhat",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    ],
    featured: true,
    included: ["Houseboat stay", "All meals", "Expert guide", "Forest permits"],
    excluded: ["Travel to launch point", "Insurance"],
    itinerary: [
      { day: 1, title: "Departure & Channel Exploration", description: "Board houseboat, cruise through main channels, evening on deck." },
      { day: 2, title: "Dawn Safari & Return", description: "Early morning wildlife watch, breakfast, return to port." },
    ],
  },
  {
    title: "Sundarban 3 Days 2 Nights Premium",
    description:
      "Our flagship premium tour covering the best of Sundarban. Multiple forest stations, village visits, and extended wildlife watching sessions.",
    duration: "3 Days 2 Nights",
    price: 15000,
    location: "Sundarban, Mongla",
    images: [
      "https://images.unsplash.com/photo-1583212292454-810fe8887c27?w=800&q=80",
    ],
    featured: true,
    included: ["Premium houseboat", "All meals", "Senior guide", "Permits", "Binoculars"],
    excluded: ["Alcoholic beverages", "Personal shopping"],
    itinerary: [
      { day: 1, title: "Mongla to Forest", description: "Depart Mongla, enter forest zones, anchor at Kotka." },
      { day: 2, title: "Kotka & Kachikhali", description: "Full day exploration, deer and bird watching, village visit." },
      { day: 3, title: "Return Journey", description: "Morning cruise, breakfast, return to Mongla." },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Package.deleteMany({});
  console.log("Cleared existing packages");

  for (const pkg of packages) {
    await Package.create({ ...pkg, slug: slugify(pkg.title) });
  }

  console.log(`Seeded ${packages.length} packages`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
