import React from 'react';
import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';
import LineGraph from './LineGraph';

function CircleMap({ country, casesType, casesTypeColors }) {
	return (
		<div>
			<Circle
				center={[ country.countryInfo.lat, country.countryInfo.long ]}
				color={casesTypeColors[casesType].hex}
				fillColor={casesTypeColors[casesType].hex}
				fillOpacity={0.4}
				radius={
					Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
				}
			>
				<Popup>
					<div className="info-container">
						<div className="info-name">
							<div>{country.country}</div>
							<div
								className="info-flag"
								style={{
									backgroundImage: `url(${country.countryInfo.flag})`,
									backgroundPosition: 'center'
								}}
							/>
						</div>
						<div className="info-confirmed">
							Cases: {numeral(country.cases).format('0,0')}
						</div>
						<div className="info-recovered">
							Recovered: {numeral(country.recovered).format('0,0')}
						</div>
						<div className="info-deaths">
							Deaths: {numeral(country.deaths).format('0,0')}
						</div>
						<div>
							<LineGraph country={country.country} />
						</div>
					</div>
				</Popup>
			</Circle>
		</div>
	);
}

export default CircleMap;
