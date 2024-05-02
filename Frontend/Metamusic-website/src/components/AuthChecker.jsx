import { HomePage } from "../pages/HomePage";
import { LandingPage } from "../pages/LandingPage";
import { useEffect, useState } from "react";

export function AuthChecker() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let data = localStorage.getItem('user');
    setUser(JSON.parse(data));
  }, []);

  return (
    user ? <HomePage /> : <LandingPage />
  );
}