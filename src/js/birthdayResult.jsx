import React from 'react';
import {render} from 'react-dom';
import ResponsiveTable from './responsiveTable.jsx';

const BirthdayResult = React.createClass({

	getInitialState(){
		return {
			buttonDisabled: false,
			weatherDates: []
		};
	},
	calculateSunshinePercentage(){

		this.sunshineDays = this.props.setDataForTable.filter((dateObject) => {
			return dateObject.weatherCondition == 'Clear';
		}).length;

		this.weatherConditionDays = this.props.setDataForTable.filter((dateObject) => {
			return dateObject.weatherCondition != '';
		}).length;

		const goodBoyDays = this.props.setDataForTable.filter((dateObject) => {
			return dateObject.weatherCondition == 'Clear';
		}).length;

		return parseInt(goodBoyDays/this.weatherConditionDays * 100);
	},
	noMoreData(){
		if(this.props.setDataForTable.length > 20){
			return (
				<div className="no-more-data">
					Der findes desværre kun data fra 1996 :(
				</div>
			);
		}
	},
	render(){
		return (
			<div>
				<span>
					Du er {this.calculateSunshinePercentage()}% god
				</span>
				<br />
				<span>
					Der har været sol på {this.sunshineDays}/{this.weatherConditionDays} dage af dit liv.
				</span>
				<br />
				<span>
					{`${this.props.formattedbirthdayDate}`}
				</span>
				<ResponsiveTable rows={this.props.setDataForTable.reverse()}/>
				{this.noMoreData()}
			</div>
		)
	}
});


export default BirthdayResult;




