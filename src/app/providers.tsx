"use client";

import SpinnerbLoader from "@/components/ui/SpinnerbLoader";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../lib/store";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center h-screen fixed w-full bg-white top-0 z-[999999999]">
            <SpinnerbLoader className="w-10 border-2 border-gray-300 border-r-gray-600" />
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default Providers;
