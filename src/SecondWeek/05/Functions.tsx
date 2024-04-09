import { fetchTaskData, submitAnswer } from "../../Utils/utils";
import { TASK_NAME_02_05_FUNCTIONS } from "../../Utils/utils.constants";

const Functions = async () => {
  //"send me definition of function named addUser that require 3 params: name (string), surname (string) and year of birth in field named "year" (integer). Set type of function to "object""
  // "send this definition as correct JSON structure inside 'answer' field (as usual)"
  try {
    const functionDefinition = {
      name: "addUser",
      description:
        "Defines a function named addUser that takes three parameters: name, surname, and year (within a field named 'year').",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the user.",
          },
          surname: {
            type: "string",
            description: "The surname of the user.",
          },
          year: {
            type: "integer",
            description: "The year of birth of the user.",
          },
        },
      },
    };

    const { token } = await fetchTaskData(TASK_NAME_02_05_FUNCTIONS);

    const answer = functionDefinition;
    const result = await submitAnswer(token, answer);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export default Functions;
