import { COLOR_BACKGROUND, COLOR_TEXT } from "./colours";
import { createGlobalStyle } from "./styled-components";

export const DefaultGlobalStyle = createGlobalStyle`
    * {
        border: none;
        box-sizing: border-box;
        margin: 0;
        outline: none;
        padding: 0;
    }

    body,
    html {
        background: ${COLOR_BACKGROUND};
        color: ${COLOR_TEXT};
        font-family: "Helvetica", "Arial", sans-serif;
    }

    p, h1, h2, h3, h4, li, ul {
        cursor: default;
    }

    ul {
        list-style: none;
    }

    a {
        text-decoration: none;
    }
`

