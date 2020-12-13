import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './InfoBox.css';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},

	Card: {
		backgroundColor: '#010b44',
		color: 'white'
	},

	Typography: {
		color: 'lightgray'
	}
}));

function InfoBox({ title, newCases, active, theme, isRed, total, ...props }) {
	const classes = useStyles();

	return (
		<Card
			onClick={props.onClick}
			className={`infoBox ${active && 'infoBox--selected'} ${isRed &&
				active &&
				'infoBox--red'} ${theme === 'dark' && 'dark-theme' && classes.Card}`}
		>
			<CardContent>
				<Typography
					className={`infoBox__title ${theme === 'dark' && classes.Card}`}
				>
					{title}
				</Typography>
				<h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>
					<div>{newCases}</div>{' '}
					<div
						className={`infoBox__today ${!isRed && 'infoBox__cases--green'}`}
					>
						Today
					</div>
				</h2>
				<Typography
					className={`infoBox__total ${theme === 'dark' && 'dark-theme'}`}
					color="textSecondary"
				>
					{total}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
