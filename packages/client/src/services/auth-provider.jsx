import PocketBase from "pocketbase";
import React, { createContext, useEffect } from "react";

const pb = new PocketBase("http://localhost:8090");
// globally disable auto cancellation
pb.autoCancellation(false);

window.pb = pb;

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // useEffect(() => {
  //   pb.authStore.loadFromCookie(document.cookie);
  // }, []);

  const value = {
    pb,
    isAuthenticated: pb.authStore.isValid,
    user: pb.authStore.record,
    logout: () => {
      console.log("logging out");
      pb.authStore.clear();
      // document.cookie = 'pb_auth=; Max-Age=0; path=/; domain=' + window.location.hostname;
      window.location.reload();
    },
    login: ({ username, password }) => {
      return pb
        .collection("users")
        .authWithPassword(username, password)
        .then(({ _record, _token }) => {
          window.location.reload();
        });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
