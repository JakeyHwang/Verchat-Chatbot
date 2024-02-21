import React from "react";
import { createRoot } from "react-dom";
import { Provider } from "react-redux";
// import configureStore from "./app/store";
import RootLayout from "./app/layout";

// const store = configureStore();


createRoot(document.getElementById("root")).render(
  // <Provider store={store}>
  <Provider>
    <RootLayout />
  </Provider>
);