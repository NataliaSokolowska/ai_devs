import { useEffect } from "react";
import {
  connectWithOpenApiWithFilteredInformation,
  fetchTaskData,
  submitAnswer,
} from "../../Utils/utils";
import { TASK_NAME_02_02_INPROMPT } from "../../Utils/utils.constants";

const Inprompt = () => {
  useEffect(() => {
    const fetchDataAndSubmit = async () => {
      try {
        const { task, token } = await fetchTaskData(TASK_NAME_02_02_INPROMPT);

        const questionName = task.question
          .replace("?", "")
          .split(" ")
          .slice(-1)[0];

        const filteredInformation = task.input
          .filter((info: string) => info.includes(questionName))
          .join("\n");

        if (filteredInformation) {
          const answer = await connectWithOpenApiWithFilteredInformation(
            filteredInformation,
            task.question
          );
          await submitAnswer(token, answer);
        }
      } catch (error) {
        console.error("Error fetching task data or submitting answer", error);
      }
    };

    fetchDataAndSubmit();
  }, []);

  return <p>Inprompt</p>;
};

export default Inprompt;
