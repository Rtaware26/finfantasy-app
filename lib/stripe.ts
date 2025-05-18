import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createCompetitionCheckoutSession({
  competitionId,
  userId,
  entryFee,
  competitionName,
}: {
  competitionId: string;
  userId: string;
  entryFee: number;
  competitionName: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Entry Fee - ${competitionName}`,
            description: 'Competition entry fee',
          },
          unit_amount: entryFee * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/competitions/${competitionId}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/competitions/${competitionId}`,
    metadata: {
      competitionId,
      userId,
    },
  });

  return session;
} 