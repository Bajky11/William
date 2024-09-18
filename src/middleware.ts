import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

// Funkce middleware
export default function middleware(req: NextRequest) {


    /*
    return NextResponse.redirect(new URL('/login', req.url));

    // Získání tokenu nebo stavu přihlášení
    console.log(req.cookies)
    const token = req.cookies.get('token'); // Například z cookies, kde máte uložený token

    const {pathname} = req.nextUrl;

    // Pokud není uživatel přihlášený a není na stránce /login
    if (!token && pathname !== '/login') {
        // Přesměrujte na /login
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Pokud uživatel přihlášený je nebo je na stránce /login, pokračujte normálně
    return NextResponse.next();
     */
}

export const config = {
    // Určení, které cesty budou middleware zpracovány
    matcher: ['/'],
};
