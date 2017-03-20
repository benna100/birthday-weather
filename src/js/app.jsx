import React from 'react';
import { render } from 'react-dom';

import BirthdayInput from './birthdayInput.jsx';
import '../styles/index.scss';
import '../styles/weather-fonts/css/weather-icons.min.css';
/*
import BirthdayResult from './birthdayResult.jsx';
*/

/*
function isTouchDevice() {
    return 'ontouchstart' in window        // works on most browsers
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
}


if (isTouchDevice()) {
    document.getElementsByTagName('body')[0].classList.add('touch');
}
*/

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
            let weatherCondition;
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
            <div className="main-container" id="main-container">
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
        Lad os begynde!
    </button>
    ,document.getElementsByClassName('start-button-container__button')[0]
);


const bodyElement = document.getElementsByTagName('body')[0];
document.getElementsByClassName('start-button')[0].addEventListener('click', function() {
    document.getElementsByClassName('start-button')[0].classList.add('button--active');
    setTimeout((function() {
        document.getElementsByClassName('start-button')[0].classList.remove('button--active');
    }).bind(this), 70);


    render(<App/>, document.getElementsByClassName('app-container')[0]);
    window.EPPZScrollTo.scrollVerticalToElementById('main-container', 0);
    setTimeout(function() {
        bodyElement.style.overflow = 'auto';
        bodyElement.style.overflowX = 'hidden';
        }, 100);

}, false);



window.EPPZScrollTo = {
    /**
     * Helpers.
     */
    documentVerticalScrollPosition: function() {
        if (self.pageYOffset) return self.pageYOffset; // Firefox, Chrome, Opera, Safari.
        if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop; // Internet Explorer 6 (standards mode).
        if (document.body.scrollTop) return document.body.scrollTop; // Internet Explorer 6, 7 and 8.
        return 0; // None of the above.
    },

    viewportHeight: function() {
        return (document.compatMode === "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight;
    },

    documentHeight: function() {
        return (document.height !== undefined) ? document.height : document.body.offsetHeight;
    },

    documentMaximumScrollPosition: function() {
        console.log(this.documentHeight());
        console.log(this.viewportHeight());
        return this.viewportHeight() - this.documentHeight();
    },

    elementVerticalClientPositionById: function(id) {
        var element = document.getElementById(id);
        var rectangle = element.getBoundingClientRect();
        return rectangle.top;
    },

    /**
     * Animation tick.
     */
    scrollVerticalTickToPosition: function(currentPosition, targetPosition) {

        var filter = 0.1;
        var fps = 60;
        var difference = parseFloat(targetPosition) - parseFloat(currentPosition);

        // Snap, then stop if arrived.
        var arrived = (Math.abs(difference) <= 0.5);
        if (arrived) {
            // Apply target.
            scrollTo(0.0, targetPosition);
            return;
        }

        // Filtered position.
        currentPosition = (parseFloat(currentPosition) * (1.0 - filter)) + (parseFloat(targetPosition) * filter);

        // Apply target.
        scrollTo(0.0, Math.round(currentPosition));

        // Schedule next tick.
        setTimeout("EPPZScrollTo.scrollVerticalTickToPosition(" + currentPosition + ", " + targetPosition + ")", (1000 / fps));
    },

    /**
     * For public use.
     *
     * @param id The id of the element to scroll to.
     * @param padding Top padding to apply above element.
     */
    scrollVerticalToElementById: function(id, padding) {
        var element = document.getElementById(id);
        if (element == null) {
            console.warn('Cannot find element with id \'' + id + '\'.');
            return;
        }

        var targetPosition = this.documentVerticalScrollPosition() + this.elementVerticalClientPositionById(id) - padding;
        //console.log(targetPosition);
        var currentPosition = this.documentVerticalScrollPosition();
        //console.log(currentPosition);
        // Clamp.
        /*
        var maximumScrollPosition = this.documentMaximumScrollPosition();
        if (targetPosition > maximumScrollPosition) {
            console.log(8);
            targetPosition = maximumScrollPosition;
        }
        */
        // Start animation.
        this.scrollVerticalTickToPosition(currentPosition, targetPosition);
    }
};