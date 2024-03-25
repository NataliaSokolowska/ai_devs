import { useEffect } from "react";
import { TASK_NAME_04_MODERATION } from "../Utils/utils.constants";
import useTaskStore from "../Utils/useTaskStore";

const ModerationComponent = () => {
  const { response, isLoading } = useTaskStore((state) => ({
    response: state.responses[TASK_NAME_04_MODERATION],
    isLoading: state.isLoading[TASK_NAME_04_MODERATION],
  }));
  const runTask = useTaskStore((state) => state.runTask);

  useEffect(() => {
    if (!response && !isLoading) {
      runTask(TASK_NAME_04_MODERATION);
    }
  }, [response, isLoading, runTask]);

  return (
    <>
      <h2>Lesson 04 - Moderation</h2>
      {!response || isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>
            Response: {response.result.msg}, {response.result.note}
          </p>
          <p>Answer: {response.answer}</p>
        </div>
      )}
    </>
  );
};

export default ModerationComponent;
