import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
    DiscreteColorLegend,
    FlexibleWidthXYPlot,
    HorizontalGridLines,
    LineSeries,
    VerticalGridLines,
    XAxis,
    YAxis
} from "react-vis";
import {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../assets/chart.css';

const Chart = ({series, handlePop}) => {

    const [perCapita, setPerCapita] = useState(true);
    const [xRange, setXRange] = useState([1960, 2018]);
    const [hoveredItem, setHoveredItem] = useState(false);

    function togglePerCapita() {
        setPerCapita(!perCapita);
    }

    function handleRange(valuePair) {
        if (valuePair[0] !== valuePair[1]) {
            setXRange(valuePair);
        }
    }

    return (
        <>
            <label>
                Emissions per capita
            </label>
            <label className="checkbox_rounded">
                <input
                    type="checkbox"
                    checked={perCapita}
                    onChange={togglePerCapita}
                />
                <div className="checkbox_hover"></div>
            </label>
            <DiscreteColorLegend
                orientation="horizontal"
                height={65}
                items={series.map((country, key) => (country.name === hoveredItem ? (
                    <div key={key}>{country.name}<br/>Remove</div>) : country.name))}
                onItemMouseEnter={i => setHoveredItem(i)}
                onItemMouseLeave={() => setHoveredItem(false)}
                onItemClick={(_, index) => handlePop(index)}/>
            <FlexibleWidthXYPlot
                height={400}
                type='linear'
                colorType="linear"
                colorDomain={[0, 1, 2]}
                colorRange={['blue', 'green']}
                margin={{left: 0}}
                xDomain={xRange}>
                <VerticalGridLines/>
                <HorizontalGridLines/>
                <XAxis tickFormat={(v) => `${v}`} tickLabelAngle={-45}/>
                <YAxis
                    title={perCapita ? "CO2-emissions per capita (t)" : "CO2-emissions (1000 kt)"}
                    tickFormat={(v) => (perCapita ? v * 1000 : v / 1000)}
                    left={40}
                    hideLine/>
                {series.map(data => (
                    <LineSeries data={perCapita ? data.dataPerCapita : data.data}
                                color={data.color}/>
                ))}
            </FlexibleWidthXYPlot>
            {series[0] &&
            <Range
                min={series[0].data[0].x}
                max={series[0].data[series[0].data.length - 1].x}
                step={1}
                onChange={(e) => handleRange(e)}
                value={xRange}
                defaultValue={[series[0].data[0].x, series[0].data[series[0].data.length - 1].x]}
                allowCross={false}
                pushable={true}
            />
            }
        </>
    )

};

Chart.propTypes = {
    handlePop: PropTypes.func.isRequired,
    series: PropTypes.array
};

export default Chart;