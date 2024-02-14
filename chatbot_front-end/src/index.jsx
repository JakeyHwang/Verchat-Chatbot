import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
// import configureStore from "./app/store";
import RootLayout from "./app/layout";

// const store = configureStore();

render(
  // <Provider store={store}>
  <Provider>
    <RootLayout />
  </Provider>,
  document.getElementById("root"),
);
