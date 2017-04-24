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
        let birthdayString;
        if (this.getSunshineDays() === 1) {
            birthdayString = 'solskinsdag';
        } else {
            birthdayString = 'solskinsdage';
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
                        {this.getWeatherConditionDays() - this.getSunshineDays()} ikke <br /> {birthdayString} :(
                    </div>
                    <div className="left-arrow__svg"></div>
                    <div className="bottom-text">
                        {Math.round((Math.round(this.calculateSunshinePercentage() * 100) / 100) * 100)}% solskinsdage
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <div className="left-arrow">
                        <div className="left-arrow__text">
                            {this.getWeatherConditionDays() - this.getSunshineDays()} ikke <br /> solskinsdage  :(
                        </div>
                        <div className="left-arrow__svg"></div>
                    </div>
                    <div className="right-arrow">
                        <div className="right-arrow__text" style={rightArrowStyling}>
                            {this.getSunshineDays()} {birthdayString} :)
                        </div>
                        <div className="right-arrow__svg"></div>
                    </div>
                    <div className="bottom-text-number">
                        {Math.round((Math.round(this.calculateSunshinePercentage() * 100) / 100) * 100)}%
                    </div>
                    <div className="bottom-text">
                        solskinsdage
                    </div>
                </div>
            )
        }
    },
    renderRestOfResults(){
        if(this.getSunshineDays() !== 0){
            return(
                <div>
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
                            Se alle dine fødselsdage
                        </div>
                        <ResponsiveTable rows={this.props.setDataForTable.reverse()}/>
                        {this.noMoreData()}
                    </div>
                </div>
            )
        }else{
            return(
                <div className="table-container">
                    <div className="table-container__your-weather">
                        av av av...
                    </div>
                </div>
            )
        }  
    },
    render() {
        let birthdayString;
        let dayString;

        if (this.getSunshineDays() === 1) {
            birthdayString = 'fødselsdag';
            dayString = 'dag';
        } else {
            birthdayString = 'fødselsdage';
            dayString = 'dage';
        }
        //({Math.round((Math.round(this.calculateSunshinePercentage() * 100) / 100) * 100)}% solskinsdage)
        return (
            <div>
                <hr/>
                <div className="sunshine-days">
                    <div className="sunshine-days__numbers">{this.getSunshineDays()}</div>
                    <div className="sunshine-days__text"><b>{birthdayString} med solskin</b><br/> <b></b> siden 1996. <a target="_blank" href={`https://www.facebook.com/dialog/feed?app_id=270494306352103&display=popup&caption=Se hvor mange fødselsdage med solskin du har haft!&link=https://benna100.github.io/birthday-weather/dist/&description=Du har haft ${this.getSunshineDays()} ${dayString} med solskin&redirect_uri=https://benna100.github.io/birthday-weather/dist/`}>Del på Facebook</a></div>
                </div>
                <br/>
                
                {this.renderRestOfResults()}

                <div className="">

                </div>
                <hr className="last-divider"/>
                
                <br/>
                <div className="cool-project">
                    <p>
                        Hvis du har en ide til et fedt/skørt/sjovt/kreativt<br/> projekt så skriv til mig: <br/> <span className="leftRight first">👉</span><span className="upDown first">👇</span>  <a href="mailto:benjamin.dals.hughes@gmail.com" target="_top">benjamin.dals.hughes@gmail.com</a>  <span className="leftRight">👈</span><span className="upDown">👆</span>
                    </p>
                </div>

                <h1 className="explanation-title">
                    Og nu til det nørdede
                </h1>
                <p className="explanation-description">
                    <br/>
                    Denne app er et hyggeprojekt, der kom til over en frokost. Den dag skinnede solen og en af mine kollegaers venner havde fødselsdag. Så måtte han jo have haft et godt år, haha. Men hvor mange fødselsdage med solskin havde jeg egentlig haft? Det kunne da være fedt at få at vide. For kunne det virkelig passe, at man ingen steder kunne se hvor mange dage, solen havde skinnet på ens fødselsdag!? Det måtte der gøres noget ved!
                    <br/>
                    <br/>
                    Vejrdata kommer fra <a href="https://www.wunderground.com/" target="_blank">https://www.wunderground.com/</a>. For at finde antal af solskinsdage, ser jeg om det på et tidspunkt har været klart mellem kl 6 om morgenen og 10 om aftenen. Hvis det har været klart, tæller jeg det som en solskinsdag. Det kunne være fedt at få den forbedret så den også tager hensyn til hvornår solen står op, den er på to-do listen :) 
                    <br/>
                    <br/>
                    Analysen bliver lavet med <b>Python</b>, der først henter de seneste vejrbeskrivelser ned vha biblioteket <b>BeautifulSoup</b>. Dernæst bliver vejrbeskrivelserne analyseret, for at finde dage med klart vejr. De Python scripts der henter og analyserer vejrdata ligger på en <b>Ubuntu server</b> på <b>Digital Ocean</b>, som via et <b>dagligt cron job</b> opdaterer vejrdata og dernæst lægger data i JSON format op på <b>Github</b>.
                    <br/>
                    <br/>
                    Selve webappen er bygget med <b>react</b>, <b>webpack</b>, <b>npm</b> og bruger <b>BEM CSS methodology</b>. Data bliver <b>asynkront hentet via javascript.</b> Til sidst er webappen krydret med lidt <b>hjemmelavet SVG</b>, <b>et par pege-emojis</b>, et <b>fantastisk flot cirkeldiagram</b> og nogle lækre <b>sky animationer</b> :)
                    <br/>
                    <br/>
                    Hvis du har brug for en person der kan gå fra ide til løsning, og som kan lave digitale prototyper og visualiseringer. Så tag fat i mig :)
                </p>

                <br/>
                <div className="cool-project">
                    <p>
                        Følg mig på <a target="_blank" href="https://twitter.com/DalsHughes">Twitter</a> eller <a target="_blank" href="https://www.linkedin.com/in/benjamindalshughes/">Linkedin</a>
                    </p>
                </div>
                {/*
                <div className="me">
                    <div className="gradient"></div>
                </div>
                */}

            </div>
        )
    }
});


export default BirthdayResult;




