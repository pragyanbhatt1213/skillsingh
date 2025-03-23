// Disable middleware completely to fix login loop issue
export function middleware() {
  // No-op middleware to prevent redirection loops
  return;
}

export const config = {
  matcher: [],
};