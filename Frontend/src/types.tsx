export type Iscrizione = {
	id: number;
	evento_id: number;
	bimbo_id: number;
	mail_riferimento: string;
	privacy_policy_accettata: boolean;
	privacy_foto_accettata: boolean;
	timestamp_iscrizione: string;
	note: string;
	pagamento: boolean;
	pagamento_file: number;
	is_completed: boolean;
	genitori: { id: number; nome: string; cognome: string }[];
	contatti: {
		id: number;
		nome: string;
		cognome: string;
		telefono: string;
		ruolo: string;
	}[];
	bimbo: {
		id: number;
		nome: string;
		cognome: string;
		data_nascita: string;
		residenza: string;
		luogo_nascita: string;
		note_interne: string | null;
		codice_fiscale: string;
		iscritto_noi: boolean;
	};
	datiMedici: {
		id: number;
		iscrizione_id: number;
		documento_identita: number;
		allergie: string;
		patologie: string;
	};
};
