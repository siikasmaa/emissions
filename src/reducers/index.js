import {combineReducers} from 'redux'
import {fetchAvailableCountriesReducer, fetchCountryDataReducer} from "./countries";

export default combineReducers({
    availableCountries: fetchAvailableCountriesReducer,
    countryData: fetchCountryDataReducer
})