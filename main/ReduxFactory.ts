import { combineReducers, createStore } from "redux";
import { isEmpty } from "../utility/collection";
import { initialState } from "./initialState";

/**
 * Redux universal store builder class.
 */
class ReduxFactory {
    reducers: object = {}
    state: object = {...initialState("")}

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
        if(isEmpty(this.reducers))
            throw("Cannot create a store when there are no reducers.")
        const store = createStore(combineReducers(this.reducers), this.state)

        // Reset Redux factory before returning the store.
        this.reducers = this.state = {}
        return store
    }
}

const redux = new ReduxFactory()
export { redux as ReduxFactory };

