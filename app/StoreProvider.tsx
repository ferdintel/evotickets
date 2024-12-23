"use client";

import store from "lib/store";
import { Provider } from "react-redux";
import AuthProvider from "./AuthProvider";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
