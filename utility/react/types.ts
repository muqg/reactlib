import {Dispatch, SetStateAction} from "react"

export type ReactStateSetter<T> = Dispatch<SetStateAction<T>>
