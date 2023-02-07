import { Container } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Header } from "../components/header";
import { Records } from "../components/records/Records";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Debt Log Book</title>
				<meta name="description" content="Log book records" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />
			<main className={styles.main}>
				<Container>
					<Records />
				</Container>
			</main>
		</div>
	);
};

export default Home;
