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
function Index() {
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

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<div className="flex justify-center items-center h-full">
			<Card>
				<CardHeader>
					<CardTitle>
						<div>Inserisci la mail di un genitore</div>
					</CardTitle>
					<CardDescription>
						Assicurati sia una mail di cui hai l'accesso sotto mano!
					</CardDescription>
				</CardHeader>
				<CardContent>
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
				<CardFooter>
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
