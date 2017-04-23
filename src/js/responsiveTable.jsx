import React from 'react';

const ResponsiveTable = React.createClass({
    getInitialState() {
        return {buttonDisabled: false};
    },
    handleChange(){
        this.setState({buttonDisabled: true});
    },
    renderRow(weatherDate, i){
        let weatherCondition = weatherDate.weatherCondition;
        if(weatherCondition == undefined){
            weatherCondition = 'Ukendt'
        }
        if (weatherDate.date !== undefined) {
            let style = {
                background: 'rgba(253, 228, 58, 0.0)',
            };
            if (weatherDate.weatherCondition === 'Solskin') {
                style = {
                    background: 'rgba(253, 228, 58, 0.20)',
                };
            }
            return (
                <tr key={i} style={style}>
                    <td>{weatherDate.date.getFullYear()}</td>
                    <td><a target="_blank" href={weatherDate.weatherLink}>{weatherCondition} <i className={weatherDate.weatherIcon}></i></a></td>
                  
                </tr>
            )
        }
    },
    render(){
        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>År</th>
                        <th>Solskin/ikke solskin</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.rows.map(this.renderRow)
                    }
                    </tbody>
                </table>
            </div>
        )
    }
});


export default ResponsiveTable;





