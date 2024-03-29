import { useEffect } from "react";
import { fetchTaskData, submitAnswer } from "../../Utils/utils";
import { TASK_NAME_05_LIAR, TASK_URL } from "../../Utils/utils.constants";

const Liar = () => {
  useEffect(() => {
    const handleQuestion = async (question: string) => {
      const { task, token } = await fetchTaskData(TASK_NAME_05_LIAR);

      console.log(task, "task");

      const formData = new FormData();
      formData.append("question", question);

      const response = await fetch(`${TASK_URL}/${token}`, {
        method: "POST",
        body: formData,
      });

      const { answer } = await response.json();

      const isAnswerRelevant = (answer: string) => {
        const answerKeywords = "Warsaw";
        const questionKeywords = answerKeywords.split(" ");
        return questionKeywords.some((keyword) => answer.includes(keyword));
      };

      const relevance = isAnswerRelevant(answer);

      submitAnswer(token, relevance ? "yes" : "no");
    };

    handleQuestion("What is the capital of Poland?");
  }, []);

  return <div>🤥</div>;
};

export default Liar;
