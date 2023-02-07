import { InfoOutlined } from "@mui/icons-material";
import { InputLabel, SxProps, Typography } from "@mui/material";

type RecordFormInputLabelProps = {
	label: String;
	isRequired?: boolean;
	info?: String;
	sx?: SxProps;
};
export const RecordFormInputLabel = ({
	label,
	isRequired,
	info,
	sx,
}: RecordFormInputLabelProps) => (
	<InputLabel sx={sx}>
		<Typography variant="subtitle1" display="flex" alignItems="center">
			{label}
			<Typography color="error">{isRequired ? "*" : ""}</Typography>
			{info ? (
				<InfoOutlined
					color="info"
					sx={{ ml: 1 }}
					fontSize="small"
					titleAccess={info}
				/>
			) : (
				""
			)}
		</Typography>
	</InputLabel>
);