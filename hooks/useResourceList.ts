import { useState } from "react";
import { ResourceProps, useResource } from ".";
import { replace } from "../utility/array";
import { call } from "../utility/function";
import { except } from "../utility/collection";

export interface ResourceObject<T extends string | number = number> {
    id: T
}

interface Props<T extends ResourceObject> extends ResourceProps<T> {
    listItems: T[]
}


function useResourceList<T extends ResourceObject>(props: Props<T>) {
    const [list, setList] = useState<T[]>(props.listItems)
    const resource = useResource<T>({
        ...except(props, "listItems"),
        deleted,
        saved,
    })

    async function saved(res: T) {
        if(!res.id)
            return

        const found = list.find(r => r.id === res.id)
        if(found)
            // TODO: VERIFY THAT ARGUMENTS ARE PLACED CORRECTLY
            setList(replace(list, found, res))
        else
            setList([res, ...list])

        return await call(props.saved, res)
    }

    async function deleted(res: T) {
        setList(list.filter(r => r.id !== res.id))
        return await call(props.deleted, res)
    }

    return {
        list,
        setList,
        ...resource
    }
}

export { useResourceList };

