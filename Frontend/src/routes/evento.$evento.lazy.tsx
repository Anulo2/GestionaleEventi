import { createLazyFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Evento.$evento/Evento.$evento";

export const Route = createLazyFileRoute("/evento/$evento")({
	component: Index,
});
