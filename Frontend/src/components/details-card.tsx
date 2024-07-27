import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/pages/Iscrizione.$evento.$token/Iscrizione.$evento.$token";
import { IscrizioneForm } from "@/components/iscrizione-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "@/context/store";
import { format } from "date-fns";

function DetailsCard({
	dettagliContent,
	setDettagliOpen,
	setDettagliContent,
	getData
}) {
	const { toast } = useToast();
	const [api] = useStore((state) => [state.api]);
	// set the carta identità as optional
	let formSchemaWithOptionalCartaIdentita = formSchema.omit({
		carta_identita_bimbo: true,
	});
	formSchemaWithOptionalCartaIdentita =
		formSchemaWithOptionalCartaIdentita.merge(
			z.object({
				carta_identita_bimbo: z
					.instanceof(File, {
						message: "Devi caricare la carta d'identità del bimbo",
					})
					.optional(),
			}),
		);

	type FormSchema = z.infer<typeof formSchemaWithOptionalCartaIdentita>;

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchemaWithOptionalCartaIdentita),
		defaultValues: {
			nome_bimbo: dettagliContent.bimbo.nome,
			cognome_bimbo: dettagliContent.bimbo.cognome,
			data_nascita_bimbo: new Date(dettagliContent.bimbo.data_nascita),
			residenza_bimbo: dettagliContent.bimbo.residenza,
			luogo_nascita_bimbo: dettagliContent.bimbo.luogo_nascita,
			codice_fiscale_bimbo: dettagliContent.bimbo.codice_fiscale,
			iscritto_noi_bimbo: dettagliContent.bimbo.iscritto_noi,
			allergie_bimbo: dettagliContent.datiMedici.allergie,
			patologie_bimbo: dettagliContent.datiMedici.patologie,
			genitori: dettagliContent.genitori.map((genitore) => ({
				nome_genitore: genitore.nome,
				cognome_genitore: genitore.cognome,
			})),
			contatti: dettagliContent.contatti.map((contatto) => ({
				nome_contatto: contatto.nome,
				cognome_contatto: contatto.cognome,
				telefono_contatto: contatto.telefono,
				ruolo_contatto: contatto.ruolo,
			})),
			carta_identita_bimbo: undefined,
			bonifico_pagamento: undefined,
			privacy_foto: dettagliContent.privacy_foto_accettata,
			privacy_policy: dettagliContent.privacy_policy_accettata,
			note: dettagliContent.note,	
		},
	});
	async function onSubmit(values: FormSchema) {
		console.log(values);
		if (!api) {
			toast({
				title: "Errore",
				description: "Errore nell'invio dei dati",
				variant: "destructive",
			});
			return;
		}
		console.log(JSON.stringify(values.genitori));

		const { error } = await api.aggiorna.post({
			id: dettagliContent.id,
			nome_bimbo: values.nome_bimbo,
			cognome_bimbo: values.cognome_bimbo,
			data_nascita_bimbo: values.data_nascita_bimbo,
			residenza_bimbo: values.residenza_bimbo,
			luogo_nascita_bimbo: values.luogo_nascita_bimbo,
			codice_fiscale_bimbo: values.codice_fiscale_bimbo,
			iscritto_noi_bimbo: values.iscritto_noi_bimbo,
			allergie_bimbo: values.allergie_bimbo,
			patologie_bimbo: values.patologie_bimbo,
			genitori: values.genitori.map((genitore) =>
				JSON.stringify(genitore),
			) as string[],
			contatti: values.contatti.map((contatto) =>
				JSON.stringify(contatto),
			) as string[],
			carta_identita_bimbo: values.carta_identita_bimbo,
			// add bonifico pagamento only if != from undefined
			...(values.bonifico_pagamento
				? { bonifico_pagamento: values.bonifico_pagamento }
				: {}),
			privacy_foto: values.privacy_foto,
			privacy_policy: values.privacy_policy,
			note: values.note,
			pagamento: dettagliContent.pagamento,
		});
		if (error) {
			toast({
				title: "Errore",
				description: error.value,
				variant: "destructive",
			});
			return;
		}
		toast({
			title: "Successo",
			description: "Iscrizione aggiornata",
		});
		setDettagliOpen(false);
		setDettagliContent(null);
		getData();
	}

	return (
		<DialogContent className="w-full max-w-none max-h-screen overflow-scroll">
			<DialogHeader>
				<DialogTitle>Iscrizione</DialogTitle>
				<DialogDescription>
					Modifica e visualizza l'iscrizione
				</DialogDescription>
			</DialogHeader>

			<IscrizioneForm form={form} onSubmit={onSubmit} updating={true} setPrivacyContent={()=>{}} eventoInfo={""} />
		</DialogContent>
	);
}
export default DetailsCard;
