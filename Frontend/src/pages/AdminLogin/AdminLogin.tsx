import { useStore } from "@/context/store";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

function AdminLogin() {
	const navigate = useNavigate();

	const [token, setToken] = useState(() => {
		return localStorage.getItem("adminToken") || "";
	});

	useEffect(() => {
		localStorage.setItem("adminToken", token);
	}, [token]);

	const [api] = useStore((state) => [state.api]);
	const { toast } = useToast();

	const formSchema = z.object({
		username_mail: z.string(),
		password: z.string(),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username_mail: "",
			password: "",
		},
	});

	const checkLoginStatus = useMemo(
		() => async () => {
			if (!api) {
				return;
			}
			const { data, error } = await api.login.status.post({
				token: token,
			});

			if (error) {
				setToken("");
			}

			if (data) {
				setToken(data);
				navigate({
					to: "/admin",
				});
			}
		},
		[api, navigate, token],
	);

	useEffect(() => {
		if (!api) {
			toast({
				title: "Errore",
				description: "Qualcosa è andato storto, riprova più tardi",
				variant: "destructive",
			});
		}

		checkLoginStatus();
	}, [api, checkLoginStatus, toast]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!api) {
			toast({
				title: "Errore",
				description: "Qualcosa è andato storto, riprova più tardi",
				variant: "destructive",
			});
			return;
		}
		const { data, error } = await api.login.post({
			username_mail: values.username_mail,
			password: values.password,
		});

		if (error) {
			toast({
				title: "Errore",
				description: "Accesso fallito",
				variant: "destructive",
			});
		}

		if (data) {
			setToken(data);
			navigate({
				to: "/admin",
			});
		}
	}
	return (
		<div className="flex justify-center items-center h-full">
			<Card>
				<CardHeader>
					<CardTitle>Accedi come amministratore</CardTitle>
					<CardDescription>
						Se sei su questa pagina e non sei un amministratore, stai sbagliando
						qualcosa nella vita.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="username_mail"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username/Email</FormLabel>
										<FormControl>
											<Input placeholder="admin" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</CardContent>
				<CardFooter className={cn()}>
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

export default AdminLogin;
