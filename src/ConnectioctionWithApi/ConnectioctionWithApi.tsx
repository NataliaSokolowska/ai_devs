import { useEffect } from "react";
import useOpenAiMessageStore from "./hooks/useOpenAiMessageStore";

const ConnectioctionWithApi = () => {
  const { fetchOpenAiMessage, returnMessage, isLoading } =
    useOpenAiMessageStore();

  useEffect(() => {
    fetchOpenAiMessage();
  }, [fetchOpenAiMessage]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <h3>Hi! I'am your {returnMessage.message.role}</h3>
      <h3>My answear is: {returnMessage.message.content}</h3>
    </>
  );
};

export default ConnectioctionWithApi;
