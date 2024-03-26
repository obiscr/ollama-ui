import DefaultLayout from "@/layouts/default";
import React from "react";
import ChatPage from "@/pages/chat";

export default function IndexPage() {
	return (
		<DefaultLayout>
			<ChatPage />
		</DefaultLayout>
	);
}
