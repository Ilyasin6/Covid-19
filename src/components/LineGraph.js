import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import './LineGraph.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	select: {
		color: 'white'
	}
}));

const options = {
	legend: {
		display: false
	},
	elements: {
		point: {
			radius: 0
		}
	},
	maintainAspectRatio: false,
	tooltips: {
		mode: 'index',
		intersect: false,
		callbacks: {
			label: function(tooltipItem, data) {
				return numeral(tooltipItem.value).format('+0,0');
			}
		}
	},
	scales: {
		xAxes: [
			{
				type: 'time',
				time: {
					format: 'MM/DD/YY',
					tooltipFormat: 'll'
				},
				ticks: { fontColor: 'gray' }
			}
		],
		yAxes: [
			{
				gridLines: {
					display: false
				},
				ticks: {
					callback: function(value, index, values) {
						return numeral(value).format('0a');
					},
					fontColor: 'gray'
				}
			}
		]
	}
};

function LineGraph({ country = 'Worldwide', theme }) {
	const [ data, setData ] = useState([]);
	const [ type, setType ] = useState('cases');

	const generateChartData = (data_, type = 'cases') => {
		const chartData = [];
		const lastDateNumbers = {};
		for (const date in data_[type]) {
			const newPoint = {};
			if (Object.keys(lastDateNumbers).length) {
				newPoint.x = date;
				newPoint.y = data_[type][date] - lastDateNumbers[type];
			}
			chartData.push(newPoint);
			lastDateNumbers[type] = data_[type][date];
		}

		return chartData;
	};

	useEffect(
		() => {
			const fetchData = async () => {
				const url =

						country ===
						'Worldwide' ? 'https://disease.sh/v3/covid-19/historical/all?lastdays=200' :
						`https://disease.sh/v3/covid-19/historical/${country}?lastdays=200
				`;

				await fetch(url)
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						//console.log(data);

						const chartData =

								country === 'Worldwide' ? generateChartData(data, type) :
								generateChartData(data.timeline, type);
						setData(chartData);
					});
			};

			fetchData();
		},
		[ type ]
	);

	const onTypeChange = (event) => {
		setType(event.target.value);
	};

	const classes = useStyles();

	return (
		<div className="LineGraph">
			<div className="LineGraph__title">
				<h3> {country} New </h3>
				<FormControl className={classes.formControl}>
					<Select
						value={type}
						onChange={onTypeChange}
						className={theme === 'dark' && classes.select}
					>
						<MenuItem value="cases"> Cases </MenuItem>
						<MenuItem value="deaths"> Deaths </MenuItem>
						<MenuItem value="recovered"> Recovered </MenuItem>
					</Select>
				</FormControl>
			</div>

			<div className="LineGraph__line">
				<Line
					options={options}
					data={{
						datasets: [
							{
								backgroundColor: 'rgba(204, 16, 52 , 0.4)',
								borderColor: '#CC1034',
								data: data
							}
						]
					}}
				/>
			</div>
		</div>
	);
}

export default LineGraph;

// 2:58:20
