import * as React from "react";
import { useTranslation } from "../../hooks";

interface Props {
    title: string
    translate?: boolean
}


const DocumentTitle: React.StatelessComponent<Props> = ({title, translate}: Props) => {
    const getText = useTranslation()

    if(title) {
        if(translate)
            title = getText(title)
        document.title = title
    }

    return null
}


export { DocumentTitle };

