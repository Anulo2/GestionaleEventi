 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { createAsync, } from "@solidjs/router";
import { getUser, logout } from "~/api";

export const route = {
  load: () => getUser()
} ;

export default function Home() {
  const user = createAsync(async () => getUser(), { deferStream: true });
  return (
    <main class="w-full p-4 space-y-2">
      <h2 class="font-bold text-3xl">Hello {_optionalChain([user, 'call', _ => _(), 'optionalAccess', _2 => _2.username])}</h2>
      <h3 class="font-bold text-xl">Message board</h3>
      <form action={logout} method="post">
        <button name="logout" type="submit">
          Logout
        </button>
      </form>
    </main>
  );
}
