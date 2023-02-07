import { createContext, ReactNode, useContext, useState } from "react";

export type TermUnit = "Day" | "Month" | "Year";
export type Record = {
	id: string | number;
	debtor: string;
	principalAmount: number;
	startDate: number;
	endDate?: number;
	interestRate: {
		rate: number;
		amount: number;
		term: number;
		termUnit: TermUnit;
	};
};
type RecordContextProp = {
	records: Record[];
	addRecord: (newRecord: Record) => void;
};
const initialState = [
	{
		id: 1,
		debtor: "abc",
		principalAmount: 100000,
		startDate: 1620153000000,
		interestRate: {
			rate: 1.5,
			amount: 100,
			term: 1,
			termUnit: "Month" as TermUnit,
		},
	},
	{
		id: 2,
		debtor: "def",
		principalAmount: 200000,
		startDate: 1654972200000,
		interestRate: {
			rate: 1,
			amount: 100,
			term: 1,
			termUnit: "Month" as TermUnit,
		},
	},
	{
		id: 3,
		debtor: "ghi",
		principalAmount: 100000,
		startDate: 1623522600000,
		interestRate: {
			rate: 1.5,
			amount: 100,
			term: 1,
			termUnit: "Month" as TermUnit,
		},
	},
	{
		id: 4,
		debtor: "jkl",
		principalAmount: 50000,
		startDate: 1654972200000,
		interestRate: {
			rate: 2,
			amount: 100,
			term: 1,
			termUnit: "Month" as TermUnit,
		},
	},
	{
		id: 5,
		debtor: "mno",
		principalAmount: 600000,
		startDate: 1626028200000,
		interestRate: {
			rate: 1,
			amount: 100,
			term: 1,
			termUnit: "Month" as TermUnit,
		},
	},
	{
		id: 6,
		debtor: "pqr",
		principalAmount: 100000,
		startDate: 1612549800000,
		interestRate: {
			rate: 1.5,
			amount: 100,
			term: 1,
			termUnit: "Month" as TermUnit,
		},
	},
];
const initialContext = {
	records: initialState,
	addRecord: (newRecord: Record) => undefined
};
const RecordsContext = createContext<RecordContextProp>(initialContext);
export const useRecordData = () => useContext(RecordsContext);
type Prop = {
	children: ReactNode;
};
export const RecordsProvider = ({ children }: Prop) => {
	const [records, setRecords] = useState<Record[]>(initialState);
	const value = {
		records,
		addRecord: (newRecord: Record) => {
			setRecords( prev => [...prev, newRecord]);
		}
	};
	return (
		<RecordsContext.Provider value={value}>
			{children}
		</RecordsContext.Provider>
	);
};
