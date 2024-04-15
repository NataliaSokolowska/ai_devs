import { useEffect } from "react";
import {
  connectWithOpenApiWithFilteredInformation,
  fetchTaskData,
  submitAnswer,
} from "../../Utils/utils";
import {
  GPT_3_5_TURBO,
  TASK_NAME_04_01_KNOWLEDGE,
} from "../../Utils/utils.constants";
import useDataFetcher from "./hooks/useDataFetcher";
import {
  FUNCTION_CALLING,
  KNOWLEDGE_SYSTEM_PROMPT_V2,
  TYPE_OF_DATA_V2,
} from "./Knowledge.constants";
import { ApiResponse } from "./Knowledge.interface";

const Knowledge = () => {
  const { fetchExchangeRate, fetchPopulation, fetchCapital } = useDataFetcher();

  useEffect(() => {
    const handleResponse = (response: ApiResponse, token: string) => {
      if (response.function === TYPE_OF_DATA_V2.EXCHANGE) {
        console.log("exchange", response);
        const { currency } = response.arguments;
        console.log("currency", currency);
        if (currency) {
          fetchExchangeRate(currency)
            .then((rate) => submitAnswer(token, rate))
            .catch((error) =>
              console.error("Error handling exchange rate:", error)
            );
        }
      } else if (response.function === TYPE_OF_DATA_V2.POPULATION) {
        console.log("population", response);
        const { country } = response.arguments;
        if (country) {
          fetchPopulation(country)
            .then((population) => submitAnswer(token, population))
            .catch((error) =>
              console.error("Error handling population:", error)
            );
        }
      } else if (response.function === "FetchCapital") {
        const { country } = response.arguments;
        if (country) {
          fetchCapital(country)
            .then((capital) => submitAnswer(token, capital))
            .catch((error) =>
              console.error("Error handling population:", error)
            );
        }
      } else {
        console.log("general data", response);
        const { answer } = response.arguments;
        submitAnswer(token, answer).catch((error) =>
          console.error("Error submitting answer:", error)
        );
      }
    };

    fetchTaskData(TASK_NAME_04_01_KNOWLEDGE).then(({ task, token }) => {
      if (task && task.question) {
        connectWithOpenApiWithFilteredInformation(
          KNOWLEDGE_SYSTEM_PROMPT_V2,
          task.question,
          // "What is the exchange rate for the Euro?",
          // "What is the population of Germany?",
          GPT_3_5_TURBO,
          true,
          FUNCTION_CALLING
        )
          .then((response) => {
            console.log("API Response:", response);
            if (typeof response === "string") {
              try {
                const data = JSON.parse(response);
                handleResponse(data, token);
              } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
              }
            } else {
              handleResponse(response, token);
            }
          })
          .catch((error) => console.error("Error connecting to API:", error));
      }
    });
  }, [fetchExchangeRate, fetchPopulation, fetchCapital]);

  return (
    <div>
      <h1>Knowledge</h1>
    </div>
  );
};

export default Knowledge;
