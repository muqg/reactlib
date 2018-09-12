
interface Props {
    children?: JSX.Element
    title: string
}


const DocumentTitle: React.StatelessComponent<Props> = ({children, title}: Props) => {
    if(title)
        document.title = title

    return children || null
}


export { DocumentTitle };

