import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error("Erreur Webhook Signature:", error.message);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  // Gérer l'événement Stripe Checkout réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Ici on enregistrerait la commande validée dans la base de données Supabase
    // Exemple : await supabase.from('orders').insert({ ... })
    
    console.log("Paiement réussi pour la session:", session.id);
    console.log("Détails du produit (metadata):", session.metadata);
  }

  return NextResponse.json({ received: true });
}
