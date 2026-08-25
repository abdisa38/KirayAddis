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

const pics = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
];

const seedData = async () => {
  try {
    const connUri = process.env.MONGO_URI;
    if (!connUri) {
      throw new Error("MONGO_URI not configured in .env");
    }

    console.log("[Seeder] Connecting to MongoDB Atlas...");
    await mongoose.connect(connUri);
    console.log("[Seeder] Connected successfully!");

    // Clear existing data
    console.log("[Seeder] Clearing old collections...");
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Inquiry.deleteMany({}),
      Message.deleteMany({}),
      Viewing.deleteMany({}),
      Report.deleteMany({}),
    ]);

    console.log("[Seeder] Creating demo users...");
    // 1. Create Tenant
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

    // 2. Create Landlord
    const landlord = await User.create({
      name: "Kalkidan Mengesha",
      email: "kalkidan@example.com",
      phone: "+251922334455",
      password: "password123",
      role: "landlord",
      isEmailVerified: true,
      verificationTier: "property_verified",
    });

    // 3. Create Admin
    const admin = await User.create({
      name: "Admin Kiray",
      email: "admin@addiskiray.com",
      phone: "+251933445566",
      password: "adminpassword123",
      role: "admin",
      isEmailVerified: true,
      verificationTier: "property_verified",
    });

    console.log("[Seeder] Creating rich Addis Ababa properties across all sub-cities...");
    const properties = await Property.create([
      // ==========================================
      // BOLE SUB-CITY (5 Properties)
      // ==========================================
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
        media: [
          { url: pics[0], isCover: true, type: "image" },
          { url: pics[1], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 6, furnishing: "Partially furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 184, inquiries: 9, saves: 28 },
      },
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
        media: [
          { url: pics[1], isCover: true, type: "image" },
          { url: pics[2], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 95, inquiries: 7, saves: 19 },
      },
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
        media: [
          { url: pics[4], isCover: true, type: "image" },
          { url: pics[0], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Fully furnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 245, inquiries: 14, saves: 42 },
      },
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
        media: [
          { url: pics[2], isCover: true, type: "image" },
          { url: pics[3], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 6, furnishing: "Fully furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 110, inquiries: 8, saves: 15 },
      },
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
        media: [
          { url: pics[5], isCover: true, type: "image" },
          { url: pics[6], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 88, inquiries: 5, saves: 14 },
      },

      // ==========================================
      // KIRKOS / KAZANCHIS SUB-CITY (4 Properties)
      // ==========================================
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
        media: [
          { url: pics[0], isCover: true, type: "image" },
          { url: pics[2], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 3, furnishing: "Fully furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 165, inquiries: 11, saves: 31 },
      },
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
        media: [
          { url: pics[3], isCover: true, type: "image" },
          { url: pics[1], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Partially furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 142, inquiries: 8, saves: 26 },
      },
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
        media: [
          { url: pics[1], isCover: true, type: "image" },
          { url: pics[5], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 78, inquiries: 4, saves: 16 },
      },
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
          landmark: "Near Gotera Interchange",
          coordinates: { lat: 8.9880, lng: 38.7610 },
        },
        amenities: ["Parking", "Water", "Electricity", "Elevator", "24/7 security"],
        media: [
          { url: pics[2], isCover: true, type: "image" },
          { url: pics[0], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 6, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 92, inquiries: 6, saves: 11 },
      },

      // ==========================================
      // CMC & YEKA SUB-CITIES (6 Properties)
      // ==========================================
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
        media: [
          { url: pics[2], isCover: true, type: "image" },
          { url: pics[3], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 82, inquiries: 5, saves: 14 },
      },
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
        media: [
          { url: pics[0], isCover: true, type: "image" },
          { url: pics[1], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 6, furnishing: "Fully furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 65, inquiries: 4, saves: 9 },
      },
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
        media: [
          { url: pics[6], isCover: true, type: "image" },
          { url: pics[4], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Partially furnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 115, inquiries: 6, saves: 21 },
      },
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
        media: [
          { url: pics[2], isCover: true, type: "image" },
          { url: pics[3], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 120, inquiries: 7, saves: 23 },
      },
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
        media: [
          { url: pics[3], isCover: true, type: "image" },
          { url: pics[0], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Partially furnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 98, inquiries: 5, saves: 17 },
      },
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
        media: [
          { url: pics[1], isCover: true, type: "image" },
          { url: pics[2], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 6, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 135, inquiries: 9, saves: 20 },
      },

      // ==========================================
      // NIFAS SILK-LAFTO / SARBET (4 Properties)
      // ==========================================
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
        media: [
          { url: pics[5], isCover: true, type: "image" },
          { url: pics[0], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Fully furnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 155, inquiries: 8, saves: 27 },
      },
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
        media: [
          { url: pics[1], isCover: true, type: "image" },
          { url: pics[2], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 6, furnishing: "Partially furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 104, inquiries: 6, saves: 18 },
      },
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
        media: [
          { url: pics[0], isCover: true, type: "image" },
          { url: pics[4], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 89, inquiries: 5, saves: 13 },
      },
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
        media: [
          { url: pics[2], isCover: true, type: "image" },
          { url: pics[3], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 3, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 160, inquiries: 12, saves: 22 },
      },

      // ==========================================
      // ARADA / PIASSA SUB-CITY (3 Properties)
      // ==========================================
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
        media: [
          { url: pics[0], isCover: true, type: "image" },
          { url: pics[3], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 110, inquiries: 7, saves: 16 },
      },
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
          neighborhood: "4 Kilo",
          landmark: "Near AAU 4 Kilo Science Campus",
          coordinates: { lat: 9.0380, lng: 38.7620 },
        },
        amenities: ["Water", "Electricity"],
        media: [
          { url: pics[2], isCover: true, type: "image" },
          { url: pics[1], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 3, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 175, inquiries: 15, saves: 29 },
      },
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
          neighborhood: "Arat Kilo",
          landmark: "Near Trinity Cathedral & Parliament",
          coordinates: { lat: 9.0350, lng: 38.7660 },
        },
        amenities: ["Water", "Water tank", "Electricity", "Parking", "24/7 security"],
        media: [
          { url: pics[4], isCover: true, type: "image" },
          { url: pics[1], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Partially furnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 80, inquiries: 4, saves: 11 },
      },

      // ==========================================
      // LIDETA & GULLELE SUB-CITIES (4 Properties)
      // ==========================================
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
        media: [
          { url: pics[1], isCover: true, type: "image" },
          { url: pics[2], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 6, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 94, inquiries: 6, saves: 15 },
      },
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
        media: [
          { url: pics[3], isCover: true, type: "image" },
          { url: pics[0], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 6, furnishing: "Partially furnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 118, inquiries: 8, saves: 21 },
      },
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
        media: [
          { url: pics[6], isCover: true, type: "image" },
          { url: pics[5], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 12, furnishing: "Unfurnished", paymentFrequency: "Quarterly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 76, inquiries: 4, saves: 12 },
      },
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
        media: [
          { url: pics[2], isCover: true, type: "image" },
          { url: pics[1], isCover: false, type: "image" },
        ],
        rentalTerms: { minContractMonths: 6, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
        availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
        verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
        statistics: { views: 68, inquiries: 3, saves: 8 },
      },
    ]);

    // Create Initial Inquiries and Viewings
    console.log("[Seeder] Creating sample inquiries and viewing appointments...");
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
      appointmentDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      appointmentTime: "10:00 AM",
      notes: "Looking to inspect backup water reservoir and parking spot.",
      status: "confirmed",
    });

    console.log("\n==========================================");
    console.log("Addis Kiray Database Seeded Successfully!");
    console.log("==========================================");
    console.log(`Total Properties Seeded: ${properties.length} listings across all Addis Ababa sub-cities.`);
    console.log("Sub-Cities Covered: Bole, Kazanchis/Kirkos, CMC, Yeka, Sarbet/Nifas Silk, Piassa/Arada, Mexico/Lideta, Gullele");
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("[Seeder] Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
