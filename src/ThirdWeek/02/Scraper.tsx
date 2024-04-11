import { useEffect } from "react";
import useOpenApiTaskStore from "../../Utils/useOpenApiTaskStore";

const Scraper = () => {
  const performTask = useOpenApiTaskStore((state) => state.performTask);

  useEffect(() => {
    performTask();
  }, [performTask]);

  return null;
};

export default Scraper;
