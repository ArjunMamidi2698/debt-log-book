import {
	BaseTextFieldProps,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
} from "@mui/material";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect, useMemo, useState } from "react";
import { Record, TermUnit, useRecordData } from "../../store/records-context";
import { RecordFormInputLabel } from "../common/form/RecordFormInputLabel";
import { Spacer } from "../common/ui/Spacer";

const InputCaption = ({ caption }: { caption: string }) => (
	<Typography m={1} alignSelf={"center"} variant="caption">
		{caption}
	</Typography>
);

type ControlledInputProps<T> = {
	value: T;
	setValue: React.Dispatch<React.SetStateAction<T>>;
	required?: boolean;
	rule?: boolean;
	errorMessage?: string;
	placeholder?: string;
	type?: BaseTextFieldProps["type"];
};
const ControlledInput = ({
	value,
	setValue,
	required,
	rule = false,
	errorMessage,
	placeholder,
	type,
}: ControlledInputProps<any>) => {
	const handleChange = (newVal: string) => {
		let res: string | number = newVal;
		if (typeof value == "number") {
			res = parseInt(newVal) || 0;
		}
		setValue(res);
	};
	return (
		<TextField
			placeholder={placeholder}
			error={!rule}
			helperText={!rule ? errorMessage ?? "error" : " "}
			required={required}
			size="small"
			margin="dense"
			type={type}
			value={value}
			onChange={(e) => handleChange(e.target.value)}
		/>
	);
};

export const AddRecord = () => {
	// Dialog Actions
	const [open, setOpen] = useState(false);
	const openDialog = () => setOpen(true);
	const handleClose = () => {
		resetRecordForm();
		setOpen(false)
	};

	// Form inputs
	const [debtor, setDebtor] = useState<Record["debtor"]>("");
	const [principalAmount, setPrincipalAmount] =
		useState<Record["principalAmount"]>(0);
	const [rate, setRate] = useState<Record["interestRate"]["rate"]>(1);
	const [amount, setAmount] = useState<Record["interestRate"]["amount"]>(100);
	const [term, setTerm] = useState<Record["interestRate"]["term"]>(1);
	const [startValue, setStartValue] = useState<Record["startDate"]>(
		new Date().getTime()
	);
	const [endValue, setEndValue] = useState<Record["endDate"]>(
		new Date().getTime()
	);

	// Form Validation
	const validationRules = useMemo(() => {
		return {
			debtor: !!debtor,
			principalAmount: principalAmount > 0,
			rate: rate > 0,
			amount: amount > 0,
			term: term > 0,
			startDate: !!startValue,
		};
	}, [debtor, principalAmount, rate, amount, term, startValue]);
	const isValid = useMemo(() => {
		return Object.values(validationRules).filter((v) => !v).length == 0;
	}, [validationRules]);

	// Form Actions
	const { records, addRecord } = useRecordData();
	const handleSubmit = () => {
		addRecord({
			id: records.length + 1,
			debtor,
			principalAmount,
			startDate: startValue,
			endDate: endValue,
			interestRate: {
				rate,
				amount,
				term,
				termUnit: "Month" as TermUnit,
			},
		});
		handleClose();
	};
	const resetRecordForm = () => {
		setDebtor("");
		setPrincipalAmount(1);
		setRate(1);
		setAmount(100);
		setTerm(1);
		setStartValue(new Date().getTime());
		setEndValue(new Date().getTime());
	};
	useEffect(() => {
		resetRecordForm();
	}, []);

	return (
		<>
			<Button variant="contained" onClick={openDialog}>
				+ Add Record
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				sx={{
					".MuiPaper-root": { width: "500px" },
				}}
			>
				<DialogTitle>Add Record</DialogTitle>
				<DialogContent>
					<Box display={"flex"} flexDirection={"column"}>
						<RecordFormInputLabel
							label="Deptor"
							info="Who is responsible to pay the debt"
							isRequired
						/>
						<ControlledInput
							placeholder="Debtor..."
							value={debtor}
							setValue={setDebtor}
							required
							rule={validationRules.debtor}
							errorMessage="Debtor is Required"
						/>
						<RecordFormInputLabel
							label="Principal Amount"
							info="Amount Taken as debt"
							isRequired
						/>
						<ControlledInput
							value={principalAmount}
							setValue={setPrincipalAmount}
							required
							type="number"
							rule={validationRules.principalAmount}
							errorMessage="Principal Amount should be positive"
						/>
						<RecordFormInputLabel
							label="Interest Rate"
							isRequired
						/>
						<Box display={"flex"}>
							<ControlledInput
								value={rate}
								setValue={setRate}
								required
								type="number"
								rule={validationRules.rate}
								errorMessage="Rate should be positive"
							/>
							<InputCaption caption="per" />
							<TextField
								error={amount <= 0}
								required
								placeholder="Amount"
								type={"number"}
								size="small"
								margin="dense"
								value={amount}
								onChange={(e) =>
									setAmount(parseInt(e.target.value) || 0)
								}
							/>
							<InputCaption caption="for" />
							<TextField
								error={term <= 0}
								required
								placeholder="term"
								type={"number"}
								size="small"
								margin="dense"
								value={term}
								onChange={(e) =>
									setTerm(parseInt(e.target.value) || 0)
								}
							/>
							<InputCaption caption="month" />
						</Box>
						<LocalizationProvider dateAdapter={DateFnsUtils}>
							<Box display={"flex"}>
								<RecordFormInputLabel
									label="Start Date"
									isRequired
								/>
								<Spacer />
								<RecordFormInputLabel
									label="End Date"
									sx={{
										flexBasis: "45%",
									}}
								/>
							</Box>
							<Box display={"flex"}>
								<DatePicker
									disableFuture
									openTo="year"
									views={["year", "month", "day"]}
									value={startValue}
									onChange={(newValue) => {
										setStartValue(
											newValue ?? new Date().getTime()
										);
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											margin="dense"
											size="small"
											value={new Date(
												startValue
											).toLocaleDateString("in")}
											required
										/>
									)}
								/>
								<Spacer />
								<DatePicker
									disablePast
									openTo="year"
									views={["year", "month", "day"]}
									value={endValue}
									onChange={(newValue) => {
										setEndValue(
											newValue ?? new Date().getTime()
										);
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											margin="dense"
											size="small"
											value={
												endValue
													? new Date(
															endValue
													  ).toLocaleDateString("in")
													: undefined
											}
										/>
									)}
								/>
							</Box>
						</LocalizationProvider>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSubmit} disabled={!isValid}>
						Submit
					</Button>
					<Button onClick={handleClose}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
