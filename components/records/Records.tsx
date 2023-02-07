import { DataGrid, GridValueGetterParams } from "@mui/x-data-grid";
import moment from "moment";
import { Record, TermUnit, useRecordData } from "../../store/records-context";

// AJ - TODO - in utils
const getDiffValByTermUnit = (termUnit: TermUnit) => {
	switch (termUnit) {
		case "Day":
			return 1000 * 60 * 60 * 24;
		case "Month":
			return 1000 * 60 * 60 * 24 * 30;
		case "Year":
			return 1000 * 60 * 60 * 24 * 30 * 12;
		default:
			return 1;
	}
};
const setEndTime = (date: Date) => {
	date.setHours(23, 59, 59);
	return date;
};
const calculateDiffPeriod = (
	startDate: Record["startDate"],
	endDate: Record["endDate"],
	termUnit: Record["interestRate"]["termUnit"]
) => {
	// for now only in month
	const [sD, sM, sY] = new Date(startDate)
		.toLocaleDateString("in")
		.split("/")
		.map((v) => parseInt(v));
	const [eD, eM, eY] = new Date(endDate ?? new Date().getTime())
		.toLocaleDateString("in")
		.split("/")
		.map((v) => parseInt(v));

	let monthsDiff = (eY - sY) * 12;
	monthsDiff += eM - sM;
	let daysDiff = eD - sD;
	if (daysDiff < 0) {
		monthsDiff -= 1;
		daysDiff = 30 - Math.abs(daysDiff);
	}
	return [monthsDiff, daysDiff];
};
const getPeriodDiffString = (
	startDate: Record["startDate"],
	endDate: Record["endDate"],
	termUnit: Record["interestRate"]["termUnit"]
) => {
	const [monthsDiff, daysDiff] = calculateDiffPeriod(startDate, endDate, termUnit);
	return monthsDiff > 0 ? `${monthsDiff}M : ${daysDiff}D` : `${daysDiff}D`;
};
const calculateInterest = (record: Record) => {
	const { principalAmount, interestRate, startDate, endDate } = record;
	const [monthsDiff, daysDiff] = calculateDiffPeriod(startDate, endDate, interestRate.termUnit);
	const interestPerMonth = ( principalAmount * interestRate.rate ) / interestRate.amount;
	const interestPerDay = interestPerMonth / 30;
	return Math.ceil( ( interestPerMonth * monthsDiff ) + ( interestPerDay * daysDiff ) );
};
const columns = [
	{
		field: "debtor",
		headerName: "Deptor",
		flex: 1,
	},
	{
		field: "principalAmount",
		headerName: "Principal Amount",
		width: 130,
	},
	{
		field: "startDate",
		headerName: "Start Date",
		width: 150,
		valueGetter: (params: GridValueGetterParams) =>
			new Date(params.row.startDate).toDateString(),
	},
	{
		field: "endDate",
		headerName: "End Date",
		width: 150,
		valueGetter: (params: GridValueGetterParams) =>
			params.row.endDate
				? setEndTime(new Date(params.row.endDate)).toDateString()
				: setEndTime(new Date()).toDateString(),
	},
	{
		field: "period",
		headerName: "Period",
		width: 150,
		valueGetter: (params: GridValueGetterParams) =>
			getPeriodDiffString(
				params.row.startDate,
				params.row.endDate,
				params.row.interestRate.termUnit
			),
	},
	{
		field: "interestRate",
		headerName: "Interest Rate",
		width: 180,
		valueGetter: (params: GridValueGetterParams) =>
			`${params.row.interestRate.rate} per ${params.row.interestRate.amount} for ${params.row.interestRate.term} ${params.row.interestRate.termUnit}`,
	},
	{
		field: "interest",
		headerName: "Interest",
		width: 130,
		valueGetter: (params: GridValueGetterParams) =>
			`${calculateInterest(params.row)}`,
	},
	{
		field: "total",
		headerName: "Total",
		width: 130,
		valueGetter: (params: GridValueGetterParams) =>
			calculateInterest(params.row) + params.row.principalAmount,
	},
];
export const Records = () => {
	const { records } = useRecordData();
	return (
		<DataGrid
			rows={records}
			columns={columns}
			autoHeight
			disableSelectionOnClick
		/>
	);
};
