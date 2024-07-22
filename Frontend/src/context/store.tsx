import { create } from "zustand";
import  { treaty } from "@elysiajs/eden";
import type { App } from "iscrizioni-grest-backend";
import { devtools } from "zustand/middleware";
import type { Iscrizione } from "@/types";


interface Store {
	api: ReturnType<typeof treaty<App>> ;

	showPrivacyText: boolean;
	setShowPrivacyText: (showPrivacyText: boolean) => void;
	iscrizioneCompleta: boolean;
	setIscrizioneCompleta: (iscrizioneCompleta: boolean) => void;
	iscrizioni: Iscrizione[];
	setIscrizioni: (iscrizioni: Iscrizione[]) => void;
}

export const useStore = create<Store>()(
	devtools((set) => ({
		api: treaty<App>(import.meta.env.VITE_API_URL as string),

		showPrivacyText: false,
		setShowPrivacyText: (showPrivacyText) => set({ showPrivacyText }),
		iscrizioneCompleta: false,
		setIscrizioneCompleta: (iscrizioneCompleta) => set({ iscrizioneCompleta }),
		iscrizioni: [],
		setIscrizioni: (iscrizioni) => set({ iscrizioni }),
	})),
);
