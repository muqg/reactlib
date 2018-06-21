import { StringDict } from "../interfaces";
import { clamp } from "../number";
import { capitalize } from "../string";


type AlignPosition = "left" | "right" | "center" | "full"
type FontSize = 1 | 2 | 3 | 4 | 5 | 6 | 7
type HeadingSize = 1 | 2 | 3 | 4 | 5 | 6

export interface ImageStyle extends StringDict<any> {
    display?: string
    height?: string
    width?: string
}


class Editor {
    private lastSelectionRange: Range | null = null

    constructor() {
        this.exec("defaultParagraphSeparator", "p");
    }

    /**
     * Executes a document command.
     * @param command The command to execute.
     * @param value Optional value.
     */
    private exec(command: string, value?: string) {
        this.restoreSelection()
        return document.execCommand(command, false, value)
    }

    /**
     * Returns a command's value.
     * @param command The command name.
     */
    private val(command: string) {
        return document.queryCommandValue(command).toString()
    }

    /**
     * Removes the wrapping node element of a text.
     * @param el The node element to be unwrapped.
     */
    private unwrapNodeText(el: HTMLElement) {
        const textNode = document.createTextNode(el.innerText)
        const parent = el.parentNode as HTMLElement
        parent.replaceChild(textNode, el)
    }

    /**
     * Compares the current command value to a new one and modifies the selected
     * text accordingly.
     * @param command The command name.
     * @param newValue The new value to compare against.
     * @param attrName The name of the attribute to be modified and checked.
     */
    private modifyFontValue(command: string, newValue: string, attrName: string) {
        const currentValue = this.val(command)
        if(newValue !== currentValue) {
            this.exec(command, newValue)
        }
        else {
            const fontElement = this.getSelectedNode() as HTMLFontElement
            if(fontElement.nodeName === "FONT") {
                fontElement.removeAttribute(attrName)
                if(!fontElement.attributes.length)
                    this.unwrapNodeText(fontElement)
            }
        }
    }

    /**
     * Returns selected window text.
     */
    getSelectedText() {
        return window.getSelection().toString()
    }

    /**
     * Returns the node that contains the current selection.
     */
    getSelectedNode() {
        return window.getSelection().getRangeAt(0).startContainer.parentNode
    }

    saveSelection(): void {
        const selection = window.getSelection();
        this.lastSelectionRange = selection.getRangeAt(0);
    }

    restoreSelection(): void {
        if(!this.lastSelectionRange)
            return

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.lastSelectionRange);
        this.lastSelectionRange = null
    }



    // ===========================
    // Command wrappers start here.
    // ===========================

    /**
     * Aligns the paragraph that contains the selected text to position.
     * @param position Alignment position type.
     */
    // Wraps around justify commands.
    align(position: AlignPosition) {
        const cmd = "justify" + capitalize(position)
        this.exec(cmd)
    }

    // NYI: backColor command.
    //backColor() {this.exec("backColor", "VALUE")}

    /**
     * Toggles bold styling for the selected text.
     */
    bold() {
        this.exec("bold")
    }

    /**
     * Transforms selected text into a link.
     * @param url Link's url path.
     */
    createLink(url: string = "#") {
        const container = this.getSelectedNode() as HTMLElement
        const isLink = container.nodeName === "A"
        if(!isLink)
            this.exec("createLink", url)
        else
            this.unwrapNodeText(container)
    }

    /**
     * Sets the font name for the selected text.
     * @param name Font name.
     */
    fontName(name: string) {
        this.modifyFontValue("fontName", name, "face")
    }

    /**
     * Sets the size of the font for the selected text.
     * @param size The size of the font.
     */
    fontSize(size: FontSize = 3) {
        this.modifyFontValue("fontSize", size.toString(), "size")
    }

    /**
     * Sets the foreground colour of the selected text.
     * @param red Red colour value.
     * @param green Green colour value.
     * @param blue Blue colour value.
     */
    foreColor(red: number, green: number, blue: number) {
        red = clamp(red, 0, 255)
        green = clamp(green, 0, 255)
        blue = clamp(blue, 0, 255)

        const color = `rgb(${red}, ${green}, ${blue})`
        this.modifyFontValue("foreColor", color, "color")
    }

    /**
     * Transforms selected paragraph into a heading or vice versa if already a
     * heading of the same size.
     * @param size Heading's size.
     */
    heading(size: HeadingSize) {
        const headingBlock = "h" + size
        const currentBlock = this.val("formatBlock").toLowerCase()
        const val = headingBlock === currentBlock ? "<p>" : headingBlock
        this.exec("formatBlock", val)
    }

    /**
     * Indents the paragraph that contains the selected text.
     */
    indent() {
        this.exec("indent")
    }

    /**
     * Inserts a horizontal line at cursor's position.
     */
    insertHorizontalRule() {
        this.exec("insertHorizontalRule")
    }

    /**
     * Inserts HTML at cursor's position while replacing any selected text.
     * @param html The HTML to be inserted.
     */
    insertHTML(html: string) {
        this.exec("insertHTML", html)
    }

    /**
     *
     * @param src Image source.
     * @param alt Image's alt text value.
     * @param style Additional styling for the image element. Currently suported.
     */
    insertImage(src: string, alt: string = "", style: ImageStyle = {}) {
        const img = document.createElement("img")
        img.src = src
        img.alt = alt

        for(let key in style)
            // @ts-ignore
            img.style[key] = style[key] || ""

        this.insertHTML(img.outerHTML)
    }

    /**
     * Toggles italic styling for the selected text.
     */
    italic() {
        this.exec("italic")
    }

    /**
     * Toggles ordered list bullet styling for the paragraph that contains the
     * selected text.
     */
    orderedList() {
        this.exec("insertOrderedList")
    }

    /**
     * Toggles bold styling for the selected text.
     */
    outdent() {
        this.exec("outdent")
    }

    /**
     * Removes any formatting from the selected text.
     */
    removeFormat() {
        this.exec("removeFormat")
    }

    /**
     * Toggles strike-through styling for the selected text.
     */
    strikeThrough() {
        this.exec("strikeThrough")
    }

    /**
     * Toggles subscript styling for the selected text.
     */
    subscript() {
        this.exec("subscript")
    }

    /**
     * Toggles superscript styling for the selected text.
     */
    superscript() {
        this.exec("superscript")
    }

    /**
     * Toggles underline styling for the selected text.
     */
    underline() {
        this.exec("underline")
    }

    /**
     * Toggles unordered list bullet styling for the paragraph that contains the
     * selected text.
     */
    unorderedList() {
        this.exec("insertUnorderedList")
    }
}


const editor = new Editor()
export {
    editor as Editor,

}
