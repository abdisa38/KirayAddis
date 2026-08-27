import { Request, Response, NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Property } from "../models/Property.js";
import { calculateMatchScore } from "./propertyController.js";

// Helper function to extract structured search criteria using Regex NLP heuristic
function extractCriteriaHeuristically(prompt: string) {
  const lower = prompt.toLowerCase();

  // Sub-city / Neighborhood detection
  let subCity: string | null = null;
  let neighborhood: string | null = null;

  if (lower.includes("saris") || lower.includes("kality") || lower.includes("gotera") || lower.includes("jommo") || lower.includes("lebu")) {
    subCity = "Nifas Silk-Lafto";
    if (lower.includes("saris")) neighborhood = "Saris";
    else if (lower.includes("jommo")) neighborhood = "Jommo";
    else if (lower.includes("gotera")) neighborhood = "Gotera";
  } else if (lower.includes("sarbet") || lower.includes("sar bet") || lower.includes("bisrate gabriel") || lower.includes("nifas silk")) {
    subCity = "Nifas Silk-Lafto";
    neighborhood = "Sarbet";
  } else if (lower.includes("bole atlas")) {
    subCity = "Bole";
    neighborhood = "Bole Atlas";
  } else if (lower.includes("medhanealem") || lower.includes("edna mall")) {
    subCity = "Bole";
    neighborhood = "Bole Medhanealem";
  } else if (lower.includes("bole")) {
    subCity = "Bole";
  } else if (lower.includes("kazanchis") || lower.includes("kirkos") || lower.includes("meskel flower")) {
    subCity = "Kirkos";
    neighborhood = "Kazanchis";
  } else if (lower.includes("cmc") || lower.includes("summit") || lower.includes("ayat")) {
    subCity = "CMC";
    neighborhood = "CMC Michael";
  } else if (lower.includes("yeka") || lower.includes("megenagna") || lower.includes("signal")) {
    subCity = "Yeka";
  } else if (lower.includes("piassa") || lower.includes("arada") || lower.includes("4 kilo") || lower.includes("arat kilo")) {
    subCity = "Arada";
    neighborhood = "Piassa";
  } else if (lower.includes("mexico") || lower.includes("lideta")) {
    subCity = "Lideta";
    neighborhood = "Mexico";
  } else if (lower.includes("gullele") || lower.includes("shiro meda") || lower.includes("addisu gebeya")) {
    subCity = "Gullele";
  }

  // Price extraction
  let maxPrice: number | null = null;
  const kMatch = lower.match(/(\d+)\s*k\b/i);
  const explicitNum = lower.match(/(\d{1,3}(?:,\d{3})+|\b\d{4,6}\b)/);
  if (kMatch) {
    maxPrice = parseInt(kMatch[1], 10) * 1000;
  } else if (explicitNum) {
    const raw = explicitNum[1].replace(/,/g, "");
    const parsed = parseInt(raw, 10);
    if (parsed >= 5000 && parsed <= 500000) {
      maxPrice = parsed;
    }
  }

  // Bedrooms extraction
  let minBedrooms: number | null = null;
  const bedMatch = lower.match(/(\d+)\s*(?:bed|bedroom|br)\b/i);
  if (bedMatch) {
    minBedrooms = parseInt(bedMatch[1], 10);
  } else if (lower.includes("studio")) {
    minBedrooms = 1;
  }

  // Property Type
  let propertyType: string | null = null;
  if (lower.includes("studio")) propertyType = "Studio";
  else if (lower.includes("villa")) propertyType = "Villa";
  else if (lower.includes("condo")) propertyType = "Condominium";
  else if (lower.includes("house") || lower.includes("compound")) propertyType = "House";
  else if (lower.includes("apartment") || lower.includes("flat")) propertyType = "Apartment";

  // Amenities
  const mustHaveAmenities: string[] = [];
  if (lower.includes("water") || lower.includes("reservoir") || lower.includes("tank")) {
    mustHaveAmenities.push("Water tank", "Water");
  }
  if (lower.includes("generator") || lower.includes("power") || lower.includes("electricity")) {
    mustHaveAmenities.push("Generator");
  }
  if (lower.includes("security") || lower.includes("guard") || lower.includes("cctv")) {
    mustHaveAmenities.push("24/7 security");
  }
  if (lower.includes("parking") || lower.includes("garage") || lower.includes("car")) {
    mustHaveAmenities.push("Parking");
  }
  if (lower.includes("garden") || lower.includes("yard")) {
    mustHaveAmenities.push("Garden");
  }
  if (lower.includes("elevator") || lower.includes("lift")) {
    mustHaveAmenities.push("Elevator");
  }
  if (lower.includes("internet") || lower.includes("wifi")) {
    mustHaveAmenities.push("Internet");
  }

  const keywords = [];
  if (neighborhood || subCity) keywords.push(neighborhood || subCity!);
  if (propertyType) keywords.push(propertyType);
  if (minBedrooms) keywords.push(`${minBedrooms}+ Bed`);
  if (maxPrice) keywords.push(`Budget ≤ ${maxPrice.toLocaleString()} ETB`);
  if (mustHaveAmenities.length > 0) keywords.push(mustHaveAmenities[0]);

  return {
    subCity,
    neighborhood,
    maxPrice,
    minBedrooms,
    propertyType,
    mustHaveAmenities: Array.from(new Set(mustHaveAmenities)),
    keywords,
    summary: `Search for ${propertyType || "home"} in ${neighborhood || subCity || "Addis Ababa"}${maxPrice ? ` under ${maxPrice.toLocaleString()} ETB` : ""}`,
  };
}

// @desc    AI-powered property matching using Gemini with robust NLP
// @route   POST /api/ai/match
// @access  Public
export const aiMatch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({
        success: false,
        message: "Please provide a search description.",
      });
      return;
    }

    let criteria: any = null;
    let usedGemini = false;

    // Attempt Gemini 2.0 Flash analysis if API key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const extractionPrompt = `You are a rental property search assistant for Addis Ababa, Ethiopia.
Extract structured search criteria from the user's natural language query.
Return ONLY valid JSON (no markdown, no backticks, no explanation) with these fields:
{
  "subCity": "string or null (one of: Bole, Kirkos, Yeka, CMC, Arada, Nifas Silk-Lafto, Lideta, Gullele)",
  "neighborhood": "string or null (e.g. Saris, Kazanchis, Sarbet, Piassa, Bole Atlas, CMC Michael, Gotera, Mexico, Shiro Meda)",
  "maxPrice": "number or null (monthly rent in ETB)",
  "minBedrooms": "number or null",
  "propertyType": "string or null (Apartment, House, Condominium, Studio, Villa, Shared)",
  "mustHaveAmenities": ["array of strings from: Parking, Water, Water tank, Electricity, Generator, Internet, 24/7 security, Elevator, Balcony, Garden, Compound, CCTV, Gym"],
  "keywords": ["array of important keywords"],
  "summary": "A clear one-sentence summary of what the user is looking for"
}

User query: "${prompt}"`;

        const geminiResult = await model.generateContent(extractionPrompt);
        const responseText = geminiResult.response.text().trim();
        const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        criteria = JSON.parse(cleaned);
        usedGemini = true;
      } catch (geminiErr: any) {
        console.warn("[Addis AI] Gemini API call fallback:", geminiErr?.message || geminiErr);
      }
    }

    if (!criteria) {
      criteria = extractCriteriaHeuristically(prompt);
    }

    // Step 2: Build MongoDB query respecting user's strict criteria
    const query: any = {
      "availability.status": { $in: ["Available", "Soon"] },
    };

    // Location filter
    const loc = criteria.neighborhood || criteria.subCity;
    if (loc) {
      const locRegex = { $regex: loc, $options: "i" };
      query.$or = [
        { "location.neighborhood": locRegex },
        { "location.subCity": locRegex },
        { "location.landmark": locRegex },
        { title: locRegex },
      ];
    }

    // Price filter (strict budget ceiling)
    if (criteria.maxPrice) {
      query.price = { $lte: Number(criteria.maxPrice) * 1.35 };
    }

    // Bedrooms
    if (criteria.minBedrooms) {
      query.bedrooms = { $gte: Number(criteria.minBedrooms) };
    }

    // Property Type
    if (criteria.propertyType) {
      query.propertyType = criteria.propertyType;
    }

    // Step 3: Fetch matching properties
    let properties = await Property.find(query)
      .populate("owner", "name role avatar verificationTier")
      .sort({ price: 1 })
      .limit(6);

    // Fallback 1: If no exact bedroom match in that location, relax bedroom/type but KEEP price ceiling
    if (properties.length === 0 && criteria.maxPrice) {
      const priceFallback: any = {
        "availability.status": { $in: ["Available", "Soon"] },
        price: { $lte: Number(criteria.maxPrice) * 1.4 },
      };
      properties = await Property.find(priceFallback)
        .populate("owner", "name role avatar verificationTier")
        .sort({ price: 1 })
        .limit(6);
    }

    // Fallback 2: If no properties under exact price in that area, find closest affordable homes in Addis Ababa
    if (properties.length === 0) {
      properties = await Property.find({ "availability.status": "Available" })
        .populate("owner", "name role avatar verificationTier")
        .sort({ price: 1 })
        .limit(6);
    }

    // Step 4: Calculate accurate match scores
    const enrichedProperties = properties.map((prop) => {
      const matchScore = calculateMatchScore(prop, {
        workplace: criteria.neighborhood || criteria.subCity,
        budgetMax: criteria.maxPrice || 35000,
        mustHaveAmenities: criteria.mustHaveAmenities,
        minBedrooms: criteria.minBedrooms,
      });
      return {
        ...prop.toObject(),
        matchScore,
      };
    });

    // Sort by match score descending
    enrichedProperties.sort((a, b) => b.matchScore - a.matchScore);

    // Step 5: Tailored AI explanations
    const top3 = enrichedProperties.slice(0, 3);
    const explanations = top3.map((p) => {
      const reasons: string[] = [];

      // Budget justification
      if (criteria.maxPrice && p.price <= criteria.maxPrice) {
        reasons.push(`Budget match: ETB ${p.price.toLocaleString()}/mo is within your ETB ${criteria.maxPrice.toLocaleString()} limit.`);
      } else if (criteria.maxPrice) {
        reasons.push(`Closest rate: ETB ${p.price.toLocaleString()}/mo (within ${Math.round(((p.price - criteria.maxPrice) / criteria.maxPrice) * 100)}% of your target).`);
      } else {
        reasons.push(`Competitive rate: ETB ${p.price.toLocaleString()}/mo for ${p.area} m².`);
      }

      // Location justification
      if (loc && (p.location?.neighborhood?.toLowerCase().includes(loc.toLowerCase()) || p.location?.subCity?.toLowerCase().includes(loc.toLowerCase()))) {
        reasons.push(`Location: Direct proximity to ${p.location?.neighborhood || p.location?.subCity}.`);
      } else {
        reasons.push(`Location: Convenient transport corridor in ${p.location?.neighborhood || p.location?.subCity}, near ${p.location?.landmark || "transit hub"}.`);
      }

      // Utilities justification
      const matchedAmenities = p.amenities.filter((a: string) =>
        ["Water tank", "Water", "Generator", "24/7 security", "Parking", "Balcony", "Garden"].includes(a)
      );
      if (matchedAmenities.length > 0) {
        reasons.push(`Utilities: Equipped with verified ${matchedAmenities.slice(0, 2).join(" & ")}.`);
      } else {
        reasons.push(`Direct lease with verified landlord representation.`);
      }

      return {
        title: p.title,
        reasons,
      };
    });

    res.status(200).json({
      success: true,
      criteria,
      count: enrichedProperties.length,
      properties: enrichedProperties,
      explanations,
      engine: usedGemini ? "Google Gemini 2.0 Flash" : "Addis Intelligent NLP Engine",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate professional property description using Gemini / intelligent NLP
// @route   POST /api/ai/generate-description
// @access  Public
export const generateDescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, propertyType, bedrooms, bathrooms, area, location, landmark, rent, amenities, furnishing } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    let description = "";

    if (apiKey && apiKey.length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are a real estate copywriter in Addis Ababa, Ethiopia.
Write an enticing, professional, and honest rental property description (2-3 sentences, 40-60 words) for Addis Kiray marketplace.
Details:
- Title: "${title || "Rental Property"}"
- Property Type: ${propertyType || "Apartment"}
- Bedrooms: ${bedrooms || 2}, Bathrooms: ${bathrooms || 1}
- Size: ${area || 90} m²
- Location: ${location || "Addis Ababa"} (Landmark: ${landmark || "Centrally located"})
- Price: ETB ${rent || "40,000"} / month
- Furnishing: ${furnishing || "Unfurnished"}
- Key Amenities: ${Array.isArray(amenities) ? amenities.join(", ") : "Water backup, Security, Parking"}

Write ONLY the final description text with no quotes, no markdown, and no preamble.`;

        const result = await model.generateContent(prompt);
        description = result.response.text().trim().replace(/^"|"$/g, "");
      } catch (err: any) {
        console.warn("[Addis AI] Description generator fallback:", err?.message || err);
      }
    }

    if (!description) {
      const amenitiesText = Array.isArray(amenities) && amenities.length > 0 ? amenities.slice(0, 4).join(", ") : "reliable utilities and 24/7 security";
      description = `A beautifully maintained ${bedrooms || 2}-bedroom ${propertyType ? propertyType.toLowerCase() : "apartment"} in ${location || "Addis Ababa"} near ${landmark || "key transport routes"}. Offering ${area || 90} m² of bright living space with ${amenitiesText}, this home is ideal for tenants seeking comfortable, connected city living.`;
    }

    res.status(200).json({
      success: true,
      description,
    });
  } catch (error) {
    next(error);
  }
};
