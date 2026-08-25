import { Request, Response, NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Property } from "../models/Property.js";
import { calculateMatchScore } from "./propertyController.js";

// Helper function to extract structured search criteria using Regex NLP heuristic
function extractCriteriaHeuristically(prompt: string) {
  const lower = prompt.toLowerCase();

  // Sub-city detection
  let subCity: string | null = null;
  let neighborhood: string | null = null;

  if (lower.includes("bole atlas")) {
    subCity = "Bole";
    neighborhood = "Bole Atlas";
  } else if (lower.includes("medhanealem") || lower.includes("edna mall")) {
    subCity = "Bole";
    neighborhood = "Bole Medhanealem";
  } else if (lower.includes("bole")) {
    subCity = "Bole";
  } else if (lower.includes("kazanchis") || lower.includes("kirkos")) {
    subCity = "Kirkos";
    neighborhood = "Kazanchis";
  } else if (lower.includes("cmc")) {
    subCity = "CMC";
  } else if (lower.includes("yeka") || lower.includes("megenagna")) {
    subCity = "Yeka";
  } else if (lower.includes("sarbet") || lower.includes("sar bet") || lower.includes("nifas silk")) {
    subCity = "Nifas Silk-Lafto";
    neighborhood = "Sarbet";
  } else if (lower.includes("piassa") || lower.includes("piassa") || lower.includes("arada")) {
    subCity = "Arada";
    neighborhood = "Piassa";
  }

  // Price extraction
  let maxPrice: number | null = null;
  const kMatch = lower.match(/(\d+)\s*k\b/i);
  const numMatch = lower.match(/(?:under|budget|below|up to|max|around|etb|birr)?\s*(\d{1,3}(?:,\d{3})+|\d{4,6})/i);
  if (kMatch) {
    maxPrice = parseInt(kMatch[1], 10) * 1000;
  } else if (numMatch) {
    const raw = numMatch[1].replace(/,/g, "");
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
    mustHaveAmenities.push("Water", "Water tank");
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
  if (subCity) keywords.push(subCity);
  if (neighborhood && neighborhood !== subCity) keywords.push(neighborhood);
  if (propertyType) keywords.push(propertyType);
  if (minBedrooms) keywords.push(`${minBedrooms}+ Bed`);
  if (maxPrice) keywords.push(`Budget ≤ ${maxPrice.toLocaleString()} ETB`);

  return {
    subCity,
    neighborhood,
    maxPrice: maxPrice || 45000,
    minBedrooms,
    propertyType,
    mustHaveAmenities: Array.from(new Set(mustHaveAmenities)),
    keywords,
    summary: `Search for ${propertyType || "home"} in ${neighborhood || subCity || "Addis Ababa"}${maxPrice ? ` under ${maxPrice.toLocaleString()} ETB` : ""}`,
  };
}

// @desc    AI-powered property matching using Gemini with robust NLP fallback
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

    // Attempt Gemini 2.0 Flash / Pro analysis if API key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const extractionPrompt = `You are a rental property search assistant for Addis Ababa, Ethiopia.
Extract structured search criteria from the user's natural language query.
Return ONLY valid JSON (no markdown, no backticks, no explanation) with these fields:
{
  "subCity": "string or null (one of: Bole, Kirkos, Yeka, CMC, Arada, Nifas Silk-Lafto)",
  "neighborhood": "string or null (e.g. Kazanchis, Sarbet, Piassa, Bole Atlas, CMC Michael)",
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
        console.warn("[Addis AI] Gemini API call skipped or errored, using intelligent NLP fallback:", geminiErr?.message || geminiErr);
      }
    }

    // If Gemini wasn't available or errored, use intelligent heuristic extraction
    if (!criteria) {
      criteria = extractCriteriaHeuristically(prompt);
    }

    // Step 2: Build MongoDB query from extracted criteria
    const query: any = {
      "availability.status": { $in: ["Available", "Soon"] },
    };

    if (criteria.subCity) {
      query["location.subCity"] = { $regex: criteria.subCity, $options: "i" };
    }
    if (criteria.neighborhood) {
      query.$or = [
        { "location.neighborhood": { $regex: criteria.neighborhood, $options: "i" } },
        { "location.subCity": { $regex: criteria.neighborhood, $options: "i" } },
      ];
    }
    if (criteria.maxPrice) {
      query.price = { $lte: Number(criteria.maxPrice) * 1.25 }; // 25% tolerance
    }
    if (criteria.minBedrooms) {
      query.bedrooms = { $gte: Number(criteria.minBedrooms) };
    }
    if (criteria.propertyType) {
      query.propertyType = criteria.propertyType;
    }
    if (criteria.mustHaveAmenities?.length) {
      query.amenities = { $in: criteria.mustHaveAmenities };
    }

    // Step 3: Fetch matching properties from MongoDB
    let properties = await Property.find(query)
      .populate("owner", "name role avatar verificationTier")
      .limit(6);

    // If no results with strict criteria, fall back to broader search
    if (properties.length === 0) {
      const fallbackQuery: any = {
        "availability.status": { $in: ["Available", "Soon"] },
      };
      if (criteria.subCity) {
        fallbackQuery["location.subCity"] = { $regex: criteria.subCity, $options: "i" };
      }
      properties = await Property.find(fallbackQuery)
        .populate("owner", "name role avatar verificationTier")
        .limit(6);
    }

    // If still 0, return top featured available properties
    if (properties.length === 0) {
      properties = await Property.find({ "availability.status": "Available" })
        .populate("owner", "name role avatar verificationTier")
        .limit(6);
    }

    // Step 4: Calculate match scores
    const enrichedProperties = properties.map((prop) => {
      const matchScore = calculateMatchScore(prop, {
        workplace: criteria.neighborhood || criteria.subCity,
        budgetMax: criteria.maxPrice || 45000,
        mustHaveAmenities: criteria.mustHaveAmenities,
      });
      return {
        ...prop.toObject(),
        matchScore,
      };
    });

    // Sort by match score descending
    enrichedProperties.sort((a, b) => b.matchScore - a.matchScore);

    // Step 5: Generate tailored explanations for top results
    let explanations: any[] = [];
    const top3 = enrichedProperties.slice(0, 3);

    if (usedGemini && apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const explanationPrompt = `You are Addis AI housing assistant.
User query: "${prompt}"

Top matching properties:
${top3.map((p, i) => `${i + 1}. "${p.title}" in ${p.location.neighborhood || p.location.subCity} - ETB ${p.price}/mo - ${p.bedrooms} beds, amenities: ${p.amenities.join(", ")}`).join("\n")}

Return ONLY valid JSON array (no markdown, no backticks):
[{"title": "...", "reasons": ["reason1", "reason2", "reason3"]}]`;

        const expResult = await model.generateContent(explanationPrompt);
        const expText = expResult.response.text().trim();
        const cleanedExp = expText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        explanations = JSON.parse(cleanedExp);
      } catch {
        // Fall through to heuristic reasons below
      }
    }

    if (explanations.length === 0) {
      explanations = top3.map((p) => {
        const reasons: string[] = [];
        // Location reason
        if (p.location?.landmark) {
          reasons.push(`Prime location: ${p.location.landmark}`);
        } else {
          reasons.push(`Located in desirable ${p.location.neighborhood || p.location.subCity} corridor`);
        }

        // Budget reason
        if (criteria.maxPrice && p.price <= criteria.maxPrice) {
          reasons.push(`Budget match: ETB ${p.price.toLocaleString()}/mo is within your ETB ${criteria.maxPrice.toLocaleString()} limit`);
        } else {
          reasons.push(`Competitive rate: ETB ${p.price.toLocaleString()}/mo for ${p.area} m² space`);
        }

        // Utilities reason
        const utilities = p.amenities.filter((a: string) =>
          ["Water tank", "Water", "Generator", "24/7 security", "Parking", "Balcony", "Garden"].includes(a)
        );
        if (utilities.length > 0) {
          reasons.push(`Verified amenities: ${utilities.slice(0, 3).join(", ")}`);
        } else {
          reasons.push(`Verified property with direct landlord communication`);
        }

        return {
          title: p.title,
          reasons,
        };
      });
    }

    res.status(200).json({
      success: true,
      criteria,
      count: enrichedProperties.length,
      properties: enrichedProperties,
      explanations,
      engine: usedGemini ? "Gemini 2.0 Flash" : "Addis Intelligent NLP Engine",
    });
  } catch (error) {
    next(error);
  }
};
