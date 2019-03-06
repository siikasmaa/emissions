import React, {useEffect, useState} from 'react';
import '../assets/main.css';
import Search from '../components/Search';
import Chart from '../components/Chart';
import {connect} from "react-redux";
import {fetchAvailableCountries, fetchCountryData, popCountry} from "../actions";

const Home = (props) => {
    const [selectedCountries, setSelectedCountries] = useState([]);

    console.log(props);

    useEffect(() => {
        props.dispatch(fetchAvailableCountries());
    }, []);

    function handleCountrySelection(key, _) {
        if (selectedCountries.indexOf(key) === -1) {
            setSelectedCountries([...selectedCountries, key]);
            props.dispatch(fetchCountryData(key));
        }
    }

    function popCountryFromSelected(index) {
        setSelectedCountries(selectedCountries.filter((_, i) => i !== index));
        props.dispatch(popCountry(index, props.countryData))
    }

    var validList = props.availableCountries.filter((item) => selectedCountries.indexOf(item.country_key) === -1);

    console.log(validList);

    return (
        <div className="container">
            <div className="row">
                <h2>CO<sub>2</sub>-emissions</h2>
                <p>Start by searching for a country or a region</p>
            </div>
            <div className="row">
                <Search
                    data={validList}
                    loading={props.loading}
                    handleClick={handleCountrySelection.bind(this)}/>
            </div>
            <div className="row noselect">
                <Chart handlePop={popCountryFromSelected.bind(this)}/>
            </div>
        </div>
    );
};

export default connect(state => ({
    availableCountries: state.availableCountries.items,
    loading: state.availableCountries.loading,
    error: state.availableCountries.error,
    countryData: state.countryData.items
}))(Home);
