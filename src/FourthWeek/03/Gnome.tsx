import { useEffect } from "react";
import {
  connectWithVision,
  fetchTaskData,
  submitAnswer,
} from "../../Utils/utils";
import { TASK_NAME_04_03_GNOME } from "../../Utils/utils.constants";

const Gnome = () => {
  useEffect(() => {
    fetchTaskData(TASK_NAME_04_03_GNOME)
      .then(({ task, token }) => {
        // eslint-disable-next-line no-useless-escape
        const systemPrompt = `Tell me what is the color of the hat in POLISH. If there is no gnome in the picture, return  \"ERROR\" as answer`;
        if (task.url) {
          connectWithVision(task.url, systemPrompt)
            .then((data) => submitAnswer(token, data))
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  }, []);
};
export default Gnome;
