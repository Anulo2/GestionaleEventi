import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useStore } from "@/context/store";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

function Index() {
	const { evento } = useParams({
		from: "/evento/$evento",
	});
	const [api] = useStore((state) => [state.api]);
	const [showSuccess, setShowSuccess] = useState(false);

	const formSchema = z.object({
		email: z.string().email({
			message: "Inserisci una mail valida!",
		}),
	});
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});
	const { toast } = useToast();
	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!api) {
			toast({
				title: "Errore",
				description: "Qualcosa è andato storto, riprova più tardi",
				variant: "destructive",
			});
			return;
		}

		const { error } = await api.email.post({
			email: values.email,
			evento: evento,
		});

		if (error) {
			toast({
				title: "Errore",
				description: error.value,
				variant: "destructive",
			});
			return;
		}

		setShowSuccess(true);
	}

	const navigate = useNavigate();

	const checkIfEventExists = useMemo(
		() => async () => {
			if (!api) {
				return;
			}
			const { error } = await api.evento({ sottodominio: evento }).get();
			if (error) {
				toast({
					title: "Errore",
					description: "L'evento da te cercato non esiste",
					variant: "destructive",
				});
				navigate({ to: "/" });
			}
		},
		[api, evento, navigate, toast],
	);

	useEffect(() => {
		if (!api) {
			return;
		}
		checkIfEventExists();
	}, [api, checkIfEventExists]);

	return (
		<div className="flex justify-center items-center h-full">
			<Card>
				<CardHeader>
					<CardTitle>
						<div>
							{showSuccess
								? "Invio avvenuto con successo"
								: "Inserisci la mail di un genitore"}
						</div>
					</CardTitle>
					<CardDescription>
						{showSuccess
							? "Ti abbiamo inviato una mail con il link per continuare l'iscrizione"
							: "Assicurati sia una mail di cui hai l'accesso sotto mano!"}
					</CardDescription>
				</CardHeader>
				<CardContent className={cn(showSuccess && "hidden")}>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="Email" {...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</CardContent>
				<CardFooter className={cn(showSuccess && "hidden")}>
					<Button
						className="mx-auto font-bold text-xl "
						onClick={form.handleSubmit(onSubmit)}
					>
						Inizia
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

export default Index;
