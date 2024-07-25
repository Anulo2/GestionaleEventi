import {
	Card,
	CardHeader,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/store";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

function Index() {
	const navigate = useNavigate();
	const [api] = useStore((state) => [state.api]);
	const [eventi, setEventi] = useState<(typeof api.evento)[]>([]);

	const getEventi = useMemo(
		() => async () => {
			if (!api) {
				return;
			}
			const { error, data } = await api.eventi.get();
			if (error) {
				console.error(error);
				return;
			}
			setEventi(data);
		},
		[api],
	);

	useEffect(() => {
		if (!api) {
			return;
		}

		getEventi();
	}, [api, getEventi]);

	return (
		<div className="my-2 h-full">
			<h1 className="text-center font-bold text-3xl mb-2">
				Eventi disponibili
			</h1>
			<div className="flex flex-col gap-2 items-center">
				{eventi.map((evento: typeof api.evento) => (
					<Card key={evento.id}>
						<CardHeader>
							<CardTitle>{evento.nome}</CardTitle>
							<CardDescription>{evento.descrizione}</CardDescription>
						</CardHeader>
						<CardContent>
							L'evento si svolgerà: dal{" "}
							{format(new Date(evento.data_inizio), "dd/MM/yyyy")} al{" "}
							{format(new Date(evento.data_fine), "dd/MM/yyyy")}
							<br />
							Luogo: {evento.luogo}
							<br />
							Organizzato da:{" "}
							{evento.organizzatori?.map((o) => o.nome).join(", ")}
						</CardContent>
						<CardFooter>
							<Button
								onClick={(e) => {
									e.preventDefault();
									navigate({
										to: "/evento/$evento",
										params: {
											evento: evento.sottodominio,
										},
									});
								}}
								className="mx-auto font-bold text-3xl p-6"
							>
								Iscriviti!
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}

export default Index;
