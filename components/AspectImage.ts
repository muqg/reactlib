import { styled } from "../styles";

interface StyleProps {
    size: string
}

export const AspectImage = styled.img`
    height: auto;
    max-height: ${(p: StyleProps) => p.size};
    max-width: ${(p: StyleProps) => p.size};
    width: auto;
`
