import { COLOR_BACKGROUND, COLOR_TEXT } from "./colours";
import { createGlobalStyle } from "./styled-components";

export const DefaultGlobalStyle = createGlobalStyle`
    * {
        border: none;
        box-sizing: border-box;
        cursor: inherit;
        margin: 0;
        outline: none;
        padding: 0;
    }

    body,
    html {
        background: ${COLOR_BACKGROUND};
        cursor: default;
        color: ${COLOR_TEXT};
        font-family: "Helvetica", "Arial", sans-serif;
    }

    ul {
        list-style: none;
    }

    a {
        color: ${COLOR_TEXT};
        cursor: pointer;
        text-decoration: none;
    }
`

