import {styled} from "../styles"
import {View} from "./View"

/**
 * Attempts to center its content in all directions, using flexbox.
 * It is not recommended for text centering where `text-align: center`
 * styling is preferred.
 */
export const Center = styled(View)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
`
