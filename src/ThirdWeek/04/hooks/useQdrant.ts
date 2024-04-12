import { useCallback, useState } from "react";
import { COLLECTION_NAME, QDRANT_HEADERS } from "../Search.constants";
import { Collection, QdrantResponse, VectorData } from "../Search.interface";

const useQdrant = (vectors: VectorData[]) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const createCollection = useCallback(() => {
    const response = fetch(`/qdrant/collections/${COLLECTION_NAME}`, {
      method: "PUT",
      headers: QDRANT_HEADERS,
      body: JSON.stringify({
        vectors: {
          size: 1536,
          distance: "Cosine",
          on_disk: true,
        },
      }),
    })
      .then((response) => response.json())
      .then((data: QdrantResponse<Collection>) => setCollections([data.result]))
      .catch((error) => console.error("Failed to create collection:", error));

    return response;
  }, []);

  const fetchCollections = useCallback(async () => {
    const response = await fetch("/qdrant/collections", {
      method: "GET",
      headers: QDRANT_HEADERS,
    })
      .then((response) => response.json())
      .then(({ result }) => {
        setCollections(result.collections);
        if (result.collections.length === 0) {
          createCollection();
        }
      })
      .catch((error) => console.error("Failed to fetch collections:", error));

    return response;
  }, [createCollection]);

  const searchInQdrant = useCallback(
    async (vector: number[]): Promise<string> => {
      const response = await fetch(
        `/qdrant/collections/${COLLECTION_NAME}/points/search`,
        {
          method: "POST",
          headers: QDRANT_HEADERS,
          body: JSON.stringify({
            vector,
            limit: 1,
            with_payload: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const { result } = data;

      if (result.length > 0 && result[0].payload && result[0].payload.url) {
        return result[0].payload.url;
      } else {
        throw new Error("No valid entries with URL found.");
      }
    },
    []
  );

  const createPoints = useCallback(() => {
    return vectors.map((vector) => ({
      id: vector.id,
      vector: vector.vector,
      payload: {
        title: vector.title,
        info: vector.info,
        url: vector.url,
      },
    }));
  }, [vectors]);

  const updateCollection = useCallback(async () => {
    const points = createPoints();
    const response = await fetch(
      `/qdrant/collections/${COLLECTION_NAME}/points?wait=true`,
      {
        method: "PUT",
        headers: QDRANT_HEADERS,
        body: JSON.stringify({ points }),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "ok") {
          console.log("Batch operation completed successfully", result);
        } else {
          console.error("Batch operation failed:", result);
        }
      })
      .catch((error) =>
        console.error("Failed to execute batch operation:", error)
      );

    return response;
  }, [createPoints]);

  return { collections, fetchCollections, searchInQdrant, updateCollection };
};

export default useQdrant;
