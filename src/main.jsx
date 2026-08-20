import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { FilterProvider } from "./contexts/FilterContext";
import { LanguageProvider } from "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LanguageProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </LanguageProvider>
  </BrowserRouter>
);