import React from 'react';

const ResponsiveTable = React.createClass({
    getInitialState(){
        return {buttonDisabled: false};
    },
    handleChange(){
        this.setState({buttonDisabled: true});
    },
    renderRow(weatherDate, i){
        if (weatherDate.date !== undefined) {
            return (
                <tr key={i}>
                    <td>{weatherDate.date.getFullYear()}</td>
                    <td>{weatherDate.weatherCondition}</td>
                    <td><a target="_blank" href={weatherDate.weatherLink}><i className={weatherDate.weatherIcon}></i></a></td>
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
                        <th>Vejrbeskrivelse</th>
                        <th>vejrikon</th>
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





