import { useEffect, useState } from "react";
import { ResponseInterface, run } from "../Utils/utils";
import { TASK_NAME_01 } from "../Utils/utils.constants";

const HelloApiComponent = () => {
  const [response, setResponse] = useState<ResponseInterface>({
    result: {
      code: 0,
      msg: "",
      note: "",
    },
    answer: "",
  });

  useEffect(() => {
    run(TASK_NAME_01)
      .then(({ result, answer }) => setResponse({ result, answer }))
      .catch(console.error);
  }, []);

  return (
    <>
      <h2>Lesson 01</h2>
      <p>
        Response: {response.result.msg}, {response.result.note}
      </p>
      <p>Answer: {response.answer}</p>
    </>
  );
};

export default HelloApiComponent;
