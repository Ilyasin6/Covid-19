import React, { useEffect, useState } from 'react';
import './App.css';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData, prettyPrintStat } from './components/util';
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},

	select: {
		color: 'lightgray'
	},

	Card: {
		backgroundColor: '#010b44',
		color: 'white'
	},
	switchLight: {
		color: 'lightgray'
	},

	switchDark: {
		color: '#797979'
	}
}));

function App() {
	const classes = useStyles();

	const [ countries, setCountries ] = useState([]);
	const [ selectedCountry, setSelectedCountry ] = useState('Worldwide');
	const [ countryInfo, setcountryInfo ] = useState({});
	const [ tableData, setTableData ] = useState([]);
	const [ mapCenter, setMapCenter ] = useState({ lat: 34.80746, lng: -1.4796 });
	const [ mapZoom, setMapZoom ] = useState(2);
	const [ mapCountries, setMapCountries ] = useState([]);
	const [ casesType, setCasesType ] = useState('cases');
	const [ theme, setTheme ] = useState('dark');

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
				setMapCenter({ lat: 34.80746, lng: -1.4796 });
				setMapZoom(2);
			} else {
				setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long });
				//console.log(mapCenter);
				setMapZoom(4);
			}
		});
	};

	const onChangeTheme = () => {
		if (theme === 'dark') {
			setTheme('light');
			document.querySelector('body').style.backgroundColor = '#f5f6fa';
		} else {
			setTheme('dark');
			document.querySelector('body').style.backgroundColor = '#010b44e0';
		}
	};

	return (
		<div className={`app ${theme === 'dark' && 'dark-theme'}`}>
			<div className="app__left">
				<div className="app__header">
					<div className="app__header__logo">
						<div
							className={`${(theme !== 'dark' && 'app__header-img') ||
								(theme === 'dark' && 'app__header-imgDark')}`}
						/>
					</div>

					<div style={{ display: 'flex' }}>
						<IconButton
							aria-label="Light Theme"
							onClick={onChangeTheme}
							className="app__header__switch"
						>
							{
								theme === 'dark' ? <Brightness7Icon
									className={classes.switchLight}
								/> :
								<Brightness4Icon className={classes.switchDark} />}
						</IconButton>

						<FormControl className={classes.formControl}>
							<Select
								value={selectedCountry}
								onChange={onCountryChange}
								className={theme === 'dark' && classes.select}
							>
								<MenuItem value="Worldwide" key={0}>
									{' '}
									Worldwide{' '}
								</MenuItem>
								{countries.map((country, i) => {
									return (
										<MenuItem value={country.value} key={i + 1}>
											{' '}
											{country.name}{' '}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</div>
				</div>
				<div className="app__stats">
					<InfoBox
						theme={theme}
						isRed={true}
						onClick={(e) => {
							setCasesType('cases');
						}}
						active={casesType === 'cases'}
						title="Cases"
						newCases={'+' + prettyPrintStat(countryInfo.todayCases)}
						total={prettyPrintStat(countryInfo.cases) + ' Total'}
					/>
					<InfoBox
						theme={theme}
						isRed={false}
						onClick={(e) => {
							setCasesType('recovered');
						}}
						active={casesType === 'recovered'}
						title="Recovered"
						newCases={'+' + prettyPrintStat(countryInfo.todayRecovered)}
						total={prettyPrintStat(countryInfo.recovered) + ' Total'}
					/>
					<InfoBox
						theme={theme}
						isRed={true}
						onClick={(e) => {
							setCasesType('deaths');
						}}
						active={casesType === 'deaths'}
						title="Deaths"
						newCases={'+' + prettyPrintStat(countryInfo.todayDeaths)}
						total={prettyPrintStat(countryInfo.deaths) + ' Total'}
					/>
				</div>
				<Map
					theme={theme}
					center={mapCenter}
					zoom={mapZoom}
					countries={mapCountries}
					casesType={casesType}
				/>
			</div>
			<Card className={`app__right ${theme === 'dark' && classes.Card}`}>
				<CardContent>
					<h3> Total Cases By Country </h3>
					<Table countries={tableData} theme={theme} />
					<LineGraph theme={theme} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
