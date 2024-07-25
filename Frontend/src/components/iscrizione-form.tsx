// Frontend/src/components/IscrizioneForm.tsx
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import type { FormSchema } from "@/pages/Iscrizione.$evento.$token/Iscrizione.$evento.$token";
import {
	TextInput,
	DateInput,
	BooleanInput,
	FileUploadInput,
	ContattiInputs,
	ParentInputs,
} from "@/pages/Iscrizione.$evento.$token/Iscrizione.$evento.$token";
interface IscrizioneFormProps {
	form: UseFormReturn<FormSchema>;
	onSubmit: (data: FormSchema) => void;
	setShowPrivacyText?: (show: boolean) => void;
	updating?: boolean;
}

export function IscrizioneForm({
	form,
	onSubmit,
	setShowPrivacyText = () => {},
	updating = false,
}: IscrizioneFormProps) {
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 "
			>
				<TextInput
					form={form}
					field_name="nome_bimbo"
					label="Nome"
					placeholder="Nome"
					description="Nome figlio/a"
				/>
				<TextInput
					form={form}
					field_name="cognome_bimbo"
					label="Cognome"
					placeholder="Cognome"
					description="Cognome figlio/a"
				/>
				<DateInput
					form={form}
					field_name="data_nascita_bimbo"
					label="Data di nascita"
					description="Data di nascita figlio/a"
				/>
				<TextInput
					form={form}
					field_name="residenza_bimbo"
					label="Residenza"
					placeholder="Residenza"
					description="Residenza figlio/a"
				/>
				<TextInput
					form={form}
					field_name="luogo_nascita_bimbo"
					label="Luogo di nascita"
					placeholder="Luogo di nascita"
					description="Luogo di nascita figlio/a"
				/>
				<TextInput
					form={form}
					field_name="codice_fiscale_bimbo"
					label="Codice fiscale"
					placeholder="Codice fiscale"
					description="Codice fiscale figlio/a"
				/>
				<BooleanInput
					form={form}
					field_name="iscritto_noi_bimbo"
					label="Iscritto al NOI"
					description="Il figlio/a è iscritto al NOI?"
				/>
				<FileUploadInput
					form={form}
					field_name="carta_identita_bimbo"
					label="Carica la carta d'identità"
					description="Carica la carta d'identità del figlio/a"
					accept="image/*"
				/>
				<TextInput
					form={form}
					field_name="allergie_bimbo"
					label="Allergie"
					placeholder="Allergie"
					description="Allergie figlio/a e farmaci che deve assumere per esse"
					type="textarea"
					className="col-span-1 md:col-span-2 "
				/>
				<TextInput
					form={form}
					field_name="patologie_bimbo"
					label="Patologie"
					placeholder="Patologie"
					description="Patologie figlio/a e farmaci che deve assumere per esse"
					type="textarea"
					className="col-span-1 md:col-span-2 "
				/>

				<Separator className="col-span-1 md:col-span-2 xl:col-span-4" />
				<ParentInputs
					className="col-span-1 md:col-span-2 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 "
					form={form}
				/>
				<Separator className="col-span-1 md:col-span-2 xl:col-span-4" />
				<ContattiInputs
					className="col-span-1 md:col-span-2 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 "
					form={form}
				/>
				<Separator className="col-span-1 md:col-span-2  xl:col-span-4  " />
				<FileUploadInput
					form={form}
					field_name="bonifico_pagamento"
					label="Carica il bonifico"
					description="Carica il bonifico di pagamento se hai già pagato"
					accept="application/pdf"
					className="col-span-1 xl:col-span-2   "
				/>
				<Separator className="col-span-1 md:col-span-2  xl:col-span-4  " />
				<TextInput
					form={form}
					field_name="note"
					label="Note"
					placeholder="Note"
					description="Eventuali note aggiuntive"
					type="textarea"
					className="col-span-1 md:col-span-2  xl:col-span-4  "
				/>
				<Separator className="col-span-1 md:col-span-2  xl:col-span-4  " />

				<BooleanInput
					form={form}
					field_name="privacy_foto"
					label="Accetta privacy foto"
					description="Accetti la privacy delle foto?"
				/>
				<Button
					onClick={(e) => {
						e.preventDefault();
						setShowPrivacyText(true);
					}}
					className="my-auto"
				>
					Leggila
				</Button>
				<BooleanInput
					form={form}
					field_name="privacy_policy"
					label="Accetta privacy policy"
					description="Accetti la privacy policy?"
				/>
				<Button
					onClick={(e) => {
						e.preventDefault();
						setShowPrivacyText(true);
					}}
					className="my-auto"
				>
					Leggila
				</Button>
				<Button
					className="col-span-1 md:col-span-2  xl:col-span-4 text-3xl font-bold mt-4 p-8 w-full"
					type="submit"
				>
					{updating ? "Aggiorna" : "Iscrivi"}
				</Button>
			</form>
		</Form>
	);
}

export default IscrizioneForm;
