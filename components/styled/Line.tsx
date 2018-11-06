import { styled, COLOR_PRIMARY_LIGHT } from "../../styles";


const Line = styled.div`
    ${(_p: StyleProps) => ''}

    background: ${COLOR_PRIMARY_LIGHT};
    height: 1px;
    margin: ${p => p.marginTop}px 0 ${p => p.marginBottom}px;
    padding: 0 !important;
    width: 100%;
`
Line.defaultProps = {
    marginTop: 19,
    marginBottom: 19
}

interface StyleProps {
    marginTop?: number
    marginBottom?: number
}


export { Line };
