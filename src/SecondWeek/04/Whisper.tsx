import {
  connectWithWhisper,
  fetchTaskData,
  submitAnswer,
} from "../../Utils/utils";
import { TASK_NAME_02_04_WHISPER } from "../../Utils/utils.constants";
import audio from "./assets/audio/mateusz.mp3";

const Whisper = () => {
  const fetchAudioFileAndConnect = async (audioUrl: string) => {
    const response = await fetch(audioUrl);
    const blob = await response.blob();
    const file = new File([blob], "mateusz.mp3", { type: "audio/mp3" });

    connectWithWhisper(file).then(async (response) => {
      const { token } = await fetchTaskData(TASK_NAME_02_04_WHISPER);
      submitAnswer(token, response.text);
    });
  };
  fetchAudioFileAndConnect(audio);
};

export default Whisper;
