import { useEffect } from "react";
import useOpenApiTaskStore from "../../Utils/useOpenApiTaskStore";
import { TASK_NAME_03_03_WHOAMI } from "../../Utils/utils.constants";

const Whoami = () => {
  const performTask = useOpenApiTaskStore((state) => state.performTask);

  useEffect(() => {
    const systemData = `Based on the clues given, guess who it is about. If you don't know or are unsure, just return only the word 'nie' and nothing more`;
    performTask(TASK_NAME_03_03_WHOAMI, systemData);
  }, [performTask]);
};

export default Whoami;
