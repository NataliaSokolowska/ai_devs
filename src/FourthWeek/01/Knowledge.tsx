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
import {
  ApiResponse,
  CapitalResponse,
  ExchangeResponse,
  PopulationResponse,
} from "./Knowledge.interface";

const Knowledge = () => {
  const { fetchExchangeRate, fetchPopulation, fetchCapital } = useDataFetcher();

  useEffect(() => {
    const hasFunctionProperty = (
      response: ApiResponse
    ): response is ExchangeResponse | PopulationResponse | CapitalResponse => {
      return "function" in response;
    };

    const handleResponse = (response: ApiResponse, token: string) => {
      if (response === null) {
        return;
      }
      if (hasFunctionProperty(response)) {
        if (response.function === TYPE_OF_DATA_V2.EXCHANGE) {
          const { currency } = response.arguments as { currency: string };
          fetchExchangeRate(currency)
            .then((rate) => submitAnswer(token, rate))
            .catch((error) =>
              console.error("Error handling exchange rate:", error)
            );
        } else if (response.function === TYPE_OF_DATA_V2.POPULATION) {
          const { country } = response.arguments as { country: string };
          fetchPopulation(country)
            .then((population) => submitAnswer(token, population))
            .catch((error) =>
              console.error("Error handling population:", error)
            );
        } else if (response.function === TYPE_OF_DATA_V2.CAPITAL) {
          const { capitalCountry } = response.arguments as {
            capitalCountry: string;
          };
          fetchCapital(capitalCountry)
            .then((capital) => submitAnswer(token, capital))
            .catch((error) => console.error("Error handling capital:", error));
        }
      } else {
        const { answer } = response.arguments as { answer: string };
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
