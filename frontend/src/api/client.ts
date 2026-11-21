// Intelligent URL normalizer
let rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim();
// Remove any trailing slashes
rawBase = rawBase.replace(/\/+$/, "");

// Ensure it ends with /api
if (!rawBase.endsWith("/api")) {
  rawBase = `${rawBase}/api`;
}

export const API_BASE_URL = rawBase;

// Fallback to Render backend host if local Vercel image fails, or to default Ethiopian photo
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.currentTarget;
  const currentSrc = target.getAttribute("src") || target.src || "";

  // Step 1: If it's a local /images/properties/ path that failed, try Render backend host
  if (currentSrc.includes("/images/properties/") && !target.dataset.retriedBackend) {
    target.dataset.retriedBackend = "true";
    const path = currentSrc.substring(currentSrc.indexOf("/images/properties/"));
    target.src = `https://kirayaddis-kvmn.onrender.com${path}`;
    return;
  }

  // Step 2: Fallback to default Ethiopian house photo
  if (!target.dataset.retriedDefault) {
    target.dataset.retriedDefault = "true";
    target.src = "/images/properties/bole-road-1.jpg";
    return;
  }

  // Step 3: If even local default fails, use the backend default directly
  if (!target.dataset.retriedFinal) {
    target.dataset.retriedFinal = "true";
    target.src = "https://kirayaddis-kvmn.onrender.com/images/properties/bole-road-1.jpg";
  }
}

export function getImageUrl(url?: string): string {
  if (!url) return "/images/properties/bole-road-1.jpg";
  return url;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("addis_kiray_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Ensure clean single slash before endpoint
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_BASE_URL}${cleanEndpoint}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }

  return data;
}
