import React from 'react';
import '../assets/main.css';

import Search from '../components/Search';
import Chart from '../components/Chart';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCountries: [],
            availableCountries: [],
            countryData: []
        };
        this.fetchAvailableCountries = this.fetchAvailableCountries.bind(this);
    }

    componentWillMount() {
        this.fetchAvailableCountries();
    }

    fetchAvailableCountries() {
        fetch("/api/v1/countries", {
            method: "GET", dataType: "JSON", headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                    availableCountries: result.data
                });
            })
            .catch((error) => {
                console.log(error, "API request failed")
            })
    }

    handleCountrySelection = (key, _) => {
        if (this.state.selectedCountries.indexOf(key) === -1) {
            this.setState({
                selectedCountries: [...this.state.selectedCountries, key]
            })
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
                    color: this.state.countryData.length,
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
                this.setState({
                    countryData: [...this.state.countryData, data]
                });
            })
            .catch((error) => {
                console.log(error, "API request failed")
            })
    };

    popCountryFromSelected(index) {
        this.setState({
            selectedCountries: this.state.selectedCountries.filter((_, i) => i !== index),
            countryData: this.state.countryData.filter((_, i) => i !== index)
        })
    };

    render() {
        var validList = this.state.availableCountries.filter((item) => {
            return this.state.selectedCountries.indexOf(item.country_key) === -1;
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
                        handleClick={this.handleCountrySelection.bind(this)}/>
                </div>
                <div className="row noselect">
                    <Chart series={this.state.countryData} handlePop={this.popCountryFromSelected.bind(this)}/>
                </div>
            </div>
        );
    }
}

export default Home;