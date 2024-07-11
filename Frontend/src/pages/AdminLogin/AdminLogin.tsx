import { useStore } from "@/context/store";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

function AdminLogin() {
	const [api] = useStore((state) => [state.api]);
	const { toast } = useToast();

	const formSchema = z.object({
		email: z.string(),
		password: z.string(),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username_mail: "",
			password: "",
		},
	});
}

export default AdminLogin;
