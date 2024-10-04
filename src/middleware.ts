import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Kontrola, jestli uživatel není přihlášen (tvá logika ověřování)
    const loggedIn = false;

    // Přesměrování na /login, pokud uživatel není přihlášen a je na kořenové URL
    if (pathname === '/') {
        if (!loggedIn) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'], // Spustí middleware na kořenové URL '/'
};
