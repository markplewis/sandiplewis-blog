import { createContext, useContext, useEffect, useReducer } from "react";

const defaultState = {
  skipLinkTargetRef: null,
  bodyScrollLocked: false,
  bodyContentHidden: false
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

  useEffect(() => {
    document.body.classList[app.bodyScrollLocked ? "add" : "remove"]("u-no-scroll--not-fixed");
    return () => {
      document.body.classList.remove("u-no-scroll--not-fixed");
    };
  }, [app.bodyScrollLocked]);

  useEffect(() => {
    document.body.classList[app.bodyContentHidden ? "add" : "remove"]("u-content-hidden");
    return () => {
      document.body.classList.remove("u-content-hidden");
    };
  }, [app.bodyContentHidden]);

  return { app, dispatchApp };
}
