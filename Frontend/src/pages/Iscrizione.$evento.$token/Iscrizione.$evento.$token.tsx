import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import validator from "validator";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "@/context/store";
import { Textarea } from "@/components/ui/textarea";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Card,
	CardHeader,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
const formSchema = z.object({
	nome_bimbo: z.string().min(2, {
		message: "Il nome deve essere lungo almeno 2 caratteri",
	}),
	cognome_bimbo: z.string().min(2, {
		message: "Il cognome deve essere lungo almeno 2 caratteri",
	}),
	data_nascita_bimbo: z.date({
		required_error: "La data di nascita è obbligatoria",
		invalid_type_error: "La data di nascita deve essere una data",
	}),
	residenza_bimbo: z.string().min(5, {
		message: "La residenza deve essere lunga almeno 5 caratteri",
	}),
	luogo_nascita_bimbo: z.string().min(5, {
		message: "Il luogo di nascita deve essere lungo almeno 5 caratteri",
	}),
	codice_fiscale_bimbo: z.string().length(16, {
		message: "Il codice fiscale deve essere lungo 16 caratteri",
	}),
	iscritto_noi_bimbo: z.boolean({
		required_error: "Devi specificare se il bimbo è iscritto al NOI",
		invalid_type_error: "Il valore deve essere booleano",
	}),
	allergie_bimbo: z.string().default(""),
	patologie_bimbo: z.string().default(""),
	genitori: z
		.array(
			z
				.object({
					nome_genitore: z.string().min(2, {
						message: "Il nome deve essere lungo almeno 2 caratteri",
					}),
					cognome_genitore: z.string().min(2, {
						message: "Il cognome deve essere lungo almeno 2 caratteri",
					}),
				})
				.required(),
		)
		.length(2, {
			message: "Devi specificare due genitori",
		}),
	contatti: z
		.array(
			z
				.object({
					nome_contatto: z.string().min(2, {
						message: "Il nome deve essere lungo almeno 2 caratteri",
					}),
					cognome_contatto: z.string().min(2, {
						message: "Il cognome deve essere lungo almeno 2 caratteri",
					}),
					telefono_contatto: z
						.string()
						.refine(
							validator.isMobilePhone,
							"Il numero di telefono non è valido",
						),
					ruolo_contatto: z.string().min(2, {
						message: "Il ruolo deve essere lungo almeno 2 caratteri",
					}),
				})
				.required(),
		)
		.min(2, {
			message: "Devi specificare almeno due contatti",
		}),
	carta_identita_bimbo: z.instanceof(File, {
		message: "Devi caricare la carta d'identità del bimbo",
	}),
	bonifico_pagamento: z.instanceof(File).optional(),
	privacy_foto: z.boolean({
		required_error: "Devi specificare se accetti la privacy delle foto",
		invalid_type_error: "Il valore deve essere booleano",
	}),
	privacy_policy: z.literal(true, {
		errorMap: () => ({ message: "Devi accettare la privacy policy" }),
	}),
	note: z.string().default(""),
});
import { useEffect, useMemo } from "react";
type FormSchema = z.infer<typeof formSchema>;

import { useParams } from "@tanstack/react-router";

function Iscrizione() {
	const { evento, token } = useParams({ from: "/iscrizione/$evento/$token" });
	const navigate = useNavigate();

	const { toast } = useToast();
	const [
		showPrivacyText,
		setShowPrivacyText,
		api,
		iscrizioneCompleta,
		setIscrizioneCompleta,
	] = useStore((state) => [
		state.showPrivacyText,
		state.setShowPrivacyText,
		state.api,
		state.iscrizioneCompleta,
		state.setIscrizioneCompleta,
	]);

	const checkToken = useMemo(
		() => async () => {
			if (!api) {
				return;
			}
			if (!evento || !token) {
				toast({
					title: "Errore",
					description: "Errore nell'invio dei dati",
					variant: "destructive",
				});
				navigate({ to: "/" });
				return;
			}
			const { error } = await api.iscrivi({ evento: evento }).get({
				query: { token: token },
			});

			if (error) {
				toast({
					title: "Errore",
					description: error.value,
					variant: "destructive",
				});
				navigate({ to: "/" });
			}
		},
		[api, evento, token, navigate, toast],
	);

	useEffect(() => {
		if (!api) {
			return;
		}
		checkToken();
	}, [api, checkToken]);

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome_bimbo: "",
			cognome_bimbo: "",
			data_nascita_bimbo: undefined,
			residenza_bimbo: "",
			luogo_nascita_bimbo: "",
			codice_fiscale_bimbo: "",
			iscritto_noi_bimbo: false,
			allergie_bimbo: "",
			patologie_bimbo: "",
			genitori: [
				{
					nome_genitore: "",
					cognome_genitore: "",
				},
				{
					nome_genitore: "",
					cognome_genitore: "",
				},
			],
			contatti: [
				{
					nome_contatto: "",
					cognome_contatto: "",
					telefono_contatto: "",
					ruolo_contatto: "",
				},
				{
					nome_contatto: "",
					cognome_contatto: "",
					telefono_contatto: "",
					ruolo_contatto: "",
				},
			],
			carta_identita_bimbo: undefined,
			bonifico_pagamento: undefined,
			privacy_foto: false,
			privacy_policy: undefined,
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

		const { error } = await api.iscrivi.post({
			evento,
			token,
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
		});
		if (error) {
			toast({
				title: "Errore",
				description: error.value,
				variant: "destructive",
			});
			return;
		}
		setIscrizioneCompleta(true);
	}
	if (iscrizioneCompleta) {
		return (
			<div className="flex h-full justify-center items-center">
				<Card>
					<CardHeader>
						<CardTitle>Iscrizione completata</CardTitle>
						<CardDescription>
							La tua iscrizione è stata completata con successo!
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="xl:max-w-5xl mx-auto">
			<Drawer open={showPrivacyText} onOpenChange={setShowPrivacyText}>
				<div className="p-2">
					<DrawerContent className="h-4/5 w-full md:max-w-2xl xl:max-w-5xl mx-auto">
						<DrawerHeader>
							<DrawerTitle>Privacy sulle foto</DrawerTitle>
							<DrawerDescription>
								Leggi attentamente quste informazioni!
							</DrawerDescription>
						</DrawerHeader>
						<ScrollArea className="pl-4">
							<div className="">
								{
									// print 200 lines of "hello"
									Array.from({ length: 200 }, (_, i) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<div key={i}>Hello</div>
									))
								}
							</div>
						</ScrollArea>

						<DrawerFooter>
							<Button
								onClick={(e) => {
									e.preventDefault();
									setShowPrivacyText(false);
								}}
								variant="outline"
							>
								Chiud
							</Button>
						</DrawerFooter>
					</DrawerContent>
					<div className="font-extrabold text-2xl text-center w-full ">
						Iscrizione al Grest 2024
					</div>
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
								Iscrivi
							</Button>
						</form>
					</Form>
				</div>
			</Drawer>
		</div>
	);
}

interface ContattiInputsProps {
	form: UseFormReturn<FormSchema>;
	className?: string;
}

function ContattiInputs({ className, form }: ContattiInputsProps) {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "contatti",
	});

	return (
		<div className={cn(className)}>
			{fields.map((item, index) => (
				<div
					key={item.id}
					className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 col-span-1 md:col-span-2 xl:col-span-4"
				>
					<TextInput
						form={form}
						field_name={
							`contatti.${index}.nome_contatto` as TextInputProps["field_name"]
						}
						label={`Nome Contatto ${index + 1}`}
						placeholder="Nome"
						description="Nome contatto"
					/>
					<TextInput
						form={form}
						field_name={
							`contatti.${index}.cognome_contatto` as TextInputProps["field_name"]
						}
						label={`Cognome Contatto ${index + 1}`}
						placeholder="Cognome"
						description="Cognome contatto"
					/>
					<TextInput
						form={form}
						field_name={
							`contatti.${index}.telefono_contatto` as TextInputProps["field_name"]
						}
						label={`Telefono Contatto ${index + 1}`}
						placeholder="Telefono"
						description="Telefono contatto"
					/>
					<TextInput
						form={form}
						field_name={
							`contatti.${index}.ruolo_contatto` as TextInputProps["field_name"]
						}
						label={`Ruolo Contatto ${index + 1}`}
						placeholder="Ruolo"
						description="Ruolo contatto"
					/>
					<Button
						type="button"
						onClick={() => remove(index)}
						className="mx-auto col-span-1 md:col-span-2 xl:col-span-4"
					>
						Rimuovi contatto
					</Button>
				</div>
			))}
			{
				// add an error if less than 2 contacts}
				fields.length < 2 && (
					<p className="col-span-1 md:col-span-2 xl:col-span-4 text-red-500">
						Devi specificare almeno due contatti
					</p>
				)
			}

			<Button
				type="button"
				className="mt-2 w-full col-span-1 md:col-span-2 xl:col-span-4"
				onClick={() =>
					append({
						nome_contatto: "",
						cognome_contatto: "",
						telefono_contatto: "",
						ruolo_contatto: "",
					})
				}
			>
				Aggiungi contatto
			</Button>
		</div>
	);
}

interface ParentInputsProps {
	className?: string;
	form: UseFormReturn<FormSchema>;
}

function ParentInputs({ className, form }: ParentInputsProps) {
	const { fields } = useFieldArray({
		control: form.control,
		name: "genitori",
	});

	return (
		<div className={cn(className)}>
			{fields.map((item, index) => (
				<div
					key={item.id}
					className="grid grid-cols-1 md:grid-cols-2 gap-2 col-span-1 md:col-span-2"
				>
					<TextInput
						form={form}
						field_name={
							`genitori.${index}.nome_genitore` as TextInputProps["field_name"]
						}
						label={`Nome Genitore ${index + 1}`}
						placeholder="Nome"
						description="Nome genitore"
					/>
					<TextInput
						form={form}
						field_name={
							`genitori.${index}.cognome_genitore` as TextInputProps["field_name"]
						}
						label={`Cognome Genitore ${index + 1}`}
						placeholder="Cognome"
						description="Cognome genitore"
					/>
				</div>
			))}
		</div>
	);
}

interface BooleanInputProps {
	className?: string;
	form: UseFormReturn<FormSchema>;
	field_name: keyof FormSchema;
	label: string;
	description: string;
}

function BooleanInput({
	className,
	form,
	field_name,
	label,
	description,
}: BooleanInputProps) {
	return (
		<FormField
			control={form.control}
			name={field_name}
			render={({ field }) => (
				<FormItem className={cn("w-full", className)}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<>
							<br />
							<Switch
								checked={field.value as boolean}
								onCheckedChange={field.onChange}
							/>
						</>
					</FormControl>
					<FormDescription>{description}</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

interface DateInputProps {
	className?: string;
	form: UseFormReturn<FormSchema>;
	field_name: keyof FormSchema;
	label: string;
	description: string;
}

function DateInput({
	className,
	form,
	field_name,
	label,
	description,
}: DateInputProps) {
	return (
		<FormField
			control={form.control}
			name={field_name}
			render={({ field }) => (
				<FormItem className={cn("w-full", className)}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							type="date"
							value={
								field.value ? format(field.value as Date, "yyyy-MM-dd") : ""
							}
							onChange={(e) => {
								field.onChange(new Date(e.target.value));
							}}
						/>
					</FormControl>
					<FormDescription>{description}</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

interface TextInputProps {
	className?: string;
	form: UseFormReturn<FormSchema>;
	field_name: keyof FormSchema;
	label: string;
	placeholder: string;
	description: string;
	type?: string;
}

function TextInput({
	className,
	form,
	field_name,
	label,
	placeholder,
	description,
	type = "text",
}: TextInputProps) {
	return (
		<FormField
			control={form.control}
			name={field_name}
			render={({ field }) => (
				<FormItem className={cn("w-full", className)}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						{type === "text" ? (
							<Input
								ref={field.ref}
								value={field.value as string}
								onChange={field.onChange}
								type="text"
								placeholder={placeholder}
							/>
						) : (
							<Textarea
								ref={field.ref}
								value={field.value as string}
								onChange={field.onChange}
								placeholder={placeholder}
							/>
						)}
					</FormControl>
					<FormDescription>{description}</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

interface FileInputProps {
	className?: string;
	form: UseFormReturn<FormSchema>;
	field_name: keyof FormSchema;
	label: string;
	description: string;
	accept?: string;
}

function FileUploadInput({
	className,
	form,
	field_name,
	label,
	description,
	accept,
}: FileInputProps) {
	return (
		<FormField
			control={form.control}
			name={field_name}
			render={({ field }) => (
				<FormItem className={cn("w-full", className)}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							type="file"
							className="w-full hover:cursor-pointer file:text-primary  "
							onChange={(event) => {
								field.onChange(event.target.files?.[0]);
							}}
							accept={accept}
						/>
					</FormControl>
					<FormDescription>{description}</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export default Iscrizione;
