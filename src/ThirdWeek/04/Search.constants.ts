export const COLLECTION_NAME = "newsletter_collection";
export const QDRANT_HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${import.meta.env.VITE_QDRANT_API_KEY}`,
};
