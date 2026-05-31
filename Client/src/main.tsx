import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, ExceptionHandlerProvider } from "./context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <ThemeProvider>
          <ExceptionHandlerProvider>
            <App />
          </ExceptionHandlerProvider>
        </ThemeProvider>
      </ReduxProvider>
    </BrowserRouter>
  </StrictMode>,
);
