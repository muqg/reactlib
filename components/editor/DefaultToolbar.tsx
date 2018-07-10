import * as React from "react";
import { ToolbarAlign, ToolbarBold, ToolbarColour, ToolbarFontName, ToolbarFontSize, ToolbarImage, ToolbarItalic, ToolbarLink, ToolbarOrderedList, ToolbarStrikethrough, ToolbarUnderline } from "..";
import "../../css/toolbar.css";
import { ToolbarIndent } from "./items/ToolbarIndent";
import { ToolbarOutdent } from "./items/ToolbarOutdent";
import { ToolbarSubscript } from "./items/ToolbarSubscript";
import { ToolbarSuperscript } from "./items/ToolbarSuperscript";
import { ToolbarUnorderedList } from "./items/ToolbarUnorderedList";
import { Toolbar } from "./Toolbar";


interface Props {
    children?: any
    /**
     * Custom font names to add as options.
     *
     * Note that these fonts must be manually served to the user if they are not
     * supported by the browser.
     */
    fonts?: string[]
    /**
     * Callback to handle image file upload. Should return a string, representing
     * the url to the uploaded file that will be used as src when adding the image
     * element to the editor.
     */
    imageHandler?: (file: File) => string
}


const DefaultToolbar = (props: Props) => {
    return(
        <Toolbar>
            <ToolbarBold />
            <ToolbarItalic />
            <ToolbarUnderline />
            <ToolbarStrikethrough />
            <ToolbarSuperscript />
            <ToolbarSubscript />
            <ToolbarColour />
            <ToolbarFontName customFonts={props.fonts} />
            <ToolbarFontSize />
            <ToolbarAlign position="left" />
            <ToolbarAlign position="center" />
            <ToolbarAlign position="right" />
            <ToolbarAlign position="full" />
            <ToolbarOrderedList />
            <ToolbarUnorderedList />
            <ToolbarIndent />
            <ToolbarOutdent />
            <ToolbarLink />
            { props.imageHandler ?
                <ToolbarImage handler={props.imageHandler} />
                : ""
            }

            {props.children}

        </Toolbar>
    )
}


export { DefaultToolbar };
