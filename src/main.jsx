import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.jsx";
import { AppProvider } from "./context/Context.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config/metamask.config";
import { WagmiProvider } from "wagmi";

const client = new QueryClient();

createRoot(document.getElementById("root")).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={client}>
      <AppProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </AppProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
