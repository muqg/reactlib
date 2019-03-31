import {useState} from "react"
import {replace} from "../utility/array"

export interface ResourceObject<T extends string | number = number> {
    id: T
}

function useResourceList<T extends ResourceObject>(listItems: T[]) {
    const [list, setList] = useState<T[]>(listItems)

    async function save(rsrc: T | Promise<T>) {
        const res = await rsrc

        if (!res.id) return

        const found = list.find(r => r.id === res.id)
        if (found) setList(replace(list, found, res))
        else setList([res, ...list])
    }

    function del(res: T) {
        setList(list.filter(r => r.id !== res.id))
    }

    return {
        delete: del,
        list,
        save,
        setList,
    }
}

export {useResourceList}
