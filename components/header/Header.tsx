import { Box, Button, IconButton } from "@mui/material";
import Image from "next/image";
import logo from "../../public/favicon.ico";
import styles from "../../styles/Header.module.css";
import { AddRecord } from "../records/AddRecord";

export const Header = () => {
	return (
		<header className={styles.dlbHeader}>
			<Image src={logo} alt="debt-log-book-logo"></Image>
			Debt Log Book
			<div className="spacer"></div>
			<Box className={styles.dlbHeaderActions}>
				<AddRecord />
				<IconButton>Menu here</IconButton>
			</Box>
		</header>
	);
};
