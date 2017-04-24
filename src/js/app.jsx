import React from 'react';
import { render } from 'react-dom';

import BirthdayInput from './birthdayInput.jsx';
import '../styles/index.scss';
import '../styles/weather-fonts/css/weather-icons.min.css';
import moveToImport from 'moveTo';
const moveTo = new moveToImport();

window.moveTo = moveTo;

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
        let dayinputValue = dayInput.value;
        if(dayinputValue[0] == '0'){
            dayinputValue = dayinputValue[1];
        }
        if(parseInt(yearInput.value) >= parseInt(1900)) {
            this.selectedCity = selectedCity;
            render(<div></div>, document.getElementById('birthday-result'));
            
            this.setState({
                showLoaderStyle: {
                    display: 'block'
                }
            });

            //http://95.85.11.203/most_typical_weather_conditions_copenhagen.json
            /*
            require(["./most_typical_weather_conditions_copenhagen.json"], (function(weatherConditions) {
                this.weatherConditions = weatherConditions;
                this.createDataForTable(dayInput.value, monthInput.selectedIndex, yearInput.value, monthInput.options[monthInput.selectedIndex].value);
            }).bind(this));
            */

            var xmlhttp;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = (function() {
                if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                   if(xmlhttp.status == 200){
                        this.weatherConditions = JSON.parse(xmlhttp.responseText);
                        console.log(this.weatherConditions);
                        this.createDataForTable(dayinputValue, monthInput.selectedIndex, yearInput.value, monthInput.options[monthInput.selectedIndex].value);
                   }
                   else if(xmlhttp.status == 400) {
                      //alert('There was an error 400')
                   }
                   else {
                       //alert('something else other than 200 was returned')
                   }
                }
            }).bind(this);
            xmlhttp.open("GET", `https://raw.githubusercontent.com/benna100/birthday-weather/gh-pages/src/js/most_typical_weather_conditions_${selectedCity}.json`, true);
            xmlhttp.send();
        } else {
            alert('Årstallet skal skrives som fx: 1996');
        }
        

    },

    renderBirthdayResults(){

        /* async loading of components */
        require.ensure([], require => {
            moveTo.move(document.getElementById('birthday-result'));
            //window.EPPZScrollTo.scrollVerticalToElementById('birthday-result', 0);
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
        const birthdaysEachYear = [];
        let start = new Date(year, monthIndex - 1, day);
        const end = new Date();
        let newDate;
        while (start < end) {
            birthdaysEachYear.push(start);
            newDate = new Date(start.getFullYear() + 1, monthIndex - 1, day);
            start = new Date(newDate);
        }


        // weatherConditions
        // 1997-07-18
        function addZero(number) {
            if(number < 10) {
                return `0${number}`;
            }
            return number;
        }

        const dataForTable = birthdaysEachYear.map((birthday) => {

            let weatherCondition;
            let weatherLink;
            if (this.selectedCity === 'copenhagen') {
                weatherLink = `https://www.wunderground.com/history/airport/EKCH/${birthday.getFullYear()}/${addZero(monthIndex)}/${addZero(day)}/DailyHistory.html?req_city=Copenhagen&req_statename=Denmark`; 
            } else if (this.selectedCity === 'aarhus') {
                weatherLink = `https://www.wunderground.com/history/airport/EKAH/${birthday.getFullYear()}/${addZero(monthIndex)}/${addZero(day)}/DailyHistory.html?req_city=Arhus&req_statename=Denmark`;
            } else if (this.selectedCity === 'aalborg') {
                weatherLink = `https://www.wunderground.com/history/airport/EKYT/${birthday.getFullYear()}/${addZero(monthIndex)}/${addZero(day)}/DailyHistory.html?req_city=Aalborg&req_statename=Denmark`;
            } else if (this.selectedCity === 'odense') {
                weatherLink = `https://www.wunderground.com/history/airport/EKOD/${birthday.getFullYear()}/${addZero(monthIndex)}/${addZero(day)}/DailyHistory.html?req_city=Odense&req_statename=Denmark`;
            }
            
            
            
            const formattedDate = `${birthday.getFullYear()}-${addZero(monthIndex)}-${addZero(day)}`;
            if(formattedDate in this.weatherConditions){
                weatherCondition = this.weatherConditions[formattedDate];
            }
            
            // a little messy data
            if(typeof weatherCondition === 'undefined'){
                weatherCondition = 'Ukendt';
            }

            if(weatherCondition === ''){
                weatherCondition = 'Ukendt';
            }
            
            const weatherConditionIconMapper = {
                false: '',
                true: 'wi wi-day-sunny',
            };

            const weatherConditionTranslatorBoolean = {
                true: 'Solskin',
                false: 'Ikke solskin',
            };


            return {
                date: birthday,
                weatherCondition: weatherConditionTranslatorBoolean[weatherCondition],
                weatherIcon: weatherConditionIconMapper[weatherCondition],
                weatherLink: weatherLink
            };
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
    
    setTimeout(function() {
        /*
        bodyElement.style.overflow = 'auto';
        bodyElement.style.overflowX = 'hidden';
        */
        moveTo.move(document.getElementById('main-container'));
        //window.EPPZScrollTo.scrollVerticalToElementById('main-container', 0);

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