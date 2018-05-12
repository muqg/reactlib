import { combineReducers, createStore} from "redux"
import { INITIAL_STATE } from "./const"

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


export default new Redux()
