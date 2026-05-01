import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Configuration admin manquante côté serveur." }, { status: 500 });
    }

    if (password === adminPassword) {
      // Le mot de passe est correct, on set le cookie (valable 1 semaine)
      const cookieStore = await cookies();
      cookieStore.set('admin_token', adminPassword, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 semaine
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
