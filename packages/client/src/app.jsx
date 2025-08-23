import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router";

import FrontPage from "./pages/front-page";
import { Provider as ChakraProvider } from "./components/ui/provider";
import ClocksPage from "./pages/clocks-page";
import ClockDetailPage from "./pages/clock-detail-page";
import ClockShowPage from "./pages/clock-show-page";
import { AuthContext, AuthProvider } from "./services/auth-provider";

function Login() {
  const { login } = useContext(AuthContext);
  let [searchParams] = useSearchParams();
  let token = searchParams.get("lwl-token");
  console.log({ token });
  useEffect(() => {
    if (token) {
      login(token)
        .then((result) => {
          console.log({ result });
        })
        .catch((error) => {
          console.error("Login failed:", error);
        });
    }
  }, [token, login]);

  return "logging in!";
}

export default function () {
  return (
    <ChakraProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/clocks" element={<ClocksPage />} />
            <Route path="/clocks/:id" element={<ClockDetailPage />} />
            <Route path="/clocks/:id/show" element={<ClockShowPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}
