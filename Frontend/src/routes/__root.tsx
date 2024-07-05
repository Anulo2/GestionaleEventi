import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ThemeProvider } from "@/context/theme-provider";
import { ApiProvider } from "@/context/api-provider";
import { Toaster } from "@/components/ui/toaster";

export const Route = createRootRoute({
	component: () => (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="ui-theme">
				<ApiProvider>
					<Toaster />
					<div className="w-screen flex min-h-screen justify-center">
						<div className="w-full flex flex-col min-h-screen md:max-w-2xl xl:max-w-5xl 2xl:max-w-full">
							<Outlet />
							<div className="w-full flex   justify-center mb-2 text-sm">
								<p className="">
									Made with ♥️ by{" "}
									<a
										href="https://gitlab.com/_Zaizen_/"
										target="_blank"
										rel="noreferrer noopener"
										className="text-blue-500"
									>
										_Zaizen_
									</a>
								</p>
							</div>
						</div>
					</div>
				</ApiProvider>
			</ThemeProvider>
			<TanStackRouterDevtools />
		</>
	),
});
