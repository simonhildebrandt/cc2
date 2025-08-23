import PocketBase from "pocketbase";
import React, { createContext, useEffect } from "react";

const pb = new PocketBase(PB_HOST);
// globally disable auto cancellation
pb.autoCancellation(false);

window.pb = pb;

const lwlId = LWL_ID; // Login with link ID

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // useEffect(() => {
  //   pb.authStore.loadFromCookie(document.cookie);
  // }, []);

  async function login(token) {
    const res = await fetch(`${pb.baseURL}/api/auth/jwt-exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token }),
    });
    if (res.ok) {
      const { token, record } = await res.json();
      console.log("Login successful", { token, record });
      pb.authStore.save(token, record);
      window.location.assign("/");
    } else {
      throw new Error("Login failed");
    }
  }

  const value = {
    pb,
    isAuthenticated: pb.authStore.isValid,
    user: pb.authStore.record,
    loginLink: `https://login-with.link/login/${lwlId}`,
    login,
    logout: () => {
      console.log("logging out");
      pb.authStore.clear();
      // document.cookie = 'pb_auth=; Max-Age=0; path=/; domain=' + window.location.hostname;
      window.location.reload();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// login: ({ username, password }) => {
//   return pb
//     .collection("users")
//     .authWithPassword(username, password)
//     .then(({ _record, _token }) => {
//       window.location.reload();
//     });
// },
