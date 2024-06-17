function _nullishCoalesce(lhs, rhsFn) {
	if (lhs != null) {
		return lhs;
	}
	return rhsFn();
}
import { useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import { loginOrRegister } from "~/api";
import { Button } from "~/components/ui/button";

export default function Login(props) {
	const loggingIn = useSubmission(loginOrRegister);

	return (
		<main>
			<h1>Login</h1>
			<form action={loginOrRegister} method="post">
				<input
					type="hidden"
					name="redirectTo"
					value={_nullishCoalesce(props.params.redirectTo, () => "/")}
				/>
				<fieldset>
					<legend>Login or Register?</legend>
					<label>
						<input type="radio" name="loginType" value="login" checked={true} />{" "}
						Login
					</label>
					<label>
						<input type="radio" name="loginType" value="register" /> Register
					</label>
				</fieldset>
				<div>
					<label for="username-input">Username</label>
					<input name="username" placeholder="kody" autocomplete="username" />
				</div>
				<div>
					<label for="password-input">Password</label>
					<input
						name="password"
						type="password"
						placeholder="twixrox"
						autocomplete="current-password"
					/>
				</div>
				<Button
					variant="default"
					type="submit"
					onClick={(e) => {
						e.preventDefault();
					}}
				>
					Login
				</Button>
				<Show when={loggingIn.result}>
					<p style={{ color: "red" }} role="alert" id="error-message">
						{loggingIn.result.message}
					</p>
				</Show>
			</form>
		</main>
	);
}
