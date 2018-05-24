import { combineReducers, createStore } from "redux";
import { INITIAL_STATE } from "./const";

/**
 * Redux universal store builder class.
 */
class Redux {
    reducers: object = {}
    state: object = {...INITIAL_STATE}

    /**
     * Adds object state elements to store.
     * @param stateItems The state items to be added.
     */
    addToState(stateItems: object) {
        this.state = {...this.state, ...stateItems}
    }

    /**
     * Adds reducers to store.
     * @param reducers The reducers to be added.
     */
    addReducers(reducers: object) {
        this.reducers = {...this.reducers, ...reducers}
    }

    /**
     * Returns a new store object, using the class' reducers and state.
     */
    getStore() {
        if(!this.reducers)
            throw("Cannot create a store when there are no reducers.")
        return createStore(combineReducers(this.reducers), this.state)
    }
}


export default new Redux()
