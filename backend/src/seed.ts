import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import { User } from "./models/User.js";
import { Property } from "./models/Property.js";
import { Inquiry } from "./models/Inquiry.js";
import { Message } from "./models/Message.js";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {}

dotenv.config();

const pics = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80",
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
        mustHaveAmenities: ["Water tank", "Generator", "Parking", "Security"],
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

    console.log("[Seeder] Creating realistic Addis Ababa properties...");
    // Create Properties
    const properties = await Property.create([
      {
        owner: landlord._id,
        title: "Sunlit Two-Bedroom Apartment",
        description:
          "Set on a quiet street in Bole, this bright two-bedroom apartment offers a generous living space, practical kitchen, and a balcony that catches the afternoon light. Features dedicated parking and 3,000L backup water reservoir.",
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
          coordinates: { lat: 8.9954, lng: 38.7889 },
        },
        amenities: [
          "Parking",
          "Water",
          "Electricity",
          "Internet",
          "24/7 security",
          "Elevator",
          "Balcony",
          "Furnished kitchen",
          "Generator",
          "CCTV",
          "Compound",
        ],
        media: [
          { url: pics[0], isCover: true, type: "image" },
          { url: pics[1], isCover: false, type: "image" },
          { url: pics[2], isCover: false, type: "image" },
        ],
        rentalTerms: {
          minContractMonths: 12,
          furnishing: "Partially furnished",
          paymentFrequency: "Quarterly / Monthly",
        },
        availability: {
          status: "Available",
          availableFrom: new Date(),
          lastConfirmedAt: new Date(),
        },
        verification: {
          status: "Approved",
          verifiedAt: new Date(),
          verifiedBy: admin._id,
        },
        statistics: { views: 142, inquiries: 8, saves: 23 },
      },
      {
        owner: landlord._id,
        title: "Modern Apartment Near Atlas",
        description:
          "Modern high-floor 2-bedroom unit with open kitchen and city views. Located walking distance to supermarkets, restaurants, and public minibus lines around Atlas Hotel.",
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
          landmark: "Near Atlas Hotel",
          coordinates: { lat: 9.0067, lng: 38.7758 },
        },
        amenities: [
          "Parking",
          "Water",
          "Electricity",
          "24/7 security",
          "Balcony",
          "Elevator",
          "Generator",
        ],
        media: [
          { url: pics[1], isCover: true, type: "image" },
          { url: pics[2], isCover: false, type: "image" },
        ],
        rentalTerms: {
          minContractMonths: 6,
          furnishing: "Unfurnished",
          paymentFrequency: "Monthly",
        },
        availability: {
          status: "Available",
          availableFrom: new Date(),
          lastConfirmedAt: new Date(),
        },
        verification: {
          status: "Approved",
          verifiedAt: new Date(),
          verifiedBy: admin._id,
        },
        statistics: { views: 98, inquiries: 5, saves: 14 },
      },
      {
        owner: landlord._id,
        title: "Quiet Home in a Secure Compound",
        description:
          "Spacious 3-bedroom compound residence ideal for families or expatriates. Features a private green garden, guard house, and separate maid room.",
        propertyType: "House",
        price: 39500,
        deposit: 79000,
        bedrooms: 3,
        bathrooms: 2,
        area: 115,
        location: {
          city: "Addis Ababa",
          subCity: "Yeka",
          neighborhood: "Yeka Abado / Megenagna",
          landmark: "Near British Embassy area",
          coordinates: { lat: 9.0289, lng: 38.8021 },
        },
        amenities: [
          "Parking",
          "Water",
          "Electricity",
          "Compound",
          "Garden",
          "24/7 security",
          "Generator",
        ],
        media: [
          { url: pics[2], isCover: true, type: "image" },
          { url: pics[3], isCover: false, type: "image" },
        ],
        rentalTerms: {
          minContractMonths: 12,
          furnishing: "Unfurnished",
          paymentFrequency: "Quarterly",
        },
        availability: {
          status: "Available",
          availableFrom: new Date(),
          lastConfirmedAt: new Date(),
        },
        verification: {
          status: "Approved",
          verifiedAt: new Date(),
          verifiedBy: admin._id,
        },
        statistics: { views: 65, inquiries: 3, saves: 9 },
      },
      {
        owner: landlord._id,
        title: "Bright Two-Bedroom with Balcony in Kazanchis",
        description:
          "Conveniently situated in Kazanchis near UNECA, Radisson Blu, and government offices. Quick commute to Piassa and Bole.",
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
          landmark: "Near UNECA & Inter Luxury Hotel",
          coordinates: { lat: 9.0156, lng: 38.7678 },
        },
        amenities: [
          "Water",
          "Electricity",
          "Internet",
          "Elevator",
          "Balcony",
          "24/7 security",
        ],
        media: [
          { url: pics[3], isCover: true, type: "image" },
          { url: pics[0], isCover: false, type: "image" },
        ],
        rentalTerms: {
          minContractMonths: 12,
          furnishing: "Partially furnished",
          paymentFrequency: "Monthly",
        },
        availability: {
          status: "Available",
          availableFrom: new Date(),
          lastConfirmedAt: new Date(),
        },
        verification: {
          status: "Approved",
          verifiedAt: new Date(),
          verifiedBy: admin._id,
        },
        statistics: { views: 110, inquiries: 7, saves: 19 },
      },
// --- CMC Properties ---
{
  owner: landlord._id,
  title: "Spacious Condominium Unit in CMC",
  description: "Well-maintained 3-bedroom condominium in the growing CMC area. Clean compound with children's playground, 24-hour guard, and reliable water supply. Perfect for young families.",
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
  statistics: { views: 72, inquiries: 4, saves: 11 },
},
{
  owner: landlord._id,
  title: "Affordable Studio near CMC Bus Terminal",
  description: "Compact but well-designed studio apartment ideal for students or single professionals. Close to main bus routes for easy commute to city center.",
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
    landmark: "Near CMC Roundabout",
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
  statistics: { views: 55, inquiries: 3, saves: 7 },
},
// --- Sarbet Properties ---
{
  owner: landlord._id,
  title: "Elegant Villa in Sarbet with Garden",
  description: "Beautiful 4-bedroom villa in the quiet Sarbet neighborhood favored by diplomats and expats. Features a large garden, covered parking for 2 cars, and modern kitchen.",
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
    landmark: "Near Lycée Guebre Mariam",
    coordinates: { lat: 9.0022, lng: 38.7561 },
  },
  amenities: ["Parking", "Water", "Water tank", "Electricity", "Generator", "Garden", "Compound", "Internet", "24/7 security", "CCTV"],
  media: [
    { url: pics[3], isCover: true, type: "image" },
    { url: pics[0], isCover: false, type: "image" },
  ],
  rentalTerms: { minContractMonths: 12, furnishing: "Fully furnished", paymentFrequency: "Quarterly" },
  availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
  verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
  statistics: { views: 130, inquiries: 6, saves: 22 },
},
{
  owner: landlord._id,
  title: "Cozy Two-Bedroom near Sarbet Cafes",
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
  statistics: { views: 88, inquiries: 5, saves: 15 },
},
// --- Piassa Properties ---
{
  owner: landlord._id,
  title: "Renovated Apartment in Historic Piassa",
  description: "Beautifully renovated 2-bedroom apartment in the heart of Piassa. Walking distance to Addis Mercato, St. George Cathedral, and National Theatre.",
  propertyType: "Apartment",
  price: 25000,
  deposit: 25000,
  bedrooms: 2,
  bathrooms: 1,
  area: 72,
  location: {
    city: "Addis Ababa",
    subCity: "Arada",
    neighborhood: "Piassa",
    landmark: "Near National Theatre",
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
  statistics: { views: 93, inquiries: 5, saves: 12 },
},
{
  owner: landlord._id,
  title: "Budget Studio near Addis Mercato",
  description: "Affordable studio in Piassa close to Addis Mercato market. Great for small traders, students, or anyone wanting to live in the bustling city center.",
  propertyType: "Studio",
  price: 12000,
  deposit: 12000,
  bedrooms: 1,
  bathrooms: 1,
  area: 35,
  location: {
    city: "Addis Ababa",
    subCity: "Arada",
    neighborhood: "Piassa",
    landmark: "Near Addis Mercato entrance",
    coordinates: { lat: 9.0340, lng: 38.7410 },
  },
  amenities: ["Water", "Electricity"],
  media: [
    { url: pics[2], isCover: true, type: "image" },
    { url: pics[1], isCover: false, type: "image" },
  ],
  rentalTerms: { minContractMonths: 3, furnishing: "Unfurnished", paymentFrequency: "Monthly" },
  availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
  verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
  statistics: { views: 140, inquiries: 9, saves: 18 },
},
// --- Additional Yeka Property ---
{
  owner: landlord._id,
  title: "Modern Apartment with Panoramic Views in Yeka",
  description: "High-floor apartment in Yeka Hills offering stunning views of the city. Recently renovated with modern finishes, large windows, and an open balcony. Near embassies and green parks.",
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
    landmark: "Near French Embassy area",
    coordinates: { lat: 9.0312, lng: 38.8100 },
  },
  amenities: ["Parking", "Water", "Water tank", "Electricity", "Generator", "Internet", "Balcony", "Elevator", "24/7 security", "CCTV"],
  media: [
    { url: pics[3], isCover: true, type: "image" },
    { url: pics[0], isCover: false, type: "image" },
  ],
  rentalTerms: { minContractMonths: 12, furnishing: "Partially furnished", paymentFrequency: "Quarterly" },
  availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
  verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
  statistics: { views: 78, inquiries: 4, saves: 13 },
},
// --- Additional Bole Property ---
{
  owner: landlord._id,
  title: "Luxury Penthouse Suite in Bole",
  description: "Premium penthouse apartment on the top floor of a new building in Bole. Features rooftop terrace, panoramic city views, smart home technology, and dedicated elevator access.",
  propertyType: "Apartment",
  price: 95000,
  deposit: 190000,
  bedrooms: 4,
  bathrooms: 3,
  area: 200,
  location: {
    city: "Addis Ababa",
    subCity: "Bole",
    neighborhood: "Bole Rwanda Embassy",
    landmark: "Near Bole International Airport",
    coordinates: { lat: 8.9900, lng: 38.7990 },
  },
  amenities: ["Parking", "Water", "Water tank", "Electricity", "Generator", "Internet", "Elevator", "Balcony", "24/7 security", "CCTV", "Gym", "Rooftop terrace"],
  media: [
    { url: pics[1], isCover: true, type: "image" },
    { url: pics[0], isCover: false, type: "image" },
    { url: pics[3], isCover: false, type: "image" },
  ],
  rentalTerms: { minContractMonths: 12, furnishing: "Fully furnished", paymentFrequency: "Quarterly / Monthly" },
  availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
  verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
  statistics: { views: 210, inquiries: 12, saves: 35 },
},
// --- Additional Kazanchis Property ---
{
  owner: landlord._id,
  title: "Furnished Studio near Kazanchis Business District",
  description: "Fully furnished studio apartment perfect for business professionals. Located in the heart of Kazanchis with easy access to banks, government offices, and UNECA.",
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
    landmark: "Near Commercial Bank of Ethiopia HQ",
    coordinates: { lat: 9.0170, lng: 38.7700 },
  },
  amenities: ["Water", "Electricity", "Internet", "Elevator", "24/7 security", "Furnished kitchen"],
  media: [
    { url: pics[0], isCover: true, type: "image" },
    { url: pics[2], isCover: false, type: "image" },
  ],
  rentalTerms: { minContractMonths: 3, furnishing: "Fully furnished", paymentFrequency: "Monthly" },
  availability: { status: "Available", availableFrom: new Date(), lastConfirmedAt: new Date() },
  verification: { status: "Approved", verifiedAt: new Date(), verifiedBy: admin._id },
  statistics: { views: 120, inquiries: 8, saves: 20 },
},
    ]);

    // Link one saved property to tenant
    tenant.savedProperties.push(properties[0]._id as any);
    tenant.savedProperties.push(properties[1]._id as any);
    await tenant.save();

    console.log("[Seeder] Creating initial inquiry and message thread...");
    const inquiry = await Inquiry.create({
      participants: [tenant._id, landlord._id],
      property: properties[0]._id,
      lastMessage: "Yes, Saturday works for me. I can show you the apartment at 10:00 AM.",
      lastMessageAt: new Date(),
    });

    await Message.create([
      {
        inquiry: inquiry._id,
        sender: tenant._id,
        text: "Hello! I’m interested in the Sunlit Two-Bedroom Apartment. Is it still available?",
        isRead: true,
      },
      {
        inquiry: inquiry._id,
        sender: landlord._id,
        text: "Yes, it is still available. Would you like to schedule a viewing?",
        isRead: true,
      },
      {
        inquiry: inquiry._id,
        sender: tenant._id,
        text: "Yes please. Is Saturday morning possible?",
        isRead: true,
      },
      {
        inquiry: inquiry._id,
        sender: landlord._id,
        text: "Yes, Saturday works for me. I can show you the apartment at 10:00 AM.",
        isRead: true,
        viewingRequest: {
          date: new Date(),
          time: "10:00 AM",
          status: "confirmed",
        },
      },
    ]);

    console.log("\n==========================================");
    console.log("✅ Addis Kiray Database Seeded Successfully!");
    console.log("==========================================");
    console.log("Demo Accounts:");
    console.log("  Tenant:   alem@example.com / password123");
    console.log("  Landlord: kalkidan@example.com / password123");
    console.log("  Admin:    admin@addiskiray.com / adminpassword123");
    console.log(`Seeded Properties: ${properties.length} listings across Bole, Yeka, Kazanchis, CMC, Sarbet, and Piassa.`);
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("[Seeder] Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
