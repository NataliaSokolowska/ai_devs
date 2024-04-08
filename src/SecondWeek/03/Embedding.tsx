import {
  connectWithAda002,
  fetchTaskData,
  submitAnswer,
} from "../../Utils/utils";
import {
  TASK_MESSAGE_02_03_EMBEDDING,
  TASK_NAME_02_03_EMBEDDING,
} from "../../Utils/utils.constants";

const Embedding = () => {
  connectWithAda002(TASK_MESSAGE_02_03_EMBEDDING).then(async (response) => {
    const { token } = await fetchTaskData(TASK_NAME_02_03_EMBEDDING);

    if (response.length === 1536) {
      const answer = response;
      submitAnswer(token, answer);
    }
  });

  return <p>Embedding</p>;
};

export default Embedding;
