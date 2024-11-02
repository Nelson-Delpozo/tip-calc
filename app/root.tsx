import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stylesheet from "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Freckle+Face&family=Hanalei+Fill&family=Stint+Ultra+Condensed&display=swap"
          rel="stylesheet"
        ></link>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-green-50">
        <header className="w-full bg-green-50 mb-5">
          <nav className="container mx-auto flex justify-center items-center py-5 max-w-screen-lg">
            <h2 className="font-freckle text-green-700 text-5xl font-bold">the TIP-MATE</h2>
          </nav>
        </header>
        <Outlet />
        {/* Footer */}
        <footer className="font-freckle bg-green-50 text-center text-green-700">
          <p className="text-lg">&copy; {new Date().getFullYear()} the TIP-MATE. All rights reserved</p>
          <p className="text-lg">for Michelle at Flanigan&apos;s Wellington</p>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
