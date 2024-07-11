import { useStore } from "@/context/store";
import { useEffect, useState, useMemo } from "react";

import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import type { Iscrizione } from "@/types";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableHeader,
	TableRow,
	TableBody,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import { ChevronDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import DetailsCard from "@/components/details-card";
import { useToast } from "@/components/ui/use-toast";
/*
export const iscrizioni: Iscrizione[] = [
	{
		id: 5,
		evento_id: 1,
		bimbo_id: 6,
		mail_riferimento: "test@example.com",
		privacy_policy_accettata: true,
		privacy_foto_accettata: false,
		timestamp_iscrizione: "2024-07-05T16:37:22.117Z",
		note: "è un rompiballe",
		pagamento: true,
		pagamento_file: 5,
		is_completed: false,
		genitori: [
			{ id: 2, nome: "Federica", cognome: "Olivetto" },
			{ id: 1, nome: "Gianluca", cognome: "Canello" },
		],
		contatti: [
			{
				id: 1,
				nome: "Gianluca",
				cognome: "Canello",
				telefono: "3285924354",
				ruolo: "Genitore",
			},
			{
				id: 2,
				nome: "Federica",
				cognome: "Olivetto",
				telefono: "3248921948",
				ruolo: "Genitore",
			},
		],
		bimbo: {
			id: 6,
			nome: "Leonardo",
			cognome: "Canello",
			data_nascita: "2002-07-08T00:00:00.000Z",
			residenza: "Via Raffaello Sanzio 42, Torreglia",
			luogo_nascita: "Abano Terme",
			note_interne: null,
			codice_fiscale: "CNLLRD02L08A001T",
			iscritto_noi: true,
		},
		datiMedici: {
			id: 1,
			iscrizione_id: 5,
			documento_identita: 1,
			allergie: "Polvere",
			patologie: "Nulla",
		},
	},
	{
		id: 6,
		evento_id: 1,
		bimbo_id: 7,
		mail_riferimento: "test@example.com",
		privacy_policy_accettata: true,
		privacy_foto_accettata: false,
		timestamp_iscrizione: "2024-07-05T16:38:08.126Z",
		note: "è un rompiballe",
		pagamento: true,
		pagamento_file: 6,
		is_completed: false,
		genitori: [
			{ id: 4, nome: "Federica", cognome: "Olivetto" },
			{ id: 3, nome: "Gianluca", cognome: "Canello" },
		],
		contatti: [
			{
				id: 3,
				nome: "Gianluca",
				cognome: "Canello",
				telefono: "3285924354",
				ruolo: "Genitore",
			},
			{
				id: 4,
				nome: "Federica",
				cognome: "Olivetto",
				telefono: "3248921948",
				ruolo: "Genitore",
			},
		],
		bimbo: {
			id: 7,
			nome: "Leonardo",
			cognome: "Canello",
			data_nascita: "2002-07-08T00:00:00.000Z",
			residenza: "Via Raffaello Sanzio 42, Torreglia",
			luogo_nascita: "Abano Terme",
			note_interne: null,
			codice_fiscale: "CNLLRD02L08A001T",
			iscritto_noi: true,
		},
		datiMedici: {
			id: 2,
			iscrizione_id: 6,
			documento_identita: 2,
			allergie: "Polvere",
			patologie: "Nulla",
		},
	},
	{
		id: 7,
		evento_id: 1,
		bimbo_id: 8,
		mail_riferimento: "test@example.com",
		privacy_policy_accettata: true,
		privacy_foto_accettata: false,
		timestamp_iscrizione: "2024-07-05T16:47:19.349Z",
		note: "è un rompiballe",
		pagamento: true,
		pagamento_file: 7,
		is_completed: false,
		genitori: [
			{ id: 6, nome: "Federica", cognome: "Olivetto" },
			{ id: 5, nome: "Gianluca", cognome: "Canello" },
		],
		contatti: [
			{
				id: 5,
				nome: "Gianluca",
				cognome: "Canello",
				telefono: "3285924354",
				ruolo: "Genitore",
			},
			{
				id: 6,
				nome: "Federica",
				cognome: "Olivetto",
				telefono: "3248921948",
				ruolo: "Genitore",
			},
		],
		bimbo: {
			id: 8,
			nome: "Leonardo",
			cognome: "Canello",
			data_nascita: "2002-07-08T00:00:00.000Z",
			residenza: "Via Raffaello Sanzio 42, Torreglia",
			luogo_nascita: "Abano Terme",
			note_interne: null,
			codice_fiscale: "CNLLRD02L08A001T",
			iscritto_noi: true,
		},
		datiMedici: {
			id: 3,
			iscrizione_id: 7,
			documento_identita: 3,
			allergie: "Polvere",
			patologie: "Nulla",
		},
	},
	{
		id: 8,
		evento_id: 1,
		bimbo_id: 9,
		mail_riferimento: "test@example.com",
		privacy_policy_accettata: true,
		privacy_foto_accettata: false,
		timestamp_iscrizione: "2024-07-05T16:47:32.105Z",
		note: "è un rompiballe",
		pagamento: true,
		pagamento_file: 8,
		is_completed: false,
		genitori: [
			{ id: 8, nome: "Federica", cognome: "Olivetto" },
			{ id: 7, nome: "Gianluca", cognome: "Canello" },
		],
		contatti: [
			{
				id: 7,
				nome: "Gianluca",
				cognome: "Canello",
				telefono: "3285924354",
				ruolo: "Genitore",
			},
			{
				id: 8,
				nome: "Federica",
				cognome: "Olivetto",
				telefono: "3248921948",
				ruolo: "Genitore",
			},
		],
		bimbo: {
			id: 9,
			nome: "Leonardo",
			cognome: "Canello",
			data_nascita: "2002-07-08T00:00:00.000Z",
			residenza: "Via Raffaello Sanzio 42, Torreglia",
			luogo_nascita: "Abano Terme",
			note_interne: null,
			codice_fiscale: "CNLLRD02L08A001T",
			iscritto_noi: true,
		},
		datiMedici: {
			id: 4,
			iscrizione_id: 8,
			documento_identita: 4,
			allergie: "Polvere",
			patologie: "Nulla",
		},
	},
	{
		id: 9,
		evento_id: 1,
		bimbo_id: 10,
		mail_riferimento: "test@example.com",
		privacy_policy_accettata: true,
		privacy_foto_accettata: false,
		timestamp_iscrizione: "2024-07-05T16:56:05.746Z",
		note: "",
		pagamento: false,
		pagamento_file: 9,
		is_completed: false,
		genitori: [
			{ id: 10, nome: "adfsadf", cognome: "asdfasdf" },
			{ id: 9, nome: "asdfas", cognome: "asdfas" },
		],
		contatti: [
			{
				id: 9,
				nome: "asdfasdaf",
				cognome: "asdfasdf",
				telefono: "3285924354",
				ruolo: "asdfasfd",
			},
			{
				id: 10,
				nome: "asdfasfd",
				cognome: "asdfasdf",
				telefono: "3248921948",
				ruolo: "asdfasdf",
			},
		],
		bimbo: {
			id: 10,
			nome: "asdfasdf",
			cognome: "Canello",
			data_nascita: "2002-08-07T00:00:00.000Z",
			residenza: "Torreglia",
			luogo_nascita: "asdfasdf",
			note_interne: null,
			codice_fiscale: "CNLLRD02L08A001T",
			iscritto_noi: false,
		},
		datiMedici: {
			id: 5,
			iscrizione_id: 9,
			documento_identita: 5,
			allergie: "asdf",
			patologie: "",
		},
	},
	{
		id: 10,
		evento_id: 1,
		bimbo_id: 11,
		mail_riferimento: "test@example.com",
		privacy_policy_accettata: true,
		privacy_foto_accettata: false,
		timestamp_iscrizione: "2024-07-05T17:07:57.997Z",
		note: "",
		pagamento: true,
		pagamento_file: 10,
		is_completed: false,
		genitori: [
			{ id: 11, nome: "3248921948", cognome: "3248921948" },
			{ id: 12, nome: "3248921948", cognome: "3248921948" },
		],
		contatti: [
			{
				id: 12,
				nome: "3248921948",
				cognome: "3248921948",
				telefono: "3248921948",
				ruolo: "3248921948",
			},
			{
				id: 11,
				nome: "3248921948",
				cognome: "3248921948",
				telefono: "3248921948",
				ruolo: "3248921948",
			},
		],
		bimbo: {
			id: 11,
			nome: "Leonardo",
			cognome: "Canello",
			data_nascita: "2002-08-07T00:00:00.000Z",
			residenza: "3248921948",      const { data } = await api.iscritti.get();
      setIscrizioni(data as Iscrizione[]);iscale: "CNLLRD02L08A001T",
			iscritto_noi: false,
		},
		datiMedici: {
			id: 6,
			iscrizione_id: 10,
			documento_identita: 6,
			allergie: "3248921948",
			patologie: "",
		},
	},
];*/

function AdminIndex() {
	const [api, setIscrizioni, iscrizioni] = useStore((state) => [
		state.api,
		state.setIscrizioni,
		state.iscrizioni,
	]);

	const [dettagliOpen, setDettagliOpen] = useState(false);
	const [eventi, setEventi] = useState<(typeof api.evento)[]>([]);
	const [eventoSelezionato, setEventoSelezionato] = useState<number | null>(
		null,
	);
	const { toast } = useToast();

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

	const columns: ColumnDef<Iscrizione>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "mail riferimento",
			accessorFn: (row) => row.mail_riferimento,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Mail
						<ArrowUpDownIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="lowercase">{row.getValue("mail riferimento")}</div>
			),
		},
		// bimbo.codice_fiscale
		{
			accessorKey: "codice fiscale",
			accessorFn: (row) => row.bimbo.codice_fiscale,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Codice Fiscale
						<ArrowUpDownIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="">{row.getValue("codice fiscale")}</div>
			),
		},
		// bimbo.nome
		{
			accessorKey: "nome",
			accessorFn: (row) => row.bimbo.nome,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Nome
						<ArrowUpDownIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div className="">{row.getValue("nome")}</div>,
		},
		{
			accessorKey: "cognome",
			accessorFn: (row) => row.bimbo.cognome,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Cognome
						<ArrowUpDownIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => <div className="">{row.getValue("cognome")}</div>,
		},
		// pagamento (boolean)
		{
			accessorKey: "pagamento",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Pagamento
						<ArrowUpDownIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="w-full flex justify-center">
					<Checkbox className="" checked={row.getValue("pagamento")} />
				</div>
			),
		},
		// eta
		{
			accessorKey: "eta",
			accessorFn: (row) => {
				const data_nascita = new Date(row.bimbo.data_nascita);
				const diff = Date.now() - data_nascita.getTime();
				const eta = new Date(diff);
				return Math.abs(eta.getUTCFullYear() - 1970);
			},
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Eta
						<ArrowUpDownIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="text-center">{row.getValue("eta")}</div>
			),
		},
		// iscritto noi
		{
			accessorKey: "iscritto noi",
			accessorFn: (row) => row.bimbo.iscritto_noi,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Iscritto noi
						<ArrowUpDownIcon className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="w-full flex justify-center">
					<Checkbox checked={row.getValue("iscritto noi")} />
				</div>
			),
		},
		// view bonifico
		{
			accessorKey: "Bonifico",
			accessorFn: (row) => row.pagamento_file,

			cell: ({ row }) => (
				<div className="w-full flex justify-center">
					<Button
						className={cn(!row.getValue("Bonifico") && "hidden")}
						variant="outline"
						size="sm"
						onClick={() => {
							if (!api) return;
							window.open(
								`//${import.meta.env.VITE_API_URL}/bonifico/${row.original.pagamento_file}`,
							);
						}}
					>
						View
					</Button>
				</div>
			),
		},
		// Carta identità
		{
			accessorKey: "Carta identita",
			accessorFn: (row) => row.datiMedici.documento_identita,
			cell: ({ row }) => (
				<div className="w-full flex justify-center">
					<Button
						variant="outline"
						size="sm"
						onClick={async () => {
							if (!api) return;
							window.open(
								`//${import.meta.env.VITE_API_URL}/carta_identita/${row.original.datiMedici.documento_identita}`,
							);
						}}
					>
						View
					</Button>
				</div>
			),
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const iscrizione = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								className="hover:cursor-pointer"
								onClick={() =>
									navigator.clipboard.writeText(
										`${iscrizione.bimbo.nome} ${iscrizione.bimbo.cognome}`,
									)
								}
							>
								Copia Nome e Cognome
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									setDettagliOpen(true);
								}}
								className="hover:cursor-pointer"
							>
								Vedi dettagli
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable({
		data: iscrizioni,
		columns: columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const getData = useMemo(
		() => async () => {
			if (!api) {
				return;
			}
			const { data, error } = await api
				.iscritti({
					sottodominio: eventi.find((e) => e.id === eventoSelezionato)
						?.sottodominio,
				})
				.get();

			if (error) {
				toast({
					title: "Errore",
					description: "Evento non trovato",
					variant: "destructive",
				});
			} else {
				setIscrizioni(data);
			}
		},
		[api, setIscrizioni, eventoSelezionato, toast],
	);

	useEffect(() => {
		if (!api) {
			return;
		}
		if (eventoSelezionato === null) {
			return;
		}
		getData();
	}, [api, getData, eventoSelezionato]);

	return (
		<Dialog open={dettagliOpen}>
			<div className="w-full 2xl:px-4 h-full">
				<ModeToggle className="absolute bottom-2 right-2" />
				<DetailsCard />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="h-auto flex gap-2 my-2 font-bold text-2xl"
						>
							<span className="">
								{eventoSelezionato
									? eventi.find((e) => e.id === eventoSelezionato)?.nome
									: "Seleziona un evento"}
							</span>
							<ChevronDown className="h-auto" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{eventi.map((evento) => (
							<DropdownMenuItem
								key={evento.id}
								onClick={() => setEventoSelezionato(evento.id)}
							>
								{evento.nome}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<div className="flex items-center py-4">
					<Input
						placeholder="Filter emails..."
						value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("email")?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns <ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of{" "}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</Dialog>
	);
}

export default AdminIndex;
