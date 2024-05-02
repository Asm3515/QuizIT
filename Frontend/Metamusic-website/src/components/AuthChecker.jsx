import { useOutletContext } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LandingPage } from "../pages/LandingPage";
import { useEffect } from "react";

export function AuthChecker() {
  const [user, setUser] = useOutletContext();

  useEffect(() => {
    let data = localStorage.getItem('user');
    setUser(JSON.parse(data));
  }, []);

  async function logOut() {
    localStorage.removeItem("user");
    setUser(null);
    const response = await fetch(`${url}/api/user/logout`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS,DELETE',
          'Access-Control-Allow-Credentials': 'true',
          'Authorization':`Bearer ${user.authToken}`,
      },
  });
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    if (response.status == 200) {
      localStorage.removeItem("user");
      setUser(null);
    }
    else {
      alert("Unable to logout, Please Try Again");
    }

  }

  return (
    user ? <HomePage logOut={logOut} /> : <LandingPage />
  );
}