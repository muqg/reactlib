import * as React from "react";
import { ToolbarAlignCenter, ToolbarAlignFull, ToolbarAlignLeft, ToolbarAlignRight, ToolbarBold, ToolbarColour, ToolbarFontName, ToolbarFontSize, ToolbarImage, ToolbarIndent, ToolbarItalic, ToolbarLink, ToolbarOrderedList, ToolbarOutdent, ToolbarStrikethrough, ToolbarSubscript, ToolbarSuperscript, ToolbarUnderline, ToolbarUnorderedList } from "..";
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
            <ToolbarAlignLeft />
            <ToolbarAlignCenter />
            <ToolbarAlignRight />
            <ToolbarAlignFull />
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
