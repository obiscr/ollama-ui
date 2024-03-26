import { Navbar } from "@/components/navbar";
import { Head } from "./head";
import SystemStatus from "@/components/system-status";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col min-h-screen">
			<Head />
			<header className="relative flex-shrink-0 w-full">
				<Navbar />
			</header>
			<main className="container mx-auto w-full relative z-10 min-h-[calc(100vh_-_64px_-_108px)] mb-12" style={{flexGrow: "1"}}>
				{children}
			</main>
			<SystemStatus />
		</div>
	);
}
