import { createContext, useContext, useEffect, useReducer } from "react";

// https://reactjs.org/docs/hooks-reference.html#usecontext
// https://reactjs.org/docs/context.html

const defaultState = {
  skipLinkTargetRef: null,
  bodyScrollLocked: false,
  bodyContentHidden: false
};

const AppContext = createContext({ app: defaultState, dispatchApp: null });

AppContext.displayName = "AppContext"; // For React dev tools

// Returns the current context value for `AppContext`, which is determined by the `value`
// prop of the nearest `<AppContext.Provider>` above the calling component in the tree
export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [app, dispatchApp] = useReducer(appReducer, defaultState);

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

  const value = { app, dispatchApp };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const appReducer = (state, payload) => {
  return { ...state, ...payload };
};

/**
 * TODO: replace the above with the following if and when we need this context to perform
 * more complex state transitions. The difference in usage would look like this:
 *
 * `dispatchApp({ bodyContentHidden: true });`
 * vs
 * `dispatchApp({ type: "UPDATE", payload: { bodyContentHidden: hidden } });`
 *
 * "Keeping all state transitions neatly organized into one reducer function":
 * https://www.robinwieruch.de/react-usereducer-vs-usestate
 * https://www.robinwieruch.de/react-state-usereducer-usestate-usecontext
 */
// const appReducer = (state, action) => {
//   switch (action.type) {
//     case "UPDATE":
//       return { ...state, ...action.payload };
//     default:
//       console.warn(`Invalid appReducer action type: ${action.type}`);
//       return state;
//   }
// };
