import React from "https://esm.sh/react@18.2.0?dev";
import ReactDOM from "https://esm.sh/react-dom@18.2.0/client?dev";
import App from "./App.js";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));
