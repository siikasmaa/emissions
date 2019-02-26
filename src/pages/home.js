import React, {useEffect, useState} from 'react';
import '../assets/main.css';

import Search from '../components/Search';
import Chart from '../components/Chart';

const Home = () => {

    const [selectedCountries, setSelectedCountries] = useState([]);
    const [availableCountries, setAvailableCountries] = useState([]);
    const [countryData, setCountryData] = useState([]);

    useEffect(function fetchAvailableCountries() {
        fetch("/api/v1/countries", {
            method: "GET", dataType: "JSON", headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then((response) => response.json())
            .then((result) => {
                setAvailableCountries(result.data);
            })
            .catch((error) => {
                console.log(error, "API request failed")
            })
    });

    function handleCountrySelection(key, _) {
        if (selectedCountries.indexOf(key) === -1) {
            setSelectedCountries([...selectedCountries, key]);
        }
        fetch(`/api/v1/country/${key}`, {
            method: "GET", dataType: "JSON", headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then((response) => response.json())
            .then((result) => {
                var data = {
                    name: result.data[0].name,
                    color: countryData.length,
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
                setCountryData([...countryData, data]);
            })
            .catch((error) => {
                console.log(error, "API request failed")
            })
    }

    function popCountryFromSelected(index) {
        setSelectedCountries(selectedCountries.filter((_, i) => i !== index));
        setCountryData(countryData.filter((_, i) => i !== index));
    }

    var validList = availableCountries.filter((item) => {
        return selectedCountries.indexOf(item.country_key) === -1;
    });

    return (
        <div className="container">
            <div className="row">
                <h2>CO<sub>2</sub>-emissions</h2>
                <p>Start by searching for a country or a region</p>
            </div>
            <div className="row">
                <Search
                    data={validList}
                    handleClick={handleCountrySelection.bind(this)}/>
            </div>
            <div className="row noselect">
                <Chart series={countryData} handlePop={popCountryFromSelected.bind(this)}/>
            </div>
        </div>
    );
};

export default Home;