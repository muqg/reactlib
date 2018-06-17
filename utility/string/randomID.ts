import { CHAR_CODE_A, CHAR_CODE_Z } from "../dom";
import { random } from "../math";

function randomID(length: number, keyspace = "") {
    const result: string[] = []

    for(let i = 0; i < length; i++) {
        if(keyspace)
            result.push(keyspace.charAt(random(0, keyspace.length - 1)))
        else
            result.push(String.fromCharCode(random(CHAR_CODE_A, CHAR_CODE_Z)))
    }

    return result.join("").toLowerCase()
}


export { randomID }
