import React, { createContext, useContext, useReducer, ReactNode } from "react"; //createContext pour créer un contexte global
// useContext: pour l'utiliser dans mes composants, useReducer: pour gérer mes états global avec des actions, ReactNode : pour typer les enfants dans le Provider

//Je définis la forme que mon objet film qui sera réutiliser dans mon app
export type Movie = {
  id: string;
  title: string;
  poster: string;
  description: string;
  directors?: string[];
  actors?: string[];
};
// Je définis le type de mon état global(stocker les données importantes partagées entre plusieurs pages) donc liste de films favorites et watchlist
type State = {
  favorites: Movie[];
  watchlist: Movie[];
};
// Je définis un type Action qui représente ce qu’on peut envoyer au reducer. type: l'action que je veux faire et payload:le film que j'ajoute
type Action =
  | { type: "ADD_TO_FAVORITES"; payload: Movie }
  | { type: "ADD_TO_WATCHLIST"; payload: Movie };

// État initial vide : aucun film dans les deux listes.
const initialState: State = {
  favorites: [],
  watchlist: [],
};

// prend en parametre : state l’état actuel (favoris et watchlist), action :une instruction avec un type (le nom de l’action) et un payload (le contenu de l’action)
function reducer(state: State, action: Action): State {
  switch (
    // switch  pour gérer différentes actions possible
    action.type //est une string (ex: "ADD_TO_FAVORITES")
  ) {
    case "ADD_TO_FAVORITES": // si l'action demandé est d'ajouter un film aux fovoris
      return {
        ...state, // je recopie tout l'état actuel
        favorites: state.favorites.find((m) => m.id === action.payload.id) //je regarde si le film est déjà présent dans les favoris
          ? state.favorites // si le film est déjà dans favoris alors on ne l'ajoute pas
          : [...state.favorites, action.payload], //je créé une nouvelle liste de favoris avec tous les films existant et le nouveau film à ajouter
      };
    case "ADD_TO_WATCHLIST":
      return {
        ...state,
        watchlist: state.watchlist.find((m) => m.id === action.payload.id)
          ? state.watchlist
          : [...state.watchlist, action.payload],
      };
    default:
      return state; // si le type d'action n'est pas reconnue, on ne fias rien, on retourne l'état actuel
  }
}

// je créé un context global avec creatContext que je stock dans une constante AppContext
const AppContext = createContext<
  // <> quel type de donné il doit gérer (générique)
  // le context : soit un objet | soit undifined
  | {
      state: State; // state global avec favorites et watchlist
      dispatch: React.Dispatch<Action>; // une fonction qui sert à envoyer des actions au reducer
    }
  | undefined // Parce qu’en dehors du AppProvider, le contexte peut être vide
>(undefined); // // Le contexte peut être undefined tant qu’il n’est pas utilisé dans un Provider

// je crées un composant personnalisé nommé AppProvider et reçois une priorité spécial children (encadrer dans mon provider) et ReactNode signifie : Tout élément React possible (du JSX, un <View>, un texte, etc.)
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState); // j'utilise useReducer pour créer un state global et une fonction pour la modifier reducer est ta fonction qui gère les actions (ADD_TO_FAVORITES, etc.)initialState est l’état de départ (favoris et watchlist vides) j'obtiens :state : contient les favoris et la watchlist et dispatch : permet d’envoyer des actions au reducer

  return (
    // j'encadre les enfants du composant children avec mon AppContext.Provider et je donnes au contexte la valeur partagée dans toute l’app donc aura accès à l’état global à la fonction dispatch pour le modifier
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  // je déclare un hook personnalisé appellé useAppContext et va permettre à n’importe quel composant de récupérer mon AppContext. pour centraliser l’accès au context
  const context = useContext(AppContext); // Je récupères la valeur du contexte que j'ai défini plus tôt (AppContext)
  if (!context) {
    // si quelqu'un utilise useAppContext() hors du AppProvider, la valeur sera undefined donc un messgae d'erreur ce lance. C’est une protection pour être sûr que l’app est bien construite.
    throw new Error(
      "useAppContext doit être utilisé à l’intérieur d’un AppProvider."
    );
  }
  return context;
};
