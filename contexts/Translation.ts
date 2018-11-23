import { createContext } from "react";
import { Dict } from "../utility";


export const TranslationContext = createContext({} as Dict<any>)
export const Translator = TranslationContext.Provider
