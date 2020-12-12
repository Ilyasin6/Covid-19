import React, { useEffect, useState } from 'react';
import './App.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData } from './components/util';
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	}
}));

function App() {
	const classes = useStyles();

	const [ countries, setCountries ] = useState([]);
	const [ selectedCountry, setSelectedCountry ] = useState('Worldwide');
	const [ countryInfo, setcountryInfo ] = useState({});
	const [ tableData, setTableData ] = useState([]);
	const [ mapCenter, setMapCenter ] = useState({ lat: 34.80746, lng: -40.4796 });
	const [ mapZoom, setMapZoom ] = useState(2);
	const [ mapCountries, setMapCountries ] = useState([]);

	// useEffect(() => {
	// 	fetch('https://disease.sh/v3/covid-19/all')
	// 		.then((response) => {
	// 			console.log(response);
	// 			response.json();
	// 		})
	// 		.then((data) => {
	// 			console.log(data);
	// 			setcountryInfo(data);
	// 		});
	// }, []);

	useEffect(() => {
		const getCountries = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries')
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => {
						return {
							name: country.country,
							value: country.countryInfo.iso2
						};
					});

					const sortedData = sortData(data);
					setCountries(countries);
					setMapCountries(data);
					setTableData(sortedData);
				});
		};

		const getWorldInfo = async () => {
			await fetch('https://disease.sh/v3/covid-19/all')
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					//console.log(data);
					setcountryInfo(data);
				});
		};

		getCountries();
		getWorldInfo();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		const url =

				countryCode === 'Worldwide' ? 'https://disease.sh/v3/covid-19/all' :
				`https://disease.sh/v3/covid-19/countries/${countryCode}`;
		// https://disease.sh/v3/covid-19/all
		// https://disease.sh/v3/covid-19/countries/{country}

		await fetch(url).then((response) => response.json()).then((data) => {
			setSelectedCountry(countryCode);
			setcountryInfo(data);
			if (countryCode === 'Worldwide') {
				setMapCenter({ lat: 34.80746, lng: -40.4796 });
				setMapZoom(2);
			} else {
				setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long });
				//console.log(mapCenter);
				setMapZoom(4);
			}
		});
	};

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1> Covid 19 Tracker </h1>
					<FormControl className={classes.formControl}>
						<Select value={selectedCountry} onChange={onCountryChange}>
							<MenuItem value="Worldwide"> Worldwide </MenuItem>
							{countries.map((country) => {
								return (
									<MenuItem value={country.value}>
										{' '}
										{country.name}{' '}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
				<div className="app__stats">
					<InfoBox
						title="Coronavirus Cases"
						newCases={countryInfo.todayCases}
						total={countryInfo.cases}
					/>
					<InfoBox
						title="Recovered"
						newCases={countryInfo.todayRecovered}
						total={countryInfo.recovered}
					/>
					<InfoBox
						title="Deaths"
						newCases={countryInfo.todayDeaths}
						total={countryInfo.deaths}
					/>
				</div>
				<Map center={mapCenter} zoom={mapZoom} countries={mapCountries} />
			</div>
			<Card className="app__right">
				<CardContent>
					<h3> Total Cases By Country </h3>
					<Table countries={tableData} />

					<LineGraph />
				</CardContent>
			</Card>
			{/* 
			      <InfoBox></InfoBox>
			      <InfoBox></InfoBox>
			      <InfoBox></InfoBox>
			      <Table></Table>
			      <Graph></Graph>
			      <Map></Map> */}
		</div>
	);
}

export default App;
