import { useCallback, useState } from "react";
import { DataJson, VectorData } from "../Search.interface";
import { v4 as uuidv4 } from "uuid";
import data from "../assets/newsletter.json";
import { connectWithAda002 } from "../../../Utils/utils";

const useVectorData = () => {
  const [vectors, setVectors] = useState<VectorData[]>([]);

  const fetchVectors = useCallback(() => {
    const vectorPromises = data.map((item: DataJson) =>
      connectWithAda002(item.url)
    );

    Promise.all(vectorPromises)
      .then((vectorResults) => {
        const newData = data.map((item: DataJson, index: number) => ({
          ...item,
          id: uuidv4(),
          vector: vectorResults[index],
        }));
        setVectors(newData);
      })
      .catch((error) => {
        console.error("Error fetching vectors:", error);
      });
  }, []);

  return { vectors, fetchVectors };
};

export default useVectorData;
