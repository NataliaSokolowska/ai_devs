import { useEffect } from "react";
import { TASK_NAME_01 } from "../../Utils/utils.constants";
import useTaskStore from "../../Utils/useTaskStore";
const HelloApiComponent = () => {
  const { response, isLoading } = useTaskStore((state) => ({
    response: state.responses[TASK_NAME_01],
    isLoading: state.isLoading[TASK_NAME_01],
  }));
  const runTask = useTaskStore((state) => state.runTask);

  useEffect(() => {
    if (!response && !isLoading) {
      runTask(TASK_NAME_01);
    }
  }, [response, isLoading, runTask]);

  return (
    <>
      <h2>Lesson 01 - API test</h2>
      {!response || isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <p>
            Response: {response.result.msg}, {response.result.note}
          </p>
          <p>Answer: {response.answer}</p>
        </>
      )}
    </>
  );
};

export default HelloApiComponent;
