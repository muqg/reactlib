import {COLOR_BACKGROUND, COLOR_TEXT} from "./colours"
import {createGlobalStyle} from "./styled-components"

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
        background: ${p => p.theme.background || COLOR_BACKGROUND};
        cursor: default;
        color: ${p => p.theme.text || COLOR_TEXT};
        font-family: "Helvetica", "Arial", sans-serif;
    }

    a,
    button,
    select {
        color: ${p => p.theme.text || COLOR_TEXT};
    }

    option {
        color: initial;
    }

    ul {
        list-style: none;
    }

    a {
        cursor: pointer;
        text-decoration: none;
    }
`
