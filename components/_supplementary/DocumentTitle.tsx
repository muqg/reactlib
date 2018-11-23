import * as React from "react";
import { Translate } from ".";

interface Props {
    title: string
    translate?: boolean
}


const DocumentTitle: React.StatelessComponent<Props> = ({title, translate}: Props) => {
    if(title) {
        if(translate) {
            return (
                <Translate value={title}>
                    {text => {
                        document.title = text
                        return null
                    }}
                </Translate>
            )
        }
        else
            document.title = title
    }

    return null
}


export { DocumentTitle };
