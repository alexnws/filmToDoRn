import React, { createContext, useContext, useReducer, ReactNode } from "react";

export type Movie = {
  id: string;
  title: string;
  poster: string;
  description: string;
  directors?: string[];
  actors?: string[];
};

type State = {
  favorites: Movie[];
  watchlist: Movie[];
};

type Action =
  | { type: "ADD_TO_FAVORITES"; payload: Movie }
  | { type: "ADD_TO_WATCHLIST"; payload: Movie };

const initialState: State = {
  favorites: [],
  watchlist: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TO_FAVORITES":
      return {
        ...state,
        favorites: state.favorites.find((m) => m.id === action.payload.id)
          ? state.favorites
          : [...state.favorites, action.payload],
      };
    case "ADD_TO_WATCHLIST":
      return {
        ...state,
        watchlist: state.watchlist.find((m) => m.id === action.payload.id)
          ? state.watchlist
          : [...state.watchlist, action.payload],
      };
    default:
      return state;
  }
}

const AppContext = createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
