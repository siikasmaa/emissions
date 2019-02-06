import React from 'react';

import '../assets/search.css';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            result: []
        };
    }

    handleInputChange = () => {
        this.setState({
            query: this.search.value
        }, () => {
            var results = [];
            if (this.state.query && this.state.query.length > 1) {
                this.props.data.forEach((country) => {
                    if (country.name.toLowerCase().indexOf(this.state.query.toLowerCase()) === -1 &&
                        country.country_key.toLowerCase().indexOf(this.state.query.toLowerCase()) === -1) {
                        return;
                    }
                    results.push(country);
                });
            }
            this.setState({
                result: results,
            })
        })
    };

    render() {
        return (
            <form action="#">
                <input
                    id="search-input"
                    placeholder="Search for..."
                    ref={input => this.search = input}
                    onChange={this.handleInputChange}
                    autoFocus
                />
                <ul>
                    {this.state.result.map(r => (
                        <li className="search-item" key={r.country_key} onClick={(e) => {
                            this.props.handleClick(r.country_key, e);
                            this.search.value = "";
                            this.handleInputChange()
                        }}>
                            {r.name}
                        </li>))}
                </ul>
            </form>
        )
    }
}

export default Search;