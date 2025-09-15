import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is missing' }, { status: 400 });
    }

    // Отримуємо дані сесії зі Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Перевіряємо, чи була оплата успішною
    if (session.payment_status === 'paid') {
      const orderId = session.metadata.order_id;
      
      // Оновлюємо статус замовлення в Supabase на "completed"
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status in Supabase:', error);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
      }

      return NextResponse.json({ status: 'success', message: 'Payment confirmed and order updated.' }, { status: 200 });

    } else {
      // Якщо платіж не успішний, статус замовлення залишається 'pending'
      return NextResponse.json({ status: 'failed', message: 'Payment was not successful.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}