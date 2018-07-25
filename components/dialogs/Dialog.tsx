import * as React from "react";
import { dialog, InjectedDialogProps } from "../../hoc/dialog";
import { DialogTemplate, TemplateProps } from "./DialogTemplate";


interface Props extends TemplateProps {
}


const Dialog = (props: Props & InjectedDialogProps) => {
    return(
        <DialogTemplate {...props} />
    )
}


export default dialog(Dialog)
