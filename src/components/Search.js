import React, {useState} from 'react';
import PropTypes from 'prop-types';

import '../assets/Search.css';

const Search = ({data, handleClick, loading}) => {

    let searchInput;
    const [query, setQuery] = useState('');
    const [result, setResult] = useState([]);

    function handleInputChange() {
        setQuery(searchInput.value);
        var results = [];
        if (query && query.length > 1) {
            data.forEach((country) => {
                if (country.name.toLowerCase().indexOf(query.toLowerCase()) === -1 &&
                    country.country_key.toLowerCase().indexOf(query.toLowerCase()) === -1) {
                    return;
                }
                results.push(country);
            });
        }
        setResult(results);
    }

    return (
        <form action="#">
            <input
                id="search-input"
                placeholder={loading ? "Loading..." : "Search for..."}
                ref={input => {
                    searchInput = input
                }}
                onChange={handleInputChange}
                autoFocus
            />
            <ul>
                {result.map(r => (
                    <li className="search-item" key={r.country_key} onClick={(e) => {
                        handleClick(r.country_key, e);
                        searchInput.value = "";
                        handleInputChange()
                    }}>
                        {r.name}
                    </li>))}
            </ul>
        </form>
    )
};

Search.propTypes = {
    data: PropTypes.array,
    handleClick: PropTypes.func.isRequired
};

export default Search;