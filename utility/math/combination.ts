import { variation } from "./variation";
import { permutation } from "./permutation";

function combination(elements: number, pick: number) {
    if(elements < pick)
        throw "Elements must be equal to or greater than pick"
    else if(elements === pick)
        return 1

    return variation(elements, pick) / permutation(pick)
}

export { combination };

