import { useEffect } from "react";
import useOpenApiTaskStore from "../../Utils/useOpenApiTaskStore";
import { TASK_NAME_03_02_SCRAPER } from "../../Utils/utils.constants";

const Scraper = () => {
  const performTask = useOpenApiTaskStore((state) => state.performTask);

  useEffect(() => {
    performTask(TASK_NAME_03_02_SCRAPER);
  }, [performTask]);

  return null;
};

export default Scraper;
