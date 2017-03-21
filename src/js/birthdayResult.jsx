import React from 'react';
import { render } from 'react-dom';
import ResponsiveTable from './responsiveTable.jsx';

const BirthdayResult = React.createClass({

    getInitialState() {
        return {
            buttonDisabled: false,
            weatherDates: [],
        };
    },
    getSunshineDays() {
        return this.props.setDataForTable.filter((dateObject) => {
            return dateObject.weatherCondition === 'Solskin';
        }).length;
    },
    getWeatherConditionDays() {
        return this.props.setDataForTable.filter((dateObject) => {
            return dateObject.weatherCondition !== '';
        }).length;
    },
    calculateSunshinePercentage() {
        const goodBoyDays = this.props.setDataForTable.filter((dateObject) => {
            return dateObject.weatherCondition === 'Solskin';
        }).length;

        return parseFloat((goodBoyDays / this.getWeatherConditionDays()));
    },
    noMoreData() {
        if(this.props.setDataForTable.length > 20){
            return (
                <div className="no-more-data">
                    Der findes desværre kun data fra 1996 :(
                </div>
            );
        }
    },
    renderCircleDiagram() {

        setTimeout((function() {
        var data = {
            size: 230,
            sectors: [
                {
                    percentage: this.calculateSunshinePercentage(),
                    label: 'Thing 1',
                },
                {
                    percentage: 1 - this.calculateSunshinePercentage(),
                    label: "Thing Two",
                },
            ]
        }

        function calculateSectors( data ) {
            var sectors = [];
            var colors = [
                "#fde43a", "#383838",
            ];

            var l = data.size / 2
            var a = 0 // Angle
            var aRad = 0 // Angle in Rad
            var z = 0 // Size z
            var x = 0 // Side x
            var y = 0 // Side y
            var X = 0 // SVG X coordinate
            var Y = 0 // SVG Y coordinate
            var R = 0 // Rotation


            data.sectors.map( function(item, key ) {
                let a = 360 * item.percentage;
                let aCalc = ( a > 180 ) ? 360 - a : a;
                let aRad = aCalc * Math.PI / 180;
                let arcSweep;
                let z = Math.sqrt( 2*l*l - ( 2*l*l*Math.cos(aRad) ) );
                if( aCalc <= 90 ) {
                    x = l*Math.sin(aRad);
                }
                else {
                    x = l*Math.sin((180 - aCalc) * Math.PI/180 );
                }
                
                y = Math.sqrt( z*z - x*x );
                Y = y;


                if (a <= 180) {
                    X = l + x;
                    arcSweep = 0;
                } else {
                    X = l - x;
                    arcSweep = 1;
                }

                sectors.push({
                    percentage: item.percentage,
                    label: item.label,
                    color: colors[key],
                    arcSweep: arcSweep,
                    L: l,
                    X: X,
                    Y: Y,
                    R: R
                });

                R = R + a;
            });


            return sectors;
        }



        let sectors = calculateSectors(data);
        var newSVG = document.createElementNS( "http://www.w3.org/2000/svg","svg" );
        newSVG.setAttributeNS(null, 'viewBox', '0 0 230 230');
        newSVG.setAttributeNS(null, 'width', '100%');
        document.getElementsByClassName("circle-diagram__svg-element")[0].appendChild(newSVG)


        sectors.map( function(sector) {

            var newSector = document.createElementNS( "http://www.w3.org/2000/svg","path" );
            newSector.setAttributeNS(null, 'fill', sector.color);
            newSector.setAttributeNS(null, 'd', 'M' + sector.L + ',' + sector.L + ' L' + sector.L + ',0 A' + sector.L + ',' + sector.L + ' 0 ' + sector.arcSweep + ',1 ' + sector.X + ', ' + sector.Y + ' z');
            newSector.setAttributeNS(null, 'transform', 'rotate(' + sector.R + ', '+ sector.L+', '+ sector.L+')');

            newSVG.appendChild(newSector);
        })

        var midCircle = document.createElementNS( "http://www.w3.org/2000/svg","circle" );
        midCircle.setAttributeNS(null, 'cx', data.size * 0.5 );
        midCircle.setAttributeNS(null, 'cy', data.size * 0.5);
        midCircle.setAttributeNS(null, 'r', data.size * 0.28 );
        midCircle.setAttributeNS(null, 'fill', '#e8e8e8' );

        newSVG.appendChild(midCircle);


        
    }).bind(this), 100);




    },
    renderTwoArrows() {
        let daysString;
        if (this.getSunshineDays() === 1) {
            daysString = 'solskinsdag';
        } else {
            daysString = 'solskinsdage';
        }
        let rightArrowStyling;
        if (this.getSunshineDays() == 1) {
            rightArrowStyling = {
                top: '-30px',
                right: '44px',
            };
        } else if (this.getSunshineDays() == 2) {
            rightArrowStyling = {
                top: '-30px',
                right: '24px',
            };
        }
        else if (this.getSunshineDays() == 3) {
            rightArrowStyling = {
                top: '-30px',
                right: '10px',
            };
        }
        if (this.getSunshineDays() === 0) {
            return (
                <div className="left-arrow">
                    <div className="left-arrow__text">
                        {this.getWeatherConditionDays() - this.getSunshineDays()} ikke <br /> {daysString}
                    </div>
                    <div className="left-arrow__svg"></div>
                </div>
            )
        }else{
            return (
                <div>
                    <div className="left-arrow">
                        <div className="left-arrow__text">
                            {this.getWeatherConditionDays() - this.getSunshineDays()} ikke <br /> solskinsdage
                        </div>
                        <div className="left-arrow__svg"></div>
                    </div>
                    <div className="right-arrow">
                        <div className="right-arrow__text" style={rightArrowStyling}>
                            {this.getSunshineDays()} {daysString} :)
                        </div>
                        <div className="right-arrow__svg"></div>
                    </div>
                </div>
            )
        }
    },
    render() {
        let daysString;
        if (this.getSunshineDays() === 1) {
            daysString = 'solskinsdag';
        } else {
            daysString = 'solskinsdage';
        }
        return (
            <div>
                <div className="sunshine-days">
                    <div className="sunshine-days__numbers">{this.getSunshineDays()}</div>
                    <div className="sunshine-days__text">{daysString} på <b>din</b><br/><b>fødselsdag</b> siden 1996</div>
                </div>
                
                <br/>
                

                <div className="circle-diagram">
                    <div className="circle-diagram__arrows">
                        {this.renderTwoArrows()}
                    </div>

                    <div className="circle-diagram__svg-element">
                        {this.renderCircleDiagram()}
                    </div>

                    
                </div>
                
                <br/>
                <br/>
                <div className="table-container">
                    <div className="table-container__your-weather">
                        Sådan har vejret været d. {`${this.props.formattedbirthdayDate}`}
                    </div>
                    <ResponsiveTable rows={this.props.setDataForTable.reverse()}/>
                    {this.noMoreData()}
                </div>
            </div>
        )
    }
});


export default BirthdayResult;




