import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import FrontPage from "./pages/front-page";
import { Provider as ChakraProvider } from "./components/ui/provider";
import ClocksPage from "./pages/clocks-page";
import ClockDetailPage from "./pages/clock-detail-page";
import ClockShowPage from "./pages/clock-show-page";
import { AuthProvider } from "./services/auth-provider";

export default function () {
  return (
    <ChakraProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/clocks" element={<ClocksPage />} />
            <Route path="/clocks/:id" element={<ClockDetailPage />} />
            <Route path="/clocks/:id/show" element={<ClockShowPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}
