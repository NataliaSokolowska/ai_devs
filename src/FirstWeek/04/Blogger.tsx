import { useEffect } from "react";
import useTaskStore from "../../Utils/useTaskStore";
import { TASK_NAME_04_BLOGGER } from "../../Utils/utils.constants";

const Blogger = () => {
  const { response, isLoading } = useTaskStore((state) => ({
    response: state.responses[TASK_NAME_04_BLOGGER],
    isLoading: state.isLoading[TASK_NAME_04_BLOGGER],
  }));
  const runTask = useTaskStore((state) => state.runTask);

  useEffect(() => {
    if (!response && !isLoading) {
      runTask(TASK_NAME_04_BLOGGER);
    }
  }, [response, isLoading, runTask]);

  return (
    <>
      <h2>Lesson 04 - Blogger</h2>
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

export default Blogger;
