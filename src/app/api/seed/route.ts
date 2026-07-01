import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { User } from "@/lib/db/models/User.model";
import { Package } from "@/lib/db/models/Package.model";
import { Blog } from "@/lib/db/models/Blog.model";
import { Testimonial } from "@/lib/db/models/Testimonial.model";
import { Gallery } from "@/lib/db/models/Gallery.model";
import { Holiday } from "@/lib/db/models/Holiday.model";
import { TravelSeason } from "@/lib/db/models/TravelSeason.model";
import { Place } from "@/lib/db/models/Place.model";
import { Route } from "@/lib/db/models/Route.model";
import { TourAvailability } from "@/lib/db/models/TourAvailability.model";
import { Announcement } from "@/lib/db/models/Announcement.model";
import { apiResponse, apiError } from "@/lib/backend/response";
import { slugify } from "@/lib/backend/slugify";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 1. Seed Admin User
    const adminEmail = "bushra.arifeen@gmail.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        firebaseUid: "seed-admin-uid-12345",
        name: "Bushra Arifeen",
        email: adminEmail,
        phone: "+8801884545974",
        address: "Dhaka, Bangladesh",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        role: "admin",
      });
    } else {
      admin.role = "admin";
      await admin.save();
    }

    // 2. Seed Travel Seasons (12 Months)
    const countSeasons = await TravelSeason.countDocuments();
    if (countSeasons === 0) {
      await TravelSeason.create([
        {
          month: 1,
          temperature: "15°C - 25°C",
          humidity: "60%",
          rainfall: "Very Low",
          riverCondition: "Calm",
          weather: "Cool & Sunny",
          tourRecommendation: "Best Month",
          birdWatching: 5,
          tigerActivity: 5,
          photography: 5,
          crowdLevel: "High",
          mosquitoLevel: "Low",
          forestCondition: "Misty & Scenic",
          recommendedClothing: "Light woolens, jackets, sweaters",
          recommendedEquipment: "Binoculars, DSLR with telephoto lens, mist-filter",
          summary: "January offers crisp cool mornings and calm river waters. Ideal for family boat cruises, foggy forest walks, and spotting migratory birds.",
          bestTimeScore: 5,
          bestTimeReason: "Cool weather, excellent wildlife spotting, ideal boat trips"
        },
        {
          month: 2,
          temperature: "18°C - 28°C",
          humidity: "65%",
          rainfall: "Very Low",
          riverCondition: "Calm",
          weather: "Pleasant",
          tourRecommendation: "Best Month",
          birdWatching: 5,
          tigerActivity: 4,
          photography: 5,
          crowdLevel: "Medium",
          mosquitoLevel: "Low",
          forestCondition: "Lush Green",
          recommendedClothing: "Light cotton, light jacket for evening",
          recommendedEquipment: "Binoculars, camera zoom lenses",
          summary: "February brings mild, pleasant weather. The fog clears up, offering outstanding opportunities for wildlife sightseeing and bird watching.",
          bestTimeScore: 5,
          bestTimeReason: "Pleasant climate, ideal for bird watching and hiking"
        },
        {
          month: 3,
          temperature: "22°C - 32°C",
          humidity: "70%",
          rainfall: "Low",
          riverCondition: "Moderate",
          weather: "Warm & Breezy",
          tourRecommendation: "Recommended",
          birdWatching: 4,
          tigerActivity: 4,
          photography: 4,
          crowdLevel: "Medium",
          mosquitoLevel: "Medium",
          forestCondition: "Dry Wooded",
          recommendedClothing: "Breathable light cottons, sun hats",
          recommendedEquipment: "Polarizing filters, sunscreen, hydration pack",
          summary: "March is warmer. Tigers often visit river banks in search of fresh water. Stronger river breezes make boat sails refreshing.",
          bestTimeScore: 4,
          bestTimeReason: "Slightly warmer but still highly favorable for tiger sighting"
        },
        {
          month: 4,
          temperature: "26°C - 36°C",
          humidity: "78%",
          rainfall: "Moderate",
          riverCondition: "Choppy",
          weather: "Hot & Humid",
          tourRecommendation: "Low Crowd",
          birdWatching: 3,
          tigerActivity: 3,
          photography: 3,
          crowdLevel: "Low",
          mosquitoLevel: "High",
          forestCondition: "Dry & Humid",
          recommendedClothing: "Very light loose cottons, full sleeve shirts",
          recommendedEquipment: "Insect repellent, hydration gear, dry bag",
          summary: "April is hot and humid with occasional Nor'wester storms. However, low crowd levels allow a peaceful and private forest escape.",
          bestTimeScore: 3,
          bestTimeReason: "Warm weather, fewer visitors, cheaper tour package rates"
        },
        {
          month: 5,
          temperature: "28°C - 38°C",
          humidity: "82%",
          rainfall: "High",
          riverCondition: "Rough",
          weather: "Very Hot",
          tourRecommendation: "Avoid Heavy Rain",
          birdWatching: 2,
          tigerActivity: 2,
          photography: 2,
          crowdLevel: "Very Low",
          mosquitoLevel: "High",
          forestCondition: "Stormy Coastline",
          recommendedClothing: "Rain gear, light fast-drying synthetics",
          recommendedEquipment: "Waterproof camera bags, emergency ponchos",
          summary: "May is the pre-monsoon month with high risk of cyclonic activity. Forest trails become wet. Recommended only for extreme adventure seekers.",
          bestTimeScore: 2,
          bestTimeReason: "Very hot weather, high humidity, cyclonic storms possible"
        },
        {
          month: 6,
          temperature: "28°C - 34°C",
          humidity: "88%",
          rainfall: "Very High",
          riverCondition: "Very Rough",
          weather: "Monsoon Rain",
          tourRecommendation: "Avoid Heavy Rain",
          birdWatching: 2,
          tigerActivity: 1,
          photography: 2,
          crowdLevel: "Very Low",
          mosquitoLevel: "High",
          forestCondition: "Flooded Mangroves",
          recommendedClothing: "Full rain suits, water boots",
          recommendedEquipment: "Raincovers for all electronics, dry bags",
          summary: "June is the peak monsoon month. Rivers swell, forest tracks drown, and ship routes are restricted. Travel is generally discouraged.",
          bestTimeScore: 1,
          bestTimeReason: "Monsoon starts, heavy rainfall, high river tides, rough waters"
        },
        {
          month: 7,
          temperature: "27°C - 33°C",
          humidity: "90%",
          rainfall: "Very High",
          riverCondition: "Rough",
          weather: "Heavy Rain",
          tourRecommendation: "Avoid Heavy Rain",
          birdWatching: 2,
          tigerActivity: 1,
          photography: 3,
          crowdLevel: "Very Low",
          mosquitoLevel: "High",
          forestCondition: "Lush & Saturated",
          recommendedClothing: "Raincoats, umbrellas, quick-dry shorts",
          recommendedEquipment: "Waterproof cases, lens cleaning microfiber",
          summary: "July is monsoon-heavy. The forest turns incredibly vibrant green, but rough river conditions make boat navigation hazardous.",
          bestTimeScore: 1,
          bestTimeReason: "Heavy monsoon storms, river conditions can be challenging"
        },
        {
          month: 8,
          temperature: "27°C - 33°C",
          humidity: "88%",
          rainfall: "High",
          riverCondition: "Rough",
          weather: "Rainy & Humid",
          tourRecommendation: "Avoid Heavy Rain",
          birdWatching: 3,
          tigerActivity: 2,
          photography: 3,
          crowdLevel: "Very Low",
          mosquitoLevel: "High",
          forestCondition: "Lush & Flooded",
          recommendedClothing: "Rain jackets, lightweight cotton fabrics",
          recommendedEquipment: "Waterproof action camera, silica gel bags",
          summary: "August sees continuous monsoon showers. High tides submerge low islands. Wildlife remains hidden deep in forest centers.",
          bestTimeScore: 1,
          bestTimeReason: "Monsoon showers, difficult hiking trails, limited wildlife sight"
        },
        {
          month: 9,
          temperature: "26°C - 33°C",
          humidity: "85%",
          rainfall: "Moderate",
          riverCondition: "Moderate",
          weather: "Humid & Showery",
          tourRecommendation: "Avoid Heavy Rain",
          birdWatching: 3,
          tigerActivity: 2,
          photography: 4,
          crowdLevel: "Low",
          mosquitoLevel: "High",
          forestCondition: "Overgrown Greens",
          recommendedClothing: "Umbrella, light cotton garments",
          recommendedEquipment: "Camera rain-sleeve, walking stick",
          summary: "September shows clearing sky blocks. Monsoon is winding down. The delta landscape looks raw and beautifully green.",
          bestTimeScore: 1,
          bestTimeReason: "End of monsoon, rivers starting to calm down but still unpredictable"
        },
        {
          month: 10,
          temperature: "24°C - 31°C",
          humidity: "75%",
          rainfall: "Low",
          riverCondition: "Calming",
          weather: "Post-Monsoon Refreshing",
          tourRecommendation: "Nature Lovers",
          birdWatching: 4,
          tigerActivity: 3,
          photography: 5,
          crowdLevel: "Low",
          mosquitoLevel: "Medium",
          forestCondition: "Dense & Fresh",
          recommendedClothing: "Light loose clothing, hat",
          recommendedEquipment: "Wide angle camera lens, polarizing filters",
          summary: "October features beautiful blue skies and calm rivers. The forest looks fresh, healthy, and highly photogenic after monsoon washes.",
          bestTimeScore: 4,
          bestTimeReason: "Nature becomes lush and highly scenic after monsoon washes"
        },
        {
          month: 11,
          temperature: "20°C - 28°C",
          humidity: "65%",
          rainfall: "Very Low",
          riverCondition: "Calm",
          weather: "Cool & Pleasant",
          tourRecommendation: "Best Month",
          birdWatching: 5,
          tigerActivity: 5,
          photography: 5,
          crowdLevel: "High",
          mosquitoLevel: "Low",
          forestCondition: "Lush & Calm",
          recommendedClothing: "Light cotton, light jacket/cardigan for evenings",
          recommendedEquipment: "DSLR zoom lens, binoculars, bird guide booklet",
          summary: "November marks the start of peak season. Calm seas and mild temperature ranges provide outstanding conditions for multi-day cruises.",
          bestTimeScore: 5,
          bestTimeReason: "Excellent comfortable weather, peak season, high tiger sightings"
        },
        {
          month: 12,
          temperature: "16°C - 26°C",
          humidity: "62%",
          rainfall: "Very Low",
          riverCondition: "Calm",
          weather: "Cool & Sunny",
          tourRecommendation: "Best Month",
          birdWatching: 5,
          tigerActivity: 5,
          photography: 5,
          crowdLevel: "Very High",
          mosquitoLevel: "Low",
          forestCondition: "Misty & Gold",
          recommendedClothing: "Sweater, windcheater, woolen socks",
          recommendedEquipment: "Tripod, zoom lenses, binoculars, lens wipes",
          summary: "December is the busiest month. Clear winter sun, low mosquito levels, and cold jungle breezes provide a cozy family vacation.",
          bestTimeScore: 5,
          bestTimeReason: "Peak tourism, ideal for families and wildlife photography"
        }
      ]);
    }

    // 3. Seed 2026 Bangladesh Holidays
    const countHolidays = await Holiday.countDocuments();
    if (countHolidays === 0) {
      await Holiday.create([
        { title: "New Year's Day", titleBn: "ইংরেজি নববর্ষ", date: "2026-01-01", type: "festival", description: "First day of the Gregorian calendar.", color: "#3b82f6" },
        { title: "Shaheed Day & International Mother Language Day", titleBn: "শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস", date: "2026-02-21", type: "national", description: "Language movement martyrdom day.", color: "#ef4444" },
        { title: "Shab-e-Barat", titleBn: "শবে বরাত", date: "2026-03-14", type: "religious", description: "Night of fortune and forgiveness.", color: "#a855f7" },
        { title: "Sheikh Mujib's Birthday", titleBn: "জাতির পিতা বঙ্গবন্ধু শেখ মুজিবুর রহমানের জন্মবার্ষিকী", date: "2026-03-17", type: "national", description: "Birthday of the Father of the Nation.", color: "#10b981" },
        { title: "Independence & National Day", titleBn: "স্বাধীনতা ও জাতীয় দিবস", date: "2026-03-26", type: "national", description: "Declaration of Independence day.", color: "#dc2626" },
        { title: "Bengali New Year (Pohela Boishakh)", titleBn: "পহেলা বৈশাখ", date: "2026-04-14", type: "festival", description: "Bengali calendar first day celebrations.", color: "#f97316" },
        { title: "Shab-e-Qadr", titleBn: "শবে কদর", date: "2026-04-15", type: "religious", description: "The night of power in Ramadan.", color: "#8b5cf6" },
        { title: "Eid-ul-Fitr Holiday", titleBn: "ঈদুল ফিতরের ছুটি", date: "2026-04-18", type: "religious", description: "Pre-Eid holiday block.", color: "#10b981" },
        { title: "Eid-ul-Fitr (Day 1)", titleBn: "ঈদুল ফিতর (১ম দিন)", date: "2026-04-19", type: "religious", description: "Celebration of Eid-ul-Fitr.", color: "#047857" },
        { title: "Eid-ul-Fitr Holiday", titleBn: "ঈদুল ফিতরের ছুটি", date: "2026-04-20", type: "religious", description: "Post-Eid holiday block.", color: "#10b981" },
        { title: "May Day", titleBn: "মে দিবস", date: "2026-05-01", type: "national", description: "International Workers' Day.", color: "#ef4444" },
        { title: "Buddha Purnima", titleBn: "বুদ্ধ পূর্ণিমা", date: "2026-05-02", type: "religious", description: "Birth, enlightenment and death of Gautama Buddha.", color: "#f59e0b" },
        { title: "Eid-ul-Adha Holiday", titleBn: "ঈদুল আজহার ছুটি", date: "2026-06-25", type: "religious", description: "Pre-Eid holiday block.", color: "#10b981" },
        { title: "Eid-ul-Adha (Day 1)", titleBn: "ঈদুল আজহা (১ম দিন)", date: "2026-06-26", type: "religious", description: "Feast of the Sacrifice.", color: "#047857" },
        { title: "Eid-ul-Adha Holiday", titleBn: "ঈদুল আজহার ছুটি", date: "2026-06-27", type: "religious", description: "Post-Eid holiday block.", color: "#10b981" },
        { title: "Ashura", titleBn: "আশুরা", date: "2026-07-25", type: "religious", description: "10th of Muharram commemoration.", color: "#6b7280" },
        { title: "National Mourning Day", titleBn: "জাতীয় শোক দিবস", date: "2026-08-15", type: "national", description: "Assassination anniversary of Sheikh Mujibur Rahman.", color: "#1f2937" },
        { title: "Janmashtami", titleBn: "জন্মাষ্টমী", date: "2026-09-04", type: "religious", description: "Lord Krishna's birthday.", color: "#3b82f6" },
        { title: "Eid-e-Milad-un-Nabi", titleBn: "ঈদে মিলাদুন্নবী", date: "2026-09-15", type: "religious", description: "Birth and demise of Prophet Muhammad.", color: "#10b981" },
        { title: "Durga Puja (Bijoya Dashami)", titleBn: "দুর্গাপূজা (বিজয়া দশমী)", date: "2026-10-20", type: "religious", description: "Victory of Goddess Durga.", color: "#ec4899" },
        { title: "Victory Day", titleBn: "মহান বিজয় দিবস", date: "2026-12-16", type: "national", description: "Victory over Pakistani occupation forces in 1971.", color: "#b91c1c" },
        { title: "Christmas Day", titleBn: "যীশু খ্রীষ্টের জন্মদিন (বড়দিন)", date: "2026-12-25", type: "religious", description: "Nativity of Jesus Christ.", color: "#2563eb" },
      ]);
    }

    // 4. Seed Tour Availabilities
    const countAvailability = await TourAvailability.countDocuments();
    if (countAvailability === 0) {
      await TourAvailability.create([
        { date: "2026-11-13", status: "limited", remainingSeats: 6, reason: "Peak season rush" },
        { date: "2026-12-16", status: "limited", remainingSeats: 2, reason: "Victory Day long weekend demand" },
        { date: "2026-12-25", status: "full", remainingSeats: 0, reason: "Fully Booked - Christmas holiday group" },
        { date: "2026-06-26", status: "closed", remainingSeats: 0, reason: "Closed - High monsoon tide safety" },
      ]);
    }

    // 5. Seed Announcements
    const countAnnouncements = await Announcement.countDocuments();
    if (countAnnouncements === 0) {
      await Announcement.create([
        {
          title: "Sundarban Forest Department Entry Fee Update",
          description: "Starting from November 2026, the Bangladesh Forest Department has announced a 10% raise in general entry fees for domestic and foreign tourists.",
          startDate: "2026-07-01",
          endDate: "2026-12-31",
          priority: "medium",
        },
        {
          title: "Monsoon Safety Sailing Restrictions",
          description: "All tourist cruiser ship sailings inside Kotka and Kochikhali paths are suspended from June 15 to September 15 due to high tides.",
          startDate: "2026-06-15",
          endDate: "2026-09-15",
          priority: "high",
        }
      ]);
    }

    // 6. Seed Places (14 points including deep Bagerhat UNESCO info)
    const countPlaces = await Place.countDocuments();
    let places = [];
    if (countPlaces === 0) {
      places = await Place.create([
        {
          name: "Khulna",
          nameBn: "খুলনা",
          slug: "khulna",
          latitude: 22.8456,
          longitude: 89.5403,
          category: "gateway",
          description: "The primary industrial and transit city in south-western Bangladesh. It acts as the headquarter launchpad for most luxury Sundarban ship cruises.",
          history: "Located on the banks of the Rupsha and Bhairab rivers, Khulna has historically served as a riverine trade hub connecting the delta to the northern divisions.",
          featuredImage: "https://images.unsplash.com/photo-1596422847122-c90a340a4c28?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1596422847122-c90a340a4c28?w=800",
            "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800"
          ],
          wildlife: { tiger: 0, deer: 0, crocodile: 0, dolphin: 0, birds: 1, reptiles: 0 },
          bestSeason: "October to March",
          travelTime: "Start point",
          distance: "0 km",
          boatTime: "0 hours",
          tips: ["Arrive a day early if boarding a morning cruise ship.", "Explore the Rupsha bridge area in the evening.", "Local launch terminals are highly crowded, keep your luggage secure."],
          featured: true
        },
        {
          name: "Bagerhat",
          nameBn: "বাগেরহাট",
          slug: "bagerhat",
          latitude: 22.6602,
          longitude: 89.7895,
          category: "gateway",
          description: "Historic Mosque City of Bagerhat, an outstanding UNESCO World Heritage site displaying ancient brick architecture.",
          history: "Founded in the 15th century by the Turkish warrior-saint Khan Jahan Ali. It represents an exceptional example of early Islamic brick architecture in Bengal, utilizing salt-resistant lime mortar.",
          featuredImage: "https://images.unsplash.com/photo-1627918809476-eb3ef2ffba91?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1627918809476-eb3ef2ffba91?w=800",
            "https://images.unsplash.com/photo-1608958416738-f1f41b315263?w=800"
          ],
          wildlife: { tiger: 0, deer: 0, crocodile: 1, dolphin: 0, birds: 3, reptiles: 1 },
          bestSeason: "October to April",
          travelTime: "45 minutes from Khulna",
          distance: "30 km",
          boatTime: "No boat required",
          tips: [
            "UNESCO Badge City: visit the famous Sixty Dome Mosque (Shat Gombuj) built in 1459.",
            "Visit the Shrine of Khan Jahan Ali and view the sacred marsh crocodiles.",
            "Explore the historic Nine-Dome Mosque and the Bagerhat Museum.",
            "Suggested 1-day itinerary: Bus to Bagerhat from Khulna -> Explore Mosques -> Lunch -> Visit Shrine -> Drive to Mongla for night stay."
          ],
          featured: true
        },
        {
          name: "Mongla Port",
          nameBn: "মংলা বন্দর",
          slug: "mongla-port",
          latitude: 22.4842,
          longitude: 89.6053,
          category: "gateway",
          description: "The second busiest seaport in Bangladesh, situated on the Pashur River. It is the immediate entry gateway to the Sundarban mangrove forest.",
          history: "Established in 1950 to reduce pressure on Chittagong port. It is historically the direct boarding point for smaller forest department launches and wood-boats.",
          featuredImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"
          ],
          wildlife: { tiger: 0, deer: 0, crocodile: 0, dolphin: 2, birds: 2, reptiles: 0 },
          bestSeason: "Year round",
          travelTime: "1.5 hours from Khulna",
          distance: "50 km",
          boatTime: "Start point of boat voyages",
          tips: ["Mongla is the best boarding point to save boat travel time.", "Stock up on medicine, dry foods, and powerbanks here.", "Ensure your forest entry permits are stamped at the Mongla Forest Office."],
          featured: true
        },
        {
          name: "Karamjal",
          nameBn: "করমজল",
          slug: "karamjal",
          latitude: 22.4285,
          longitude: 89.5910,
          category: "spot",
          description: "A deer breeding and tourist visitor center maintained by the Forest Department. Features a long wooden walkway through the forest canopy.",
          history: "Established in the late 1990s to educate visitors about mangrove ecology and protect rare saltwater crocodiles and spotted deer species.",
          featuredImage: "https://images.unsplash.com/photo-1581888227599-779811939961?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1581888227599-779811939961?w=800"
          ],
          wildlife: { tiger: 1, deer: 5, crocodile: 5, dolphin: 1, birds: 4, reptiles: 4 },
          bestSeason: "October to April",
          travelTime: "45 minutes from Mongla",
          distance: "8 km",
          boatTime: "45 minutes",
          tips: ["Great for families and children due to the safe wooden boardwalk.", "Visit the turtle and crocodile rearing ponds.", "Keep small bags secure; monkeys are active and grab food from hands."],
          featured: false
        },
        {
          name: "Harbaria",
          nameBn: "হারবাড়িয়া",
          slug: "harbaria",
          latitude: 22.3015,
          longitude: 89.6134,
          category: "spot",
          description: "An eco-tourism sanctuary presenting a raw, dense mangrove experience. Home to tiger pawprints, diverse birds, and a beautiful lotus pond.",
          history: "Harbaria serves as a vital monitoring camp for the Forest Department and is a prime research habitat for the Sundarban tiger census.",
          featuredImage: "https://images.unsplash.com/photo-1608958416738-f1f41b315263?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1608958416738-f1f41b315263?w=800"
          ],
          wildlife: { tiger: 3, deer: 4, crocodile: 3, dolphin: 2, birds: 5, reptiles: 3 },
          bestSeason: "November to February",
          travelTime: "2 hours from Mongla",
          distance: "22 km",
          boatTime: "2 hours",
          tips: ["Keep absolute silence while walking the forest trail.", "Inspect the mudbanks carefully for fresh tiger pawprints.", "A forest guard with arms is mandatory for walking this trail."],
          featured: false
        },
        {
          name: "Katka",
          nameBn: "কটকা",
          slug: "katka",
          latitude: 21.8543,
          longitude: 89.7824,
          category: "spot",
          description: "One of the most popular sanctuaries inside the Sundarbans. Famous for its massive herds of spotted deer, watchtowers, and proximity to tiger paths.",
          history: "Historically a crucial base for wildlife monitoring, Katka features ruins of old salt-boiling pans and is highly recognized for its coastal biodiversity.",
          featuredImage: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800"
          ],
          wildlife: { tiger: 4, deer: 5, crocodile: 2, dolphin: 3, birds: 5, reptiles: 3 },
          bestSeason: "November to January",
          travelTime: "6 hours from Mongla",
          distance: "85 km",
          boatTime: "6 hours on engine vessel",
          tips: ["Climb the watchtower early morning to observe herds of feeding deer.", "Explore the 'Tiger Hill' trail under guided supervision.", "Observe wild boars and eagles near the beach marshes."],
          featured: true
        },
        {
          name: "Kochikhali",
          nameBn: "কচিখালি",
          slug: "kochikhali",
          latitude: 21.8492,
          longitude: 89.8402,
          category: "spot",
          description: "Also known as Tiger Point. A deep forest clearing facing the Bay of Bengal, where dense forests meet wide open grasslands.",
          history: "Famous as a resting place for large forest animals, Kochikhali has historically registered the highest frequency of daytime tiger sightings.",
          featuredImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"
          ],
          wildlife: { tiger: 5, deer: 5, crocodile: 2, dolphin: 2, birds: 4, reptiles: 4 },
          bestSeason: "November to February",
          travelTime: "7 hours from Mongla",
          distance: "92 km",
          boatTime: "7 hours",
          tips: ["Walk along the grassy fields to spot deer and wild boars.", "Stay close to your group; grass can hide tigers easily.", "Carry a water bottle, as the walking trail is 3 km long."],
          featured: true
        },
        {
          name: "Hiron Point",
          nameBn: "হিরন পয়েন্ট",
          slug: "hiron-point",
          latitude: 21.7964,
          longitude: 89.4678,
          category: "spot",
          description: "Nilkamal or Hiron Point is a beautiful sanctuary located on the western bank of the river, acting as a resting point for sea-bound ships.",
          history: "A historical navy and port monitoring base, it houses a key rest-house of the Port Authority and has extensive wildlife protection areas.",
          featuredImage: "https://images.unsplash.com/photo-1596422847122-c90a340a4c28?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1596422847122-c90a340a4c28?w=800"
          ],
          wildlife: { tiger: 4, deer: 4, crocodile: 3, dolphin: 4, birds: 5, reptiles: 3 },
          bestSeason: "December to February",
          travelTime: "8 hours from Mongla",
          distance: "105 km",
          boatTime: "8 hours",
          tips: ["Walk the wooden path leading from Nilkamal camp.", "Look for barking deer and monkeys.", "Monsoon waters around this area are extremely rough and choppy."],
          featured: true
        },
        {
          name: "Andharmanik",
          nameBn: "আন্ধারমানিক",
          slug: "andharmanik",
          latitude: 21.8906,
          longitude: 89.5167,
          category: "spot",
          description: "A serene eco-tourism spot along the western range, featuring narrow canals and giant mangrove roots.",
          history: "Established to allow eco-tourists to experience deep forest wilderness away from busier eastern tourist hotspots like Katka.",
          featuredImage: "https://images.unsplash.com/photo-1608958416738-f1f41b315263?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1608958416738-f1f41b315263?w=800"
          ],
          wildlife: { tiger: 2, deer: 3, crocodile: 4, dolphin: 2, birds: 4, reptiles: 3 },
          bestSeason: "November to March",
          travelTime: "7 hours from Mongla",
          distance: "90 km",
          boatTime: "7 hours",
          tips: ["Take a wooden row-boat ride through the Andharmanik canal.", "Excellent spot for hearing diverse bird calls in the afternoon.", "Watch out for mudskippers on the exposed roots."],
          featured: false
        },
        {
          name: "Dobeki",
          nameBn: "দোবেকি",
          slug: "dobeki",
          latitude: 21.8655,
          longitude: 89.2455,
          category: "spot",
          description: "Features a unique 1-km long gated metal canopy walk which rises 10 feet above the forest floor, allowing safe walks in deep tiger territory.",
          history: "Built by the Forest Department to enable visitors to experience the core jungle habitat securely without direct contact with wild beasts.",
          featuredImage: "https://images.unsplash.com/photo-1581888227599-779811939961?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1581888227599-779811939961?w=800"
          ],
          wildlife: { tiger: 4, deer: 4, crocodile: 2, dolphin: 1, birds: 4, reptiles: 3 },
          bestSeason: "December to February",
          travelTime: "9 hours from Mongla",
          distance: "115 km",
          boatTime: "9 hours",
          tips: ["Walk the elevated canopy walkway to view tiger paths below.", "Keep voice volume down to avoid scaring animals.", "Freshwater pond here attracts deer herds in the afternoon."],
          featured: false
        },
        {
          name: "Kalagachhia",
          nameBn: "কলাগাছিয়া",
          slug: "kalagachhia",
          latitude: 22.2132,
          longitude: 89.1418,
          category: "spot",
          description: "Located on the western edge of the forest near Satkhira range. Known for its friendly deer population and watchtowers.",
          history: "Serves as the main gateway for visitors entering from Satkhira and Shyamnagar districts.",
          featuredImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"
          ],
          wildlife: { tiger: 2, deer: 5, crocodile: 2, dolphin: 1, birds: 4, reptiles: 2 },
          bestSeason: "October to April",
          travelTime: "11 hours from Mongla",
          distance: "135 km",
          boatTime: "11 hours",
          tips: ["Feed the deer with local leaves under guide supervision.", "Climb the watchtower for a panoramic view of the Satkhira boundary.", "Observe mud-crabs along the shoreline paths."],
          featured: false
        },
        {
          name: "Jamtala Beach",
          nameBn: "জামতলা সৈকত",
          slug: "jamtala-beach",
          latitude: 21.8391,
          longitude: 89.7876,
          category: "spot",
          description: "A pristine, untouched sand beach next to Katka. Offers absolute solitude where jungle trees meet the sea waves.",
          history: "Noted as one of the most remote beaches in Bangladesh, Jamtala has remained natural with no commercial tourist stalls.",
          featuredImage: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800"
          ],
          wildlife: { tiger: 3, deer: 4, crocodile: 1, dolphin: 2, birds: 4, reptiles: 2 },
          bestSeason: "November to February",
          travelTime: "20-minute walk from Katka",
          distance: "86 km",
          boatTime: "Walk from Katka",
          tips: ["Walk the 2.5 km trail from Katka office through the forest.", "Swimming is dangerous due to strong undercurrents and quicksand.", "Collect seashells but do not damage beach dunes."],
          featured: false
        },
        {
          name: "Dimer Char",
          nameBn: "ডিমের চর",
          slug: "dimer-char",
          latitude: 21.8433,
          longitude: 89.8974,
          category: "spot",
          description: "An emerging sandbar island (char) next to Kochikhali, popular for watching sunrises and crabs.",
          history: "Formed by river silt accumulation, it is a nesting ground for red crabs and sea gulls.",
          featuredImage: "https://images.unsplash.com/photo-1608958416738-f1f41b315263?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1608958416738-f1f41b315263?w=800"
          ],
          wildlife: { tiger: 1, deer: 2, crocodile: 1, dolphin: 3, birds: 5, reptiles: 1 },
          bestSeason: "November to March",
          travelTime: "20 minutes boat ride from Kochikhali",
          distance: "95 km",
          boatTime: "20 minutes from Kochikhali",
          tips: ["Visit at sunrise to see millions of red crabs coloring the beach.", "Bring sand-proof footwear.", "Listen to the crashing sea surf in absolute peace."],
          featured: false
        },
        {
          name: "Dublar Char",
          nameBn: "দুবলার চর",
          slug: "dublar-char",
          latitude: 21.7167,
          longitude: 89.5833,
          category: "spot",
          description: "A famous island village populated temporarily by fishermen drying fish during the winter months. Famous for the Rush Mela festival.",
          history: "For generations, fishermen from Chittagong and Khulna settle here during winter for dry-fish processing, paying taxes to the Forest Department.",
          featuredImage: "https://images.unsplash.com/photo-1596422847122-c90a340a4c28?w=800",
          gallery: [
            "https://images.unsplash.com/photo-1596422847122-c90a340a4c28?w=800"
          ],
          wildlife: { tiger: 1, deer: 3, crocodile: 1, dolphin: 3, birds: 4, reptiles: 2 },
          bestSeason: "November to January",
          travelTime: "9 hours from Mongla",
          distance: "110 km",
          boatTime: "9 hours",
          tips: ["Observe traditional dry-fish making (Shutki processing).", "Visit during the annual 'Rash Mela' festival in November.", "Support local fishermen by purchasing authentic dry-fish products."],
          featured: true
        }
      ]);
    }

    // 7. Seed Routes (Connected polylines matching transit flows)
    const countRoutes = await Route.countDocuments();
    if (countRoutes === 0) {
      await Route.create([
        {
          title: "Khulna to Bagerhat Road Connection",
          startPlace: "Khulna",
          endPlace: "Bagerhat",
          distance: "30 km",
          estimatedTime: "45 mins",
          transportType: "bus",
          coordinates: [[22.8456, 89.5403], [22.7500, 89.6600], [22.6602, 89.7895]]
        },
        {
          title: "Bagerhat to Mongla Port Highway",
          startPlace: "Bagerhat",
          endPlace: "Mongla Port",
          distance: "40 km",
          estimatedTime: "50 mins",
          transportType: "bus",
          coordinates: [[22.6602, 89.7895], [22.5600, 89.7200], [22.4842, 89.6053]]
        },
        {
          title: "Khulna to Mongla Port Direct",
          startPlace: "Khulna",
          endPlace: "Mongla Port",
          distance: "50 km",
          estimatedTime: "1.5 hours",
          transportType: "bus",
          coordinates: [[22.8456, 89.5403], [22.6600, 89.5800], [22.4842, 89.6053]]
        },
        {
          title: "Mongla Port to Karamjal Cruise",
          startPlace: "Mongla Port",
          endPlace: "Karamjal",
          distance: "8 km",
          estimatedTime: "45 mins",
          transportType: "boat",
          coordinates: [[22.4842, 89.6053], [22.4500, 89.6000], [22.4285, 89.5910]]
        },
        {
          title: "Karamjal to Harbaria Wildlife Sanctuary",
          startPlace: "Karamjal",
          endPlace: "Harbaria",
          distance: "14 km",
          estimatedTime: "1.2 hours",
          transportType: "boat",
          coordinates: [[22.4285, 89.5910], [22.3600, 89.5900], [22.3015, 89.6134]]
        },
        {
          title: "Harbaria to Katka Sanctuary deep sail",
          startPlace: "Harbaria",
          endPlace: "Katka",
          distance: "63 km",
          estimatedTime: "4 hours",
          transportType: "boat",
          coordinates: [[22.3015, 89.6134], [22.1500, 89.6500], [22.0000, 89.7200], [21.8543, 89.7824]]
        },
        {
          title: "Katka to Kochikhali Forest Connection",
          startPlace: "Katka",
          endPlace: "Kochikhali",
          distance: "7 km",
          estimatedTime: "30 mins",
          transportType: "boat",
          coordinates: [[21.8543, 89.7824], [21.8500, 89.8100], [21.8492, 89.8402]]
        },
        {
          title: "Katka to Jamtala Beach Forest Walk",
          startPlace: "Katka",
          endPlace: "Jamtala Beach",
          distance: "2.5 km",
          estimatedTime: "40 mins",
          transportType: "walk",
          coordinates: [[21.8543, 89.7824], [21.8480, 89.7850], [21.8391, 89.7876]]
        },
        {
          title: "Kochikhali to Dimer Char sunrise trip",
          startPlace: "Kochikhali",
          endPlace: "Dimer Char",
          distance: "6 km",
          estimatedTime: "20 mins",
          transportType: "boat",
          coordinates: [[21.8492, 89.8402], [21.8433, 89.8974]]
        },
        {
          title: "Kochikhali to Dublar Char open sea sail",
          startPlace: "Kochikhali",
          endPlace: "Dublar Char",
          distance: "40 km",
          estimatedTime: "2.5 hours",
          transportType: "boat",
          coordinates: [[21.8492, 89.8402], [21.8000, 89.7800], [21.7167, 89.5833]]
        },
        {
          title: "Dublar Char to Hiron Point sail",
          startPlace: "Dublar Char",
          endPlace: "Hiron Point",
          distance: "15 km",
          estimatedTime: "1 hour",
          transportType: "boat",
          coordinates: [[21.7167, 89.5833], [21.7600, 89.5200], [21.7964, 89.4678]]
        },
        {
          title: "Hiron Point to Andharmanik sail",
          startPlace: "Hiron Point",
          endPlace: "Andharmanik",
          distance: "15 km",
          estimatedTime: "1.2 hours",
          transportType: "boat",
          coordinates: [[21.7964, 89.4678], [21.8400, 89.4900], [21.8906, 89.5167]]
        },
        {
          title: "Andharmanik to Dobeki canopy path",
          startPlace: "Andharmanik",
          endPlace: "Dobeki",
          distance: "30 km",
          estimatedTime: "2 hours",
          transportType: "boat",
          coordinates: [[21.8906, 89.5167], [21.8800, 89.3800], [21.8655, 89.2455]]
        },
        {
          title: "Dobeki to Kalagachhia Satkhira range trip",
          startPlace: "Dobeki",
          endPlace: "Kalagachhia",
          distance: "42 km",
          estimatedTime: "3 hours",
          transportType: "boat",
          coordinates: [[21.8655, 89.2455], [22.0300, 89.2000], [22.2132, 89.1418]]
        }
      ]);
    }

    // 8. Seed Packages (if count was 0)
    const countPackages = await Package.countDocuments();
    if (countPackages === 0) {
      await Package.create([
        {
          title: "Sundarban Explorer Premium Tour",
          slug: slugify("Sundarban Explorer Premium Tour"),
          description: "An intensive 3-day deep adventure into the heart of the world's largest mangrove forest. Explore wildlife sanctuary paths, view royal Bengal tigers in their natural habitats, and experience the serene beauty of the wilderness.",
          duration: "3 Days, 2 Nights",
          price: 15500,
          location: "Sundarban, Bangladesh",
          images: [
            "https://images.unsplash.com/photo-1581888227599-779811939961?w=800",
            "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800",
          ],
          featured: true,
          included: ["Luxury ship accommodation", "All buffet meals during the trip", "Experienced forest guides", "Armed security guards", "Forest entry fees and permissions"],
          excluded: ["Travel insurance", "Personal tips and shopping", "Soft drinks and alcohol"],
          itinerary: [
            { day: 1, title: "Journey to Khulna & Forest Entry", description: "Board the cruise ship early morning at Khulna. Sail towards Sundarbans, pass through the Dhangmari forest station to get permits, and anchor near Kotka in the evening." },
            { day: 2, title: "Wildlife Spotting & Canal Cruising", description: "Explore the Kotka Wildlife Sanctuary and climb the watchtower. Take a silent wooden boat cruise through narrow mangrove canals to spot rare birds, deer, and river dolphins." },
            { day: 3, title: "Karamjal Visit & Return Voyage", description: "Visit Karamjal Deer Breeding Center and walk the wooden trail. Begin the return sail towards Khulna, arriving by late evening to conclude the tour." },
          ],
        },
        {
          title: "Kotka & Kochikhali Adventure",
          slug: slugify("Kotka & Kochikhali Adventure"),
          description: "Experience the ultimate wilderness walk. Wander through deep tiger territories, pristine sand beaches, and the dense forest canopy. Perfect for photographers and nature lovers.",
          duration: "2 Days, 1 Night",
          price: 9800,
          location: "Sundarban, Bangladesh",
          images: [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
            "https://images.unsplash.com/photo-1608958416738-f1f41b315263?w=800",
          ],
          featured: false,
          included: ["Standard cabin cruise stay", "Meals and snacks", "Local forest tour guide", "Entry permits"],
          excluded: ["Khulna transport setup", "Personal expenses"],
          itinerary: [
            { day: 1, title: "Sail to Kotka Sanctuary", description: "Board at Mongla port, proceed to Kotka forest office. Walk the trail to the watchtower to spot wildlife." },
            { day: 2, title: "Kochikhali Walking Trail & Return", description: "Early morning walk in Kochikhali deep forest area. Cruise back to Mongla by evening." },
          ],
        },
      ]);
    }

    // 9. Seed Blogs (Bilingual!)
    const countBlogs = await Blog.countDocuments();
    if (countBlogs === 0) {
      await Blog.create([
        {
          title: "A Complete Guide to Visiting the Sundarbans",
          titleBn: "সুন্দরবন ভ্রমণের একটি সম্পূর্ণ নির্দেশিকা",
          slug: slugify("A Complete Guide to Visiting the Sundarbans"),
          content: "The Sundarbans, the world's largest contiguous mangrove forest, is a true wonder of nature. Spanning across Bangladesh and India, it is home to the legendary Royal Bengal Tiger. Planning a trip here requires understanding forest permits, choosing the right tour operator, and packing appropriate light clothing. The best time to visit is between November and February when the weather is mild.",
          contentBn: "সুন্দরবন, বিশ্বের বৃহত্তম ম্যানগ্রোভ বন, প্রকৃতির একটি বাস্তব বিস্ময়। বাংলাদেশ ও ভারতের বিস্তৃত এলাকা জুড়ে অবস্থিত এই বনটি বিখ্যাত রয়্যাল বেঙ্গল টাইগারের আবাসস্থল। এখানে ভ্রমণের পরিকল্পনা করার জন্য বনের অনুমতিপত্রালোচনা করা, সঠিক ট্যুর অপারেটর নির্বাচন করা এবং সঠিক পোশাক সাথে রাখা প্রয়োজন। ভ্রমণের সেরা সময় হল নভেম্বর থেকে ফেব্রুয়ারি যখন আবহাওয়া মনোরম থাকে।",
          thumbnail: "https://images.unsplash.com/photo-1581888227599-779811939961?w=800",
          author: "Admin Explorer",
        },
        {
          title: "5 Essential Tips for Sundarban Wildlife Photography",
          titleBn: "সুন্দরবন বন্যপ্রাণী ফটোগ্রাফির জন্য ৫টি প্রয়োজনীয় টিপস",
          slug: slugify("5 Essential Tips for Sundarban Wildlife Photography"),
          content: "Capturing the wild beauty of the Sundarbans is a photographer's dream. To succeed, make sure to bring a telephoto lens (at least 300mm), prepare for high humidity, stay silent during boat cruises, keep your camera steady in floating vessels, and always respect the forest animals by maintaining a safe distance.",
          contentBn: "সুন্দরবনের বন্য সৌন্দর্য ক্যামেরাবন্দী করা প্রতিটি ফটোগ্রাফারের স্বপ্ন। সফল হতে হলে, একটি টেলিফটো লেন্স (কমপক্ষে ৩০০ মিমি) সাথে রাখুন, অতিরিক্ত আর্দ্রতার জন্য প্রস্তুতি নিন, নৌকা ভ্রমণের সময় সম্পূর্ণ নীরব থাকুন, ভাসমান নৌযানে ক্যামেরা স্থির রাখুন এবং সর্বদা বন্যপ্রাণীকে নিরাপদ দূরত্ব বজায় রেখে সম্মান জানান।",
          thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
          author: "Bushra Arifeen",
        },
      ]);
    }

    // 10. Seed Testimonials
    const countTestimonials = await Testimonial.countDocuments();
    if (countTestimonials === 0) {
      await Testimonial.create([
        {
          name: "Sabbir Rahman",
          designation: "Corporate Manager",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          review: "Our corporate retreat with Insaniat Parjatan was outstanding. The service, standard of meals, and guide knowledge exceeded all our expectations.",
          rating: 5,
        },
        {
          name: "Dr. Anika Tabassum",
          designation: "Wildlife Researcher",
          photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          review: "As a biologist, I really appreciated how eco-friendly the crew was. The silent woodboat canal exploration was the highlight of the tour.",
          rating: 5,
        },
      ]);
    }

    // 11. Seed Gallery
    const countGallery = await Gallery.countDocuments();
    if (countGallery === 0) {
      await Gallery.create([
        { title: "Sundarban Mangrove Sunrise", image: "https://images.unsplash.com/photo-1608958416738-f1f41b315263?w=800" },
        { title: "Deer Drinking Water", image: "https://images.unsplash.com/photo-1581888227599-779811939961?w=800" },
        { title: "Sailing in Sundarban Canals", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800" },
      ]);
    }

    return apiResponse(
      200,
      {
        admin: adminEmail,
        seasonsSeeded: countSeasons === 0 ? 12 : 0,
        holidaysSeeded: countHolidays === 0 ? 22 : 0,
        availabilitiesSeeded: countAvailability === 0 ? 4 : 0,
        announcementsSeeded: countAnnouncements === 0 ? 2 : 0,
        placesSeeded: countPlaces === 0 ? 14 : 0,
        routesSeeded: countRoutes === 0 ? 14 : 0,
      },
      "Database seeded successfully with Travel Calendar and Route Map resources!"
    );
  } catch (error: any) {
    console.error("Seeding error:", error);
    return apiError(500, error.message || "Seeding failed");
  }
}

export const dynamic = "force-dynamic";
