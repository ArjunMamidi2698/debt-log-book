import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecordsProvider } from "../store/records-context";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<RecordsProvider>
			<Component {...pageProps} />
		</RecordsProvider>
	);
}

export default MyApp;
