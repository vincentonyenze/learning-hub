// Where to send someone after they sign in.
//
// `from` comes from the navigation's state (set by RequireAuth or the
// Sign in link). Only ever go to an address INSIDE this site: an address
// starting with a single "/". Sending people to any address that arrives
// from outside (a link's ?next=https://evil.example) is a classic
// security hole called an "open redirect". State can't come from a link,
// but checking anyway costs one line.
export function afterSignInPath(from) {
  if (!from || typeof from.pathname !== "string") return "/";
  const path = `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
  const isInternal = path.startsWith("/") && !path.startsWith("//");
  // Going back to the sign-in page itself would be pointless
  if (!isInternal || from.pathname === "/sign-in") return "/";
  return path;
}
