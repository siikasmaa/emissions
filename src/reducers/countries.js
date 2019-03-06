import {FETCH_EVENT_BEGIN, FETCH_EVENT_SUCCESS, FETCH_EVENT_FAILURE, POP_DATA} from "../actions/index";
import {FETCH_DATA_BEGIN, FETCH_DATA_FAILURE, FETCH_DATA_SUCCESS} from "../actions";

const initialState = {
    items: [],
    loading: false,
    error: null
};

export function fetchAvailableCountriesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_EVENT_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_EVENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                items: action.payload
            };

        default:
            return state;
    }
}

export function fetchCountryDataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_DATA_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_DATA_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                items: [...state.items, action.payload]
            };

        case POP_DATA:
            return {
                ...state,
                loading: false,
                error: null,
                items: action.payload
            };

        default:
            return state;
    }
}