import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Redirige toute requête directe sur /admin vers la vue correspondante de la SPA
  if (path === '/admin' || path.startsWith('/admin/')) {
    const subRoute = path.replace(/^\/admin\/?/, '');
    const targetHash = subRoute ? `#/admin/${subRoute}` : '#/admin';
    return NextResponse.redirect(new URL(`/${targetHash}`, request.url));
  }

  return NextResponse.next();
}

// Configurer le middleware pour qu'il ne s'applique qu'aux routes /admin
export const config = {
  matcher: '/admin/:path*',
};
