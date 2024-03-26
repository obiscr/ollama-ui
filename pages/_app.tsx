import type { AppProps } from "next/app";
import { Provider } from 'react-redux';
import store from '@/store';

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import {useRouter} from 'next/router';
import "@/styles/globals.css";
import "@/styles/custom.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
	return (
		<Provider store={store}>
			<NextUIProvider navigate={router.push}>
				<NextThemesProvider>
					<Component {...pageProps} />
				</NextThemesProvider>
			</NextUIProvider>
		</Provider>
	);
}

export const fonts = {
	sans: fontSans.style.fontFamily,
	mono: fontMono.style.fontFamily,
};
