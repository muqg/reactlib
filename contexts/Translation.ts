import { createContext } from "react";
import { initialState } from "../main";
import { Dict } from "../utility";


export const TranslationContext = createContext(initialState("locale") || {} as Dict<any>)

