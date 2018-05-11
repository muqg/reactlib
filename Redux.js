import { combineReducers, createStore} from "react-redux"
import { INITIAL_STATE } from "./main"

class Redux {
    constructor() {
        this.reducers = {}
        this.state = {...INITIAL_STATE}
    }

    addToState(stateItems) {
        const type = typeof reducers
        if(type !== "object")
            throw("Expeceted object, " + type + " given")
        this.state = {...this.state, ...stateItems}
    }

    addReducers(reducers) {
        const type = typeof reducers
        if(type !== "object")
            throw("Expeceted object, " + type + " given")
        this.reducers = {...this.reducers, ...reducers}
    }

    getStore() {
        return createStore(combineReducers(this.reducers), this.state)
    }
}

const instance = new Redux()


export default instance
