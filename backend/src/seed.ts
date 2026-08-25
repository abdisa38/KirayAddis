import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import { User } from "./models/User.js";
import { Property } from "./models/Property.js";
import { Inquiry } from "./models/Inquiry.js";
import { Message } from "./models/Message.js";
import { Viewing } from "./models/Viewing.js";
import { Report } from "./models/Report.js";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {}

dotenv.config();

// Curated high-res unique architecture & interior photos
const photos = {
  // Bole Apartments & Penthouses
  boleMedhanealem: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=900&q=80",
  ],
  boleAtlas: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80",
  ],
  boleRwandaPenthouse: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80",
  ],
  boleBrassStudio: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
  ],
  boleBulbulaVilla: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  ],

  // Kazanchis / Kirkos
  kazanchisStudio: [
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80",
  ],
  kazanchisBalcony: [
    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
  ],
  meskelFlower: [
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  ],
  goteraHighrise: [
    "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=80",
  ],

  // CMC & Yeka
  cmcMichaelCondo: [
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
  ],
  cmcSafaricomStudio: [
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505692794406-0a256976cb17?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  ],
  cmcSummitVilla: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=900&q=80",
  ],
  yekaAbadoHome: [
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
  ],
  yekaHillsPanoramic: [
    "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
  ],
  yekaMegenagnaFlat: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
  ],

  // Sarbet / Nifas Silk-Lafto
  sarbetDiplomaticVilla: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  ],
  sarbetTomocaFlat: [
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=900&q=80",
  ],
  bisrateGabrielCondo: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=900&q=80",
  ],
  jommoStudio: [
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505692794406-0a256976cb17?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  ],

  // Piassa / Arada
  piassaCorridor: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80",
  ],
  piassa4KiloStudio: [
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=80",
  ],
  aratKiloApartment: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
  ],

  // Lideta / Mexico
  lidetaCondo: [
    "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
  ],
  mexicoSquareFlat: [
    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
  ],

  // Gullele
  shiroMedaVilla: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=900&q=80",
  ],
  addisuGebeyaFlat: [
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=900&q=80",
  ],
};

const toMedia = (urls: string[]) => [
  { url: urls[0], isCover: true, type: "image" },
  { url: urls[1], isCover: false, type: "image" },
  { url: urls[2], isCover: false, type: "image" },
];

const seedData = async () => {
  try {
    const connUri = process.env.MONGO_URI;
    if (!connUri) throw new Error("MONGO_URI not configured in .env");

    console.log("[Seeder] Connecting to MongoDB Atlas...");
    await mongoose.connect(connUri);
    console.log("[Seeder] Connected successfully!");

    console.log("[Seeder] Clearing old collections...");
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Inquiry.deleteMany({}),
      Message.deleteMany({}),
      Viewing.deleteMany({}),
      Report.deleteMany({}),
    ]);

    console.log("[Seeder] Creating demo accounts...");
    const tenant = await User.create({
      name: "Alem Mengistu",
      email: "alem@example.com",
      phone: "+251911223344",
      password: "password123",
      role: "tenant",
      isEmailVerified: true,
      verificationTier: "id_verified",
      preferences: {
        workplace: "Bole Edna Mall area",
        budgetMax: 40000,
        maxCommuteMin: 30,
        mustHaveAmenities: ["Water tank", "Generator", "Parking", "24/7 security"],
      },
    });

    const landlord = await User.create({
      name: "Kalkidan Mengesha",
      email: "kalkidan@example.com",
      phone: "+251922334455",
      password: "password123",
      role: "landlord",
      isEmailVerified: true,
      verificationTier: "property_verified",
    });

    const admin = await User.create({
      name: "Admin Kiray",
      email: "admin@addiskiray.com",
      phone: "+251933445566",
      password: "adminpassword123",
      role: "admin",
      isEmailVerified: true,
      verificationTier: "property_verified",
    });

    console.log("[Seeder] Creating 26 realistic properties with unique galleries...");
    const properties = await Property.create([
      // 1. Bole Medhanealem (42,000 ETB)
      {
        owner: landlord._id,
        title: "Sunlit Two-Bedroom Apartment in Bole Medhanealem",
        description: "Set on a quiet residential street in Bole, this bright 2-bedroom apartment offers a generous living space, practical kitchen, and a balcony catching afternoon sunlight. Dedicated parking and 3,000L backup water reservoir.",
        propertyType: "Apartment",
        price: 42000,
        deposit: 42000,
        bedrooms: 2,
        bathrooms: 2,
        area: 92,
        location: {
          city: "Addis Ababa",
          subCity: "Bole",
          neighborhood: "Bole Medhanealem",
          landmark: "Near Edna Mall (1.3 km)",
          coordinates: { lat: 8.9984, lng: 38.7891 },
        },
        amenities: ["Parking", "Water", "Water tank", "Electricity", "Generator", "Compound", "Internet", "24/7 security", "Balcony"],
        media: toMedia(photos.boleMedhanealem),
        rentalTerms: { minContractMonths: 6, furnishing: "Partially furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 184, inquiries: 9, saves: 28 },
      },

      // 2. Bole Atlas (36,000 ETB)
      {
        owner: landlord._id,
        title: "Modern 2-Bed Flat near Bole Atlas Hotel",
        description: "Prime location near Atlas Hotel. Walking distance to supermarkets, cafes, and banks. Features open kitchen, generator backup, high-speed fiber internet, and 24/7 security.",
        propertyType: "Apartment",
        price: 36000,
        deposit: 36000,
        bedrooms: 2,
        bathrooms: 1,
        area: 85,
        location: {
          city: "Addis Ababa",
          subCity: "Bole",
          neighborhood: "Bole Atlas",
          landmark: "Near Atlas Hotel & Desalegn Hotel",
          coordinates: { lat: 9.0065, lng: 38.7824 },
        },
        amenities: ["Parking", "Water", "Electricity", "Generator", "Internet", "24/7 security"],
        media: toMedia(photos.boleAtlas),
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 95, inquiries: 7, saves: 19 },
      },

      // 3. Bole Rwanda Penthouse (95,000 ETB)
      {
        owner: landlord._id,
        title: "Luxury Penthouse Suite in Bole Rwanda",
        description: "Premium penthouse on top floor of new modern building in Bole Rwanda. Features private rooftop terrace with panoramic Addis Ababa city views, dedicated elevator, gym, and 24/7 security.",
        propertyType: "Apartment",
        price: 95000,
        deposit: 190000,
        bedrooms: 4,
        bathrooms: 3,
        area: 200,
        location: {
          city: "Addis Ababa",
          subCity: "Bole",
          neighborhood: "Bole Rwanda",
          landmark: "Near Rwanda Embassy & Bole Airport",
          coordinates: { lat: 8.9900, lng: 38.7990 },
        },
        amenities: ["Parking", "Water", "Water tank", "Electricity", "Generator", "Internet", "Elevator", "Balcony", "24/7 security", "CCTV", "Gym"],
        media: toMedia(photos.boleRwandaPenthouse),
        rentalTerms: { minContractMonths: 12, furnishing: "Fully furnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 245, inquiries: 14, saves: 42 },
      },

      // 4. Bole Brass Studio (24,000 ETB)
      {
        owner: landlord._id,
        title: "Cosy Studio Apartment in Bole Brass",
        description: "Compact, well-furnished studio perfect for single young professionals or expats working in Bole. Includes hot shower, high-speed WiFi, and 24/7 security guard.",
        propertyType: "Studio",
        price: 24000,
        deposit: 24000,
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        location: {
          city: "Addis Ababa",
          subCity: "Bole",
          neighborhood: "Bole Brass",
          landmark: "Near Bole Brass Clinic & Japan Embassy",
          coordinates: { lat: 8.9950, lng: 38.7840 },
        },
        amenities: ["Water", "Electricity", "Internet", "24/7 security", "Water tank"],
        media: toMedia(photos.boleBrassStudio),
        rentalTerms: { minContractMonths: 6, furnishing: "Fully furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 110, inquiries: 8, saves: 15 },
      },

      // 5. Bole Bulbula Villa (70,000 ETB)
      {
        owner: landlord._id,
        title: "Spacious Family Villa in Bole Bulbula",
        description: "Stand-alone 4-bedroom villa with private green garden, parking for 3 cars, and servant quarters. Secure gated community with round-the-clock patrol.",
        propertyType: "Villa",
        price: 70000,
        deposit: 140000,
        bedrooms: 4,
        bathrooms: 3,
        area: 220,
        location: {
          city: "Addis Ababa",
          subCity: "Bole",
          neighborhood: "Bole Bulbula",
          landmark: "Near Bulbula Mariam Church",
          coordinates: { lat: 8.9750, lng: 38.7800 },
        },
        amenities: ["Parking", "Water", "Water tank", "Electricity", "Generator", "Garden", "Compound", "24/7 security"],
        media: toMedia(photos.boleBulbulaVilla),
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 88, inquiries: 5, saves: 14 },
      },

      // 6. Kazanchis UNECA Studio (22,000 ETB)
      {
        owner: landlord._id,
        title: "Furnished Studio near Kazanchis Business District",
        description: "Modern studio within walking distance of UNECA, Radisson Blu, and Commercial Bank of Ethiopia HQ. Features clean finishes, backup power, and fast elevator.",
        propertyType: "Studio",
        price: 22000,
        deposit: 22000,
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        location: {
          city: "Addis Ababa",
          subCity: "Kirkos",
          neighborhood: "Kazanchis",
          landmark: "Near Commercial Bank of Ethiopia HQ & UNECA",
          coordinates: { lat: 9.0170, lng: 38.7700 },
        },
        amenities: ["Water", "Electricity", "Internet", "Elevator", "24/7 security", "Generator"],
        media: toMedia(photos.kazanchisStudio),
        rentalTerms: { minContractMonths: 3, furnishing: "Fully furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 165, inquiries: 11, saves: 31 },
      },

      // 7. Kazanchis 2-Bed Balcony (34,000 ETB)
      {
        owner: landlord._id,
        title: "Two-Bedroom Apartment with Balcony in Kazanchis",
        description: "Bright 2-bedroom flat on 4th floor with city views toward Menelik Palace. Secure compound with elevator, constant water supply, and dedicated car parking.",
        propertyType: "Apartment",
        price: 34000,
        deposit: 34000,
        bedrooms: 2,
        bathrooms: 1,
        area: 78,
        location: {
          city: "Addis Ababa",
          subCity: "Kirkos",
          neighborhood: "Kazanchis",
          landmark: "Near Hilton Hotel & Menelik Palace",
          coordinates: { lat: 9.0195, lng: 38.7654 },
        },
        amenities: ["Water", "Water tank", "Electricity", "Generator", "Elevator", "Balcony", "24/7 security", "Parking"],
        media: toMedia(photos.kazanchisBalcony),
        rentalTerms: { minContractMonths: 12, furnishing: "Partially furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 142, inquiries: 8, saves: 26 },
      },

      // 8. Meskel Flower 3-Bed (48,000 ETB)
      {
        owner: landlord._id,
        title: "Charming 3-Bed Apartment in Meskel Flower",
        description: "Spacious 3-bedroom family apartment in Meskel Flower. Close to international restaurants, supermarkets, and schools. Very quiet and green environment.",
        propertyType: "Apartment",
        price: 48000,
        deposit: 48000,
        bedrooms: 3,
        bathrooms: 2,
        area: 125,
        location: {
          city: "Addis Ababa",
          subCity: "Kirkos",
          neighborhood: "Meskel Flower",
          landmark: "Near Meskel Flower Hotel & Dreamliner",
          coordinates: { lat: 9.0010, lng: 38.7680 },
        },
        amenities: ["Parking", "Water", "Water tank", "Electricity", "Generator", "Balcony", "24/7 security"],
        media: toMedia(photos.meskelFlower),
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 78, inquiries: 4, saves: 16 },
      },

      // 9. Gotera High-Rise Condo (27,000 ETB)
      {
        owner: landlord._id,
        title: "Modern High-Rise Condo in Gotera / Olympia",
        description: "New 2-bedroom condominium with quick access to Bole road and Ring Road. High-floor unit with elevator, water reservoir, and 24-hour guard.",
        propertyType: "Condominium",
        price: 27000,
        deposit: 27000,
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        location: {
          city: "Addis Ababa",
          subCity: "Kirkos",
          neighborhood: "Gotera",
          landmark: "Near Gotera Interchange & Olympia",
          coordinates: { lat: 8.9880, lng: 38.7610 },
        },
        amenities: ["Parking", "Water", "Electricity", "Elevator", "24/7 security"],
        media: toMedia(photos.goteraHighrise),
        rentalTerms: { minContractMonths: 6, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 92, inquiries: 6, saves: 11 },
      },

      // 10. CMC Michael Condo (28,000 ETB)
      {
        owner: landlord._id,
        title: "Spacious Condominium Unit in CMC Michael",
        description: "Well-maintained 3-bedroom condominium in the peaceful CMC residential area. Gated compound with children's playground, 24-hour guard, and reliable water supply.",
        propertyType: "Condominium",
        price: 28000,
        deposit: 28000,
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        location: {
          city: "Addis Ababa",
          subCity: "CMC",
          neighborhood: "CMC Michael",
          landmark: "Near CMC St. Michael Church",
          coordinates: { lat: 9.0427, lng: 38.8362 },
        },
        amenities: ["Parking", "Water", "Electricity", "Compound", "Generator", "24/7 security"],
        media: toMedia(photos.cmcMichaelCondo),
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 82, inquiries: 5, saves: 14 },
      },

      // 11. CMC Safaricom Studio (15,000 ETB)
      {
        owner: landlord._id,
        title: "Affordable Studio near CMC Safaricom HQ",
        description: "Compact but well-designed studio apartment ideal for students or young professionals. Close to main bus and taxi routes for easy commute to city center.",
        propertyType: "Studio",
        price: 15000,
        deposit: 15000,
        bedrooms: 1,
        bathrooms: 1,
        area: 42,
        location: {
          city: "Addis Ababa",
          subCity: "CMC",
          neighborhood: "CMC Safaricom",
          landmark: "Near CMC Roundabout & Safaricom HQ",
          coordinates: { lat: 9.0445, lng: 38.8390 },
        },
        amenities: ["Water", "Electricity", "Internet", "24/7 security"],
        media: toMedia(photos.cmcSafaricomStudio),
        rentalTerms: { minContractMonths: 6, furnishing: "Fully furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 65, inquiries: 4, saves: 9 },
      },

      // 12. CMC Summit Villa (65,000 ETB)
      {
        owner: landlord._id,
        title: "Modern 3-Bed Villa in Summit Compound",
        description: "Clean modern villa inside a private residential compound in Summit. Features large living room, garden, 2-car garage, and backup generator.",
        propertyType: "Villa",
        price: 65000,
        deposit: 130000,
        bedrooms: 3,
        bathrooms: 3,
        area: 190,
        location: {
          city: "Addis Ababa",
          subCity: "CMC",
          neighborhood: "Summit",
          landmark: "Near Summit Soft Drinks Factory",
          coordinates: { lat: 9.0350, lng: 38.8550 },
        },
        amenities: ["Parking", "Water", "Water tank", "Electricity", "Generator", "Garden", "Compound", "24/7 security"],
        media: toMedia(photos.cmcSummitVilla),
        rentalTerms: { minContractMonths: 12, furnishing: "Partially furnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 115, inquiries: 6, saves: 21 },
      },

      // 13. Yeka Abado Family Home (39,500 ETB)
      {
        owner: landlord._id,
        title: "Quiet Home in a Secure Compound in Yeka",
        description: "Family home in peaceful Yeka neighborhood with large green compound. Reliable water with dedicated 4,000L tank, backup power, and guardhouse.",
        propertyType: "House",
        price: 39500,
        deposit: 79000,
        bedrooms: 3,
        bathrooms: 2,
        area: 115,
        location: {
          city: "Addis Ababa",
          subCity: "Yeka",
          neighborhood: "Yeka Abado",
          landmark: "Near British Embassy area",
          coordinates: { lat: 9.0289, lng: 38.8045 },
        },
        amenities: ["Parking", "Water", "Water tank", "Electricity", "Compound", "Garden", "24/7 security"],
        media: toMedia(photos.yekaAbadoHome),
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 120, inquiries: 7, saves: 23 },
      },

      // 14. Yeka Hills Panoramic Flat (45,000 ETB)
      {
        owner: landlord._id,
        title: "Panoramic Hillside Flat in Yeka Hills",
        description: "High-floor flat in Yeka Hills offering sweeping views of Addis Ababa. Recently renovated with modern kitchen, bright glass windows, and open balcony.",
        propertyType: "Apartment",
        price: 45000,
        deposit: 45000,
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        location: {
          city: "Addis Ababa",
          subCity: "Yeka",
          neighborhood: "Yeka Hills",
          landmark: "Near French Embassy & Signal area",
          coordinates: { lat: 9.0312, lng: 38.8100 },
        },
        amenities: ["Parking", "Water", "Water tank", "Electricity", "Generator", "Internet", "Balcony", "Elevator", "24/7 security"],
        media: toMedia(photos.yekaHillsPanoramic),
        rentalTerms: { minContractMonths: 12, furnishing: "Partially furnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 98, inquiries: 5, saves: 17 },
      },

      // 15. Yeka Megenagna Flat (31,000 ETB)
      {
        owner: landlord._id,
        title: "2-Bedroom Apartment near Megenagna Square",
        description: "Super accessible location near Megenagna Light Rail station and shopping malls. Quick transit to Bole, Kazanchis, and 4 Kilo.",
        propertyType: "Apartment",
        price: 31000,
        deposit: 31000,
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        location: {
          city: "Addis Ababa",
          subCity: "Yeka",
          neighborhood: "Megenagna",
          landmark: "Near Megenagna Light Rail Station",
          coordinates: { lat: 9.0200, lng: 38.7950 },
        },
        amenities: ["Water", "Electricity", "Elevator", "24/7 security", "Balcony"],
        media: toMedia(photos.yekaMegenagnaFlat),
        rentalTerms: { minContractMonths: 6, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 135, inquiries: 9, saves: 20 },
      },

      // 16. Sarbet Diplomatic Villa (85,000 ETB)
      {
        owner: landlord._id,
        title: "Elegant Diplomatic Villa in Sarbet",
        description: "Beautiful 4-bedroom villa in the quiet, prestigious Sarbet neighborhood favored by expats and diplomats. Large lush garden, 2-car covered garage, and modern kitchen.",
        propertyType: "Villa",
        price: 85000,
        deposit: 170000,
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        location: {
          city: "Addis Ababa",
          subCity: "Nifas Silk-Lafto",
          neighborhood: "Sarbet",
          landmark: "Near Lycée Guebre Mariam & ICS Addis",
          coordinates: { lat: 9.0022, lng: 38.7561 },
        },
        amenities: ["Parking", "Water", "Water tank", "Electricity", "Generator", "Garden", "Compound", "Internet", "24/7 security", "CCTV"],
        media: toMedia(photos.sarbetDiplomaticVilla),
        rentalTerms: { minContractMonths: 12, furnishing: "Fully furnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 155, inquiries: 8, saves: 27 },
      },

      // 17. Sarbet Tomoca Cafe Flat (38,000 ETB)
      {
        owner: landlord._id,
        title: "Cozy 2-Bedroom near Sarbet Tomoca Cafe",
        description: "Charming apartment on a quiet street surrounded by popular cafes and restaurants. Walking distance to international schools and diplomatic quarters.",
        propertyType: "Apartment",
        price: 38000,
        deposit: 38000,
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        location: {
          city: "Addis Ababa",
          subCity: "Nifas Silk-Lafto",
          neighborhood: "Sarbet",
          landmark: "Near Tomoca Coffee Sarbet",
          coordinates: { lat: 9.0035, lng: 38.7585 },
        },
        amenities: ["Water", "Electricity", "Internet", "Balcony", "24/7 security", "Parking"],
        media: toMedia(photos.sarbetTomocaFlat),
        rentalTerms: { minContractMonths: 6, furnishing: "Partially furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 104, inquiries: 6, saves: 18 },
      },

      // 18. Bisrate Gabriel Condo (32,000 ETB)
      {
        owner: landlord._id,
        title: "Modern 3-Bed Condominium in Bisrate Gabriel",
        description: "Spacious condominium near Bisrate Gabriel Church. Easy access to International Community School (ICS) and Ring Road. Very secure and well-maintained.",
        propertyType: "Condominium",
        price: 32000,
        deposit: 32000,
        bedrooms: 3,
        bathrooms: 2,
        area: 105,
        location: {
          city: "Addis Ababa",
          subCity: "Nifas Silk-Lafto",
          neighborhood: "Bisrate Gabriel",
          landmark: "Near Bisrate Gabriel Church & Laphto Mall",
          coordinates: { lat: 8.9950, lng: 38.7450 },
        },
        amenities: ["Parking", "Water", "Electricity", "24/7 security", "Balcony"],
        media: toMedia(photos.bisrateGabrielCondo),
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 89, inquiries: 5, saves: 13 },
      },

      // 19. Jommo 1 Budget Studio (11,000 ETB)
      {
        owner: landlord._id,
        title: "Budget-Friendly Studio in Jommo 1",
        description: "Affordable studio apartment inside Jommo 1 site. Close to public transportation, shops, and local market. Clean and ready to move in.",
        propertyType: "Studio",
        price: 11000,
        deposit: 11000,
        bedrooms: 1,
        bathrooms: 1,
        area: 38,
        location: {
          city: "Addis Ababa",
          subCity: "Nifas Silk-Lafto",
          neighborhood: "Jommo",
          landmark: "Near Jommo 1 Square",
          coordinates: { lat: 8.9600, lng: 38.7250 },
        },
        amenities: ["Water", "Electricity"],
        media: toMedia(photos.jommoStudio),
        rentalTerms: { minContractMonths: 3, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 160, inquiries: 12, saves: 22 },
      },

      // 20. Piassa Corridor 2-Bed (26,000 ETB)
      {
        owner: landlord._id,
        title: "Renovated 2-Bedroom in Historic Piassa Corridor",
        description: "Beautifully updated apartment on new Piassa corridor. High ceilings, wooden floors, and easy walking distance to National Theatre and Addis Mercato.",
        propertyType: "Apartment",
        price: 26000,
        deposit: 26000,
        bedrooms: 2,
        bathrooms: 1,
        area: 72,
        location: {
          city: "Addis Ababa",
          subCity: "Arada",
          neighborhood: "Piassa",
          landmark: "Near National Theatre & Churchill Road",
          coordinates: { lat: 9.0300, lng: 38.7468 },
        },
        amenities: ["Water", "Electricity", "Internet", "24/7 security"],
        media: toMedia(photos.piassaCorridor),
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 110, inquiries: 7, saves: 16 },
      },

      // 21. Piassa 4 Kilo Student Studio (13,000 ETB)
      {
        owner: landlord._id,
        title: "Budget Student Flat near 4 Kilo University",
        description: "Compact 1-bedroom flat near Addis Ababa University 4 Kilo campus. Great for students, lecturers, or researchers wanting central city life.",
        propertyType: "Studio",
        price: 13000,
        deposit: 13000,
        bedrooms: 1,
        bathrooms: 1,
        area: 36,
        location: {
          city: "Addis Ababa",
          subCity: "Arada",
          neighborhood: "Piassa",
          landmark: "Near AAU 4 Kilo Science Campus",
          coordinates: { lat: 9.0380, lng: 38.7620 },
        },
        amenities: ["Water", "Electricity"],
        media: toMedia(photos.piassa4KiloStudio),
        rentalTerms: { minContractMonths: 3, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 175, inquiries: 15, saves: 29 },
      },

      // 22. Arat Kilo Classic Residence (35,000 ETB)
      {
        owner: landlord._id,
        title: "Classic 3-Bedroom Residence in Arat Kilo",
        description: "Spacious classic apartment in quiet Arat Kilo backstreet. Proximity to ministries, embassies, and cultural landmarks.",
        propertyType: "Apartment",
        price: 35000,
        deposit: 35000,
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        location: {
          city: "Addis Ababa",
          subCity: "Arada",
          neighborhood: "Piassa",
          landmark: "Near Trinity Cathedral & Parliament",
          coordinates: { lat: 9.0350, lng: 38.7660 },
        },
        amenities: ["Water", "Water tank", "Electricity", "Parking", "24/7 security"],
        media: toMedia(photos.aratKiloApartment),
        rentalTerms: { minContractMonths: 12, furnishing: "Partially furnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 80, inquiries: 4, saves: 11 },
      },

      // 23. Lideta Condominium (25,000 ETB)
      {
        owner: landlord._id,
        title: "Modern 2-Bed Condominium in Lideta",
        description: "Central condominium unit in Lideta with clean compound and security. Near Mexico Square, commercial offices, and light rail station.",
        propertyType: "Condominium",
        price: 25000,
        deposit: 25000,
        bedrooms: 2,
        bathrooms: 1,
        area: 72,
        location: {
          city: "Addis Ababa",
          subCity: "Lideta",
          neighborhood: "Mexico",
          landmark: "Near Mexico Square & Federal Police HQ",
          coordinates: { lat: 9.0120, lng: 38.7480 },
        },
        amenities: ["Water", "Electricity", "Parking", "24/7 security"],
        media: toMedia(photos.lidetaCondo),
        rentalTerms: { minContractMonths: 6, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 94, inquiries: 6, saves: 15 },
      },

      // 24. Mexico Square Flat (30,000 ETB)
      {
        owner: landlord._id,
        title: "Commercial & Residential Flat in Mexico Square",
        description: "Prime high-floor flat right at Mexico Square. Ideal for professionals wanting instant access to central business and transport hub.",
        propertyType: "Apartment",
        price: 30000,
        deposit: 30000,
        bedrooms: 2,
        bathrooms: 1,
        area: 82,
        location: {
          city: "Addis Ababa",
          subCity: "Lideta",
          neighborhood: "Mexico",
          landmark: "Near Genete Hotel & Kera Road",
          coordinates: { lat: 9.0100, lng: 38.7500 },
        },
        amenities: ["Water", "Electricity", "Elevator", "24/7 security", "Internet"],
        media: toMedia(photos.mexicoSquareFlat),
        rentalTerms: { minContractMonths: 6, furnishing: "Partially furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 118, inquiries: 8, saves: 21 },
      },

      // 25. Shiro Meda Green Villa (40,000 ETB)
      {
        owner: landlord._id,
        title: "Serene Green Villa in Shiro Meda / Gullele",
        description: "Charming traditional villa located in the cool, eucalyptus-covered hills of Gullele. Features fresh mountain air, private walled compound, and fireplace.",
        propertyType: "House",
        price: 40000,
        deposit: 80000,
        bedrooms: 3,
        bathrooms: 2,
        area: 160,
        location: {
          city: "Addis Ababa",
          subCity: "Gullele",
          neighborhood: "Shiro Meda",
          landmark: "Near American Embassy & Shiro Meda Market",
          coordinates: { lat: 9.0550, lng: 38.7650 },
        },
        amenities: ["Parking", "Water", "Water tank", "Electricity", "Garden", "Compound", "24/7 security"],
        media: toMedia(photos.shiroMedaVilla),
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 76, inquiries: 4, saves: 12 },
      },

      // 26. Addisu Gebeya Flat (23,000 ETB)
      {
        owner: landlord._id,
        title: "2-Bedroom Apartment in Addisu Gebeya",
        description: "Clean apartment in Addisu Gebeya with panoramic balcony overlooking Semien mountains. Near public transport and market.",
        propertyType: "Apartment",
        price: 23000,
        deposit: 23000,
        bedrooms: 2,
        bathrooms: 1,
        area: 68,
        location: {
          city: "Addis Ababa",
          subCity: "Gullele",
          neighborhood: "Addisu Gebeya",
          landmark: "Near Addisu Gebeya Commercial Center",
          coordinates: { lat: 9.0600, lng: 38.7450 },
        },
        amenities: ["Water", "Electricity", "Balcony", "24/7 security"],
        media: toMedia(photos.addisuGebeyaFlat),
        rentalTerms: { minContractMonths: 6, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 68, inquiries: 3, saves: 8 },
      },
    ]);

    // Initial Inquiry & Message
    const inquiry = await Inquiry.create({
      participants: [tenant._id, landlord._id],
      property: properties[0]._id,
      lastMessage: "Hi Kalkidan, is the Bole Medhanealem apartment available for viewing this Saturday?",
      lastMessageAt: new Date(),
    });

    await Message.create([
      {
        inquiry: inquiry._id,
        sender: tenant._id,
        text: "Hi Kalkidan, is the Bole Medhanealem apartment available for viewing this Saturday?",
      },
      {
        inquiry: inquiry._id,
        sender: landlord._id,
        text: "Hello Alem! Yes, Saturday morning at 10:00 AM works well. Please submit a viewing request through the platform.",
      },
    ]);

    await Viewing.create({
      tenant: tenant._id,
      landlord: landlord._id,
      property: properties[0]._id,
      appointmentDate: new Date(Date.now() + 86400000 * 2),
      appointmentTime: "10:00 AM",
      notes: "Looking to inspect backup water reservoir and parking spot.",
      status: "confirmed",
    });

    console.log("\n==========================================");
    console.log("Addis Kiray Database Seeded Successfully!");
    console.log("==========================================");
    console.log(`Total Properties Seeded: ${properties.length} listings.`);
    console.log("Each property has a UNIQUE 3-photo gallery & distinct architecture!");
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("[Seeder] Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
