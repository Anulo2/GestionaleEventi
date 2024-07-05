import { create } from "zustand";
import type { treaty } from "@elysiajs/eden";
import type { App } from "iscrizioni-grest-backend";
import { devtools } from "zustand/middleware";
import type { Iscrizione } from "@/types";

interface Store {
	api: ReturnType<typeof treaty<App>> | null;
	setApi: (api: ReturnType<typeof treaty<App>>) => void;
	showPrivacyText: boolean;
	setShowPrivacyText: (showPrivacyText: boolean) => void;
	iscrizioneCompleta: boolean;
	setIscrizioneCompleta: (iscrizioneCompleta: boolean) => void;
	iscrizioni: Iscrizione[];
	setIscrizioni: (iscrizioni: Iscrizione[]) => void;
}

export const useStore = create<Store>()(
	devtools((set) => ({
		api: null,
		setApi: (api) => set({ api }),
		showPrivacyText: false,
		setShowPrivacyText: (showPrivacyText) => set({ showPrivacyText }),
		iscrizioneCompleta: false,
		setIscrizioneCompleta: (iscrizioneCompleta) => set({ iscrizioneCompleta }),
		iscrizioni: [],
		setIscrizioni: (iscrizioni) => set({ iscrizioni }),
	})),
);
