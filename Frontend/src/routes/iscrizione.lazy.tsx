import { createLazyFileRoute } from "@tanstack/react-router";
import Iscrizione from "@/pages/Iscrizione/Iscrizione";

export const Route = createLazyFileRoute("/iscrizione")({
	component: () => (
		<div className="xl:max-w-5xl mx-auto">
			<Iscrizione />
		</div>
	),
});
