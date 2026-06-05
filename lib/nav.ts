/**
 * Whether a top-nav href should render as the active route. The directory (`/`)
 * owns the app-detail pages (`/apps/*`); About owns the portfolio
 * (`/portfolio/*`). Everything else matches by path prefix.
 */
export function isActiveNav(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/apps");
  if (href === "/about") return pathname.startsWith("/about") || pathname.startsWith("/portfolio");
  return pathname.startsWith(href);
}
