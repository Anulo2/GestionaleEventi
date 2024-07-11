import { createLazyFileRoute } from "@tanstack/react-router";
import Iscrizione from "@/pages/Iscrizione.$evento.$token/Iscrizione.$evento.$token";
import { redirect } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/iscrizione/$evento/$token")({
	component: () => <Iscrizione />,
});
