import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Si on essaie d'accéder à l'espace admin (sauf la page de login)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const adminToken = request.cookies.get('admin_token')?.value;
    
    // Si le token est absent ou invalide, on redirige vers le login
    if (!adminToken || adminToken !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Si on est sur la page de login et qu'on a déjà un token valide, on redirige vers l'admin
  if (path === '/admin/login') {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken && adminToken === process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/shop', request.url));
    }
  }

  return NextResponse.next();
}

// Configurer le middleware pour qu'il ne s'applique qu'aux routes /admin
export const config = {
  matcher: '/admin/:path*',
};
