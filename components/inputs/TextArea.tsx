import { styled } from "../../styles";
import { TextInput } from "./TextInput";


const TextArea = styled(TextInput).attrs<HTMLTextAreaElement>({
    as: "textarea"
})``
TextArea.displayName = "TextArea"


export { TextArea };

