// Intelligent URL normalizer
let rawBase = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim();
// Remove any trailing slashes
rawBase = rawBase.replace(/\/+$/, "");

// Ensure it ends with /api
if (!rawBase.endsWith("/api")) {
  rawBase = `${rawBase}/api`;
}

export const API_BASE_URL = rawBase;

// Fallback to Render backend host if local Vercel image fails
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.currentTarget;
  const currentSrc = target.getAttribute("src") || "";
  if (currentSrc.startsWith("/images/properties/") && !target.dataset.retried) {
    target.dataset.retried = "true";
    target.src = `https://kirayaddis-kvmn.onrender.com${currentSrc}`;
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
