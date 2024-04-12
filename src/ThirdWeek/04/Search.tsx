import { useEffect } from "react";
import {
  connectWithAda002,
  fetchTaskData,
  submitAnswer,
} from "../../Utils/utils";
import { TASK_NAME_03_04_SEARCH } from "../../Utils/utils.constants";
import useVectorData from "./hooks/useVectorData";
import useQdrant from "./hooks/useQdrant";

const Search = () => {
  const { vectors, fetchVectors } = useVectorData();
  const { collections, fetchCollections, searchInQdrant, updateCollection } =
    useQdrant(vectors);

  console.log(vectors.length);

  useEffect(() => {
    if (vectors.length === 0) {
      fetchVectors();
    }
  }, [vectors.length, fetchVectors]);

  useEffect(() => {
    if (collections.length === 0) {
      fetchCollections();
    }
  }, [collections.length, fetchCollections]);

  useEffect(() => {
    if (vectors.length > 0 && collections.length > 0) {
      updateCollection();
    }
  }, [vectors, collections, updateCollection]);

  useEffect(() => {
    const performSearch = () => {
      fetchTaskData(TASK_NAME_03_04_SEARCH)
        .then((taskData) => {
          if (taskData.task && taskData.task.question) {
            connectWithAda002(taskData.task.question)
              .then((questionVector) => {
                searchInQdrant(questionVector)
                  .then((searchResult) => {
                    submitAnswer(taskData.token, searchResult).catch(
                      (error) => {
                        console.error("Error submitting answer:", error);
                      }
                    );
                  })
                  .catch((error) => {
                    console.error("Error during search in Qdrant:", error);
                  });
              })
              .catch((error) => {
                console.error("Error connecting with Ada002:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error during fetch task data operation:", error);
        });
    };

    performSearch();
  }, [searchInQdrant]);

  return (
    <div>
      <h1>Search Component</h1>
    </div>
  );
};

export default Search;
