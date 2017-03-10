import React from 'react';
import { render } from 'react-dom';

import BirthdayInput from './birthdayInput.jsx';
import '../styles/index.scss';
import '../styles/weather-fonts/css/weather-icons.min.css';
/*
import BirthdayResult from './birthdayResult.jsx';
*/


function isTouchDevice() {
    return 'ontouchstart' in window        // works on most browsers
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
}


if (isTouchDevice()) {
    document.getElementsByTagName('body')[0].classList.add('touch');
}


const App = React.createClass({
    getInitialState() {
        return {
            tableData: [1],
            formattedBirthdayDate: '',
            showLoaderStyle: {
                display: 'none',
            },
        };
    },

    seeResults(dayInput, monthInput, yearInput, selectedCity){
        this.selectedCity = selectedCity;
        render(<div></div>, document.getElementById('birthday-result'));
            
        this.setState({
            showLoaderStyle: {
                display: 'block'
            }
        });

        if(selectedCity == 'copenhagen'){
            require(["./most_typical_weather_conditions_copenhagen.json"], (function(weatherConditions) {
                this.weatherConditions = weatherConditions;
                this.createDataForTable(dayInput.value, monthInput.selectedIndex, yearInput.value, monthInput.options[monthInput.selectedIndex].value);
            }).bind(this));
        }else{
            require(["./most_typical_weather_conditions_aarhus.json"], (function(weatherConditions) {
                this.weatherConditions = weatherConditions;
                this.createDataForTable(dayInput.value, monthInput.selectedIndex, yearInput.value, monthInput.options[monthInput.selectedIndex].value);
            }).bind(this));
        }
    },

    renderBirthdayResults(){

        /* async loading of components */
        require.ensure([], require => {
            const BirthdayResult = require('./birthdayResult.jsx').default;
            render(<BirthdayResult weatherConditions={this.weatherConditions} formattedbirthdayDate={this.state.formattedBirthdayDate} setDataForTable={this.state.tableData} /> , document.getElementById('birthday-result'));
            this.setState({
                showLoaderStyle: {
                    display: 'none'
                }
            });
        }, 'Component');
    },

    createDataForTable(day, monthIndex, year, month){
        if(year < 1996){
            year = 1996;
        }
        var now = new Date();
        var birthdaysEachYear = [];

        var start = new Date(`${day}/${monthIndex - 1}/${year}`);
        var end = new Date();
        let newDate;
        let i = year;
        for (i; i < end.getFullYear(); i++){
            newDate = new Date(i,monthIndex,day);
            birthdaysEachYear.push(newDate);
        }
        // weatherConditions
        // 1997-07-18
        function addZero(number){
            if(number < 10){
                return `0${number}`;
            }
            return number;
        }

        const dataForTable = birthdaysEachYear.map((birthday) =>{
            console.log(birthday);
            let weatherCondition;;
            let weatherLink;
            if(this.selectedCity == 'copenhagen'){
                weatherLink = `https://www.wunderground.com/history/airport/EKCH/${birthday.getFullYear()}/${addZero(monthIndex)}/${addZero(day)}/DailyHistory.html?req_city=Copenhagen&req_statename=Denmark`; 
            }else{
                weatherLink = `https://www.wunderground.com/history/airport/EKAH/${birthday.getFullYear()}/${addZero(monthIndex)}/${addZero(day)}/DailyHistory.html?req_city=Arhus&req_state=&req_statename=Denmark&reqdb.zip=&reqdb.magic=&reqdb.wmo=&MR=1`;
            }
            
            
            
            const formattedDate = `${birthday.getFullYear()}-${addZero(monthIndex)}-${addZero(day)}`;
            if(formattedDate in this.weatherConditions){
                weatherCondition = this.weatherConditions[formattedDate];
            }
            if(weatherCondition == ''){
                weatherCondition = 'Ukendt';
            }
            const weatherConditionIconMapper = {
                'Rain': 'wi wi-rain',
                'Snow': 'wi wi-snow',
                'Mostly Cloudy': 'wi wi-cloudy',
                'Overcast': 'wi wi-cloudy',
                'Clear': 'wi wi-day-sunny',
                'fog': 'wi wi-fog',
                'Partly Cloudy': 'wi wi-day-cloudy',
                'Scattered Clouds': 'wi wi-day-cloudy'
            };

            return {
                date: birthday,
                weatherCondition: weatherCondition,
                weatherIcon: weatherConditionIconMapper[weatherCondition],
                weatherLink: weatherLink
            }
        });

        this.setState(
            {
                tableData: dataForTable,
                formattedBirthdayDate: `${day}. ${month}`
            }
        );
        this.renderBirthdayResults();
    },
    render() {
        return (
            <div className="main-container">
                <header>
                    <div className="header__bg"></div>
                    <h1>
                        føsdagsvejret
                    </h1>
                </header>
                <div className="inputAndResultContainer">
                    <BirthdayInput handleResultClick={this.seeResults}/>
                    <div className="loader" style={this.state.showLoaderStyle}>
                        loading
                    </div>
                    <div id="birthday-result">
                    </div>
                </div>
            </div>
        )
    },
}, );


export default App;

render(
    <button className="start-button">
        Start!
    </button>
    , document.getElementById('start-button-container'));

document.getElementsByClassName('start-button')[0].addEventListener('click', function() {
    setTimeout(function() {
        render(<App/>, document.getElementById('app'));
        }, 200);
}, false);


