import "./App.css";
import "./fonts/SourceSans/SourceSans3-Light.ttf";
import "./fonts/SourceSans/SourceSans3-LightItalic.ttf";
import "./fonts/SourceSans/SourceSans3-Regular.ttf";
import "./fonts/SourceSans/SourceSans3-Medium.ttf";
import "./fonts/SourceSans/SourceSans3-SemiBold.ttf";

import "./fonts/Roboto/Roboto-Light.ttf";
import "./fonts/Roboto/Roboto-Medium.ttf";
import "./fonts/Roboto/Roboto-Regular.ttf";
import "./fonts/Roboto/Roboto-SemiBold.ttf";
import "./fonts/Roboto/Roboto-Bold.ttf";

import { RouterProvider } from "react-router-dom";
// import ChatContainer from "./components/chat/ChatContainer";

function App({ router }) {
  return (
    <div className="App">
      <RouterProvider router={router} />
      {/* <ChatContainer /> */}
    </div>
  );
}

export default App;
