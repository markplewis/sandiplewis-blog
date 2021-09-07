import { createContext, useContext, useReducer } from "react";

const defaultState = {
  skipLinkTargetRef: null
};

const AppContext = createContext({});

export function useApp() {
  return useContext(AppContext);
}

const appReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return { ...state, ...action.payload };
    default:
      console.warn(`Invalid appReducer action type: ${action.type}`);
      return state;
  }
};

export function AppProvider({ children }) {
  const value = useAppProvider();
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppProvider({ reducer = appReducer, initial = defaultState } = {}) {
  const [app, dispatchApp] = useReducer(reducer, initial);
  return { app, dispatchApp };
}
