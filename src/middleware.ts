import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    console.log("Middleware was called for:", request.url);
    return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
    matcher: '/test/:path*',
};


/*
// Funkce middleware
export default function middleware(req) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);


    // Získání tokenu nebo stavu přihlášení
    const token = req.cookies.get('token'); // Například z cookies, kde máte uložený token
    console.log("middleware")

    const { pathname } = req.nextUrl;

    // Pokud není uživatel přihlášený a není na stránce /login
    if (!token && pathname !== '/login') {
        // Přesměrujte na /login
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Pokud uživatel přihlášený je nebo je na stránce /login, pokračujte normálně
    return NextResponse.next();


}

export const config = {
    // Určení, které cesty budou middleware zpracovány
    matcher: ['/index', '/mainPage', '/items/:path*', '/app','/test'],
};
*/
