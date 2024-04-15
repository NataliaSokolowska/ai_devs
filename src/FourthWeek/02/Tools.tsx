import { useEffect } from "react";
import {
  connectWithOpenApiWithFilteredInformation,
  fetchTaskData,
  submitAnswer,
} from "../../Utils/utils";
import {
  GPT_3_5_TURBO,
  TASK_NAME_04_02_TOOLS,
} from "../../Utils/utils.constants";
import { TOOLS_SYSTEM_PROMPT } from "./Tools.constants";

const Tools = () => {
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchTaskData(TASK_NAME_04_02_TOOLS)
      .then(({ task, token }) => {
        connectWithOpenApiWithFilteredInformation(
          TOOLS_SYSTEM_PROMPT(todayDate),
          task.question,
          GPT_3_5_TURBO
        )
          .then((data) => {
            submitAnswer(token, JSON.parse(data));
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }, [todayDate]);
};

export default Tools;
