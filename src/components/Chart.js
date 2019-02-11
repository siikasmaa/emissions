import React from 'react';
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

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perCapita: true,
            xRange: [1960, 2018],
            hoveredItem: false
        };
        this.togglePerCapita = this.togglePerCapita.bind(this);
    }

    togglePerCapita() {
        this.setState({
            perCapita: !this.state.perCapita
        })
    }

    handleRange(valuePair) {
        if (valuePair[0] !== valuePair[1]) {
            this.setState({
                xRange: valuePair,
            })
        }
    }

    render() {
        return (
            <>
                <label>
                    Emissions per capita
                </label>
                <label className="checkbox_rounded">
                    <input
                        type="checkbox"
                        checked={this.state.perCapita}
                        onChange={this.togglePerCapita}
                    />
                    <div className="checkbox_hover"></div>
                </label>
                <DiscreteColorLegend
                    orientation="horizontal"
                    height={65}
                    items={this.props.series.map((country, key) => (country.name === this.state.hoveredItem ? (
                        <div key={key}>{country.name}<br/>Remove</div>) : country.name))}
                    onItemMouseEnter={i => this.setState({hoveredItem: i})}
                    onItemMouseLeave={() => this.setState({hoveredItem: false})}
                    onItemClick={(_, index) => this.props.handlePop(index)}/>
                <FlexibleWidthXYPlot
                    height={400}
                    type='linear'
                    colorType="linear"
                    colorDomain={[0, 1, 2]}
                    colorRange={['blue', 'green']}
                    margin={{left: 0}}
                    xDomain={this.state.xRange}>
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis tickFormat={(v) => `${v}`} tickLabelAngle={-45}/>
                    <YAxis
                        title={this.state.perCapita ? "CO2-emissions per capita (t)" : "CO2-emissions (1000 kt)"}
                        tickFormat={(v) => (this.state.perCapita ? v * 1000 : v / 1000)}
                        left={40}
                        hideLine/>
                    {this.props.series.map(data => (
                        <LineSeries data={this.state.perCapita ? data.dataPerCapita : data.data}
                                    color={data.color}/>
                    ))}
                </FlexibleWidthXYPlot>
                {this.props.series[0] &&
                <Range
                    min={this.props.series[0].data[0].x}
                    max={this.props.series[0].data[this.props.series[0].data.length - 1].x}
                    step={1}
                    onChange={(e) => this.handleRange(e)}
                    value={this.state.xRange}
                    defaultValue={[this.props.series[0].data[0].x, this.props.series[0].data[this.props.series[0].data.length - 1].x]}
                    allowCross={false}
                    pushable={true}
                />
                }
            </>
        )
    }

}

export default Chart;