import Lesson01 from "./01/Lesson01";
import Blogger from "./04/Blogger";
import ModerationComponent from "./04/Moderation";
import "./App.css";
import ConnectioctionWithApi from "./ConnectioctionWithApi";

function App() {
  return (
    <>
      <h1>AI devs</h1>
      <Lesson01 />
      <ConnectioctionWithApi />
      <ModerationComponent />
      <Blogger />
    </>
  );
}

export default App;
