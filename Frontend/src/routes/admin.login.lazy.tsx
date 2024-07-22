import { createLazyFileRoute } from "@tanstack/react-router";
import AdminLogin from "@/pages/AdminLogin/AdminLogin";

export const Route = createLazyFileRoute("/admin/login")({
	component: AdminLogin,
});
