import { Request, Response, NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Property } from "../models/Property.js";
import { calculateMatchScore } from "./propertyController.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// @desc    AI-powered property matching using Gemini
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

    // Step 1: Use Gemini to extract structured criteria from natural language
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
  "mustHaveAmenities": ["array of strings or empty, from: Parking, Water, Water tank, Electricity, Generator, Internet, 24/7 security, Elevator, Balcony, Garden, Compound, CCTV, Gym"],
  "keywords": ["array of important keywords from the query"],
  "summary": "A one-sentence summary of what the user is looking for"
}

User query: "${prompt}"`;

    const geminiResult = await model.generateContent(extractionPrompt);
    const responseText = geminiResult.response.text().trim();

    // Parse the JSON response from Gemini
    let criteria: any;
    try {
      // Remove markdown code blocks if present
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      criteria = JSON.parse(cleaned);
    } catch {
      criteria = {
        subCity: null,
        maxPrice: null,
        minBedrooms: null,
        propertyType: null,
        mustHaveAmenities: [],
        keywords: [],
        summary: "General property search in Addis Ababa",
      };
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
      query.price = { $lte: Number(criteria.maxPrice) * 1.15 }; // 15% tolerance
    }
    if (criteria.minBedrooms) {
      query.bedrooms = { $gte: Number(criteria.minBedrooms) };
    }
    if (criteria.propertyType) {
      query.propertyType = criteria.propertyType;
    }
    if (criteria.mustHaveAmenities?.length) {
      query.amenities = { $all: criteria.mustHaveAmenities };
    }

    // Step 3: Fetch matching properties
    let properties = await Property.find(query)
      .populate("owner", "name role avatar verificationTier")
      .limit(6);

    // If no results with strict criteria, fall back to broader search
    if (properties.length === 0) {
      const fallbackQuery: any = {
        "availability.status": { $in: ["Available", "Soon"] },
      };
      if (criteria.maxPrice) {
        fallbackQuery.price = { $lte: Number(criteria.maxPrice) * 1.5 };
      }
      properties = await Property.find(fallbackQuery)
        .populate("owner", "name role avatar verificationTier")
        .limit(6);
    }

    // Step 4: Calculate match scores
    const enrichedProperties = properties.map((prop) => {
      const matchScore = calculateMatchScore(prop, {
        budgetMax: criteria.maxPrice || 40000,
        mustHaveAmenities: criteria.mustHaveAmenities,
      });
      return {
        ...prop.toObject(),
        matchScore,
      };
    });

    // Sort by match score descending
    enrichedProperties.sort((a, b) => b.matchScore - a.matchScore);

    // Step 5: Generate AI explanations for top results
    let explanations: any[] = [];
    if (enrichedProperties.length > 0) {
      const top3 = enrichedProperties.slice(0, 3);
      const explanationPrompt = `You are Addis AI, a friendly housing assistant for Addis Ababa.
The user said: "${prompt}"

Here are the top matching properties:
${top3.map((p, i) => `${i + 1}. "${p.title}" in ${p.location.neighborhood}, ${p.location.subCity} - ETB ${p.price}/month - ${p.bedrooms} beds, ${p.bathrooms} baths, ${p.area}m² - Amenities: ${p.amenities.join(", ")}`).join("\n")}

For each property, provide a brief, warm explanation (2-3 sentences) of why it matches the user's needs. Focus on specific amenities, location benefits, and price fit.
Return ONLY valid JSON array (no markdown, no backticks):
[{"title": "...", "reasons": ["reason1", "reason2", "reason3"]}]`;

      try {
        const expResult = await model.generateContent(explanationPrompt);
        const expText = expResult.response.text().trim();
        const cleanedExp = expText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        explanations = JSON.parse(cleanedExp);
      } catch {
        explanations = top3.map((p) => ({
          title: p.title,
          reasons: [
            `Located in ${p.location.neighborhood}, ${p.location.subCity}`,
            `Priced at ETB ${p.price.toLocaleString()}/month`,
            `${p.bedrooms} bedrooms, ${p.bathrooms} bathrooms`,
          ],
        }));
      }
    }

    res.status(200).json({
      success: true,
      criteria,
      count: enrichedProperties.length,
      properties: enrichedProperties,
      explanations,
    });
  } catch (error) {
    next(error);
  }
};
