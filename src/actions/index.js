export const FETCH_EVENT_BEGIN = 'FETCH_EVENT_BEGIN';
export const FETCH_EVENT_FAILURE = 'FETCH_EVENT_FAILURE';
export const FETCH_EVENT_SUCCESS = 'FETCH_EVENT_SUCCESS';
export const FETCH_DATA_BEGIN = 'FETCH_DATA_BEGIN';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const POP_DATA = 'POP_DATA';


export const fetchAvailableCountriesBegin = () => ({
    type: FETCH_EVENT_BEGIN
});

export const fetchAvailableCountriesFailure = error => ({
    type: FETCH_EVENT_FAILURE,
    payload: error
});

export const fetchAvailableCountriesSuccess = countries => ({
    type: FETCH_EVENT_SUCCESS,
    payload: countries
});

export function fetchAvailableCountries() {
    return dispatch => {
        dispatch(fetchAvailableCountriesBegin());
        return fetch("/api/v1/countries", {
            method: "GET", dataType: "JSON", headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then((response) => response.json())
            .then((result) => {
                dispatch(fetchAvailableCountriesSuccess(result.data));
            })
            .catch((error) => {
                dispatch(fetchAvailableCountriesFailure(error))
            })
    }
}

export const fetchCountryDataBegin = () => ({
    type: FETCH_DATA_BEGIN
});

export const fetchCountryDataFailure = error => ({
    type: FETCH_DATA_FAILURE,
    payload: error
});

export const fetchCountryDataSuccess = data => ({
    type: FETCH_DATA_SUCCESS,
    payload: data
});

export const popCountryDataSuccess = data => ({
    type: POP_DATA,
    payload: data
});

export function fetchCountryData(key) {
    return dispatch => {
        dispatch(fetchCountryDataBegin());
        return fetch(`/api/v1/country/${key}`, {
            method: "GET", dataType: "JSON", headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then((response) => response.json())
            .then((result) => {
                var data = {
                    name: result.data[0].name,
                    color: 10, //TODO: Choose color?
                    data: result.data.map((item, _) => {
                        return {x: item.year, y: item.emissions};
                    }),
                    dataPerCapita: result.data.map((item, _) => {
                        return {
                            x: item.year,
                            y: (!isNaN(item.population) && item.population ? item.emissions / item.population : 0)
                        }
                    }),
                    opacity: 1
                };
                dispatch(fetchCountryDataSuccess(data))
            })
            .catch((error) => {
                dispatch(fetchCountryDataFailure(error))
            })
    }
}

export function popCountry(index, items) {
    return dispatch => {
        dispatch(popCountryDataSuccess(items.filter((_, i) => i !== index)));
    }
}