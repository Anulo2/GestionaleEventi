import { useEffect } from "react";
import { treaty } from "@elysiajs/eden";
import type { App } from "iscrizioni-grest-backend";
import { useStore } from "@/context/store";

export function ApiProvider({ children }: { children: React.ReactNode }) {
	const { setApi } = useStore();

	useEffect(() => {
		const apiInstance = treaty<App>(import.meta.env.VITE_API_URL as string);
		setApi(apiInstance);
	}, [setApi]);

	return <>{children}</>;
}
