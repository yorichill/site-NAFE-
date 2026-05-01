import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-04-22.dahlia',
});

export async function POST(request: Request) {
  try {
    const { productId, name, price, size } = await request.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Clé secrète Stripe non configurée." }, { status: 500 });
    }

    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${name} (Taille: ${size})`,
              metadata: {
                productId,
                size
              }
            },
            unit_amount: Math.round(price * 100), // Stripe prend les montants en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/?cancel=true`,
      metadata: {
        productId,
        size
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erreur Checkout Stripe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
