// src/app/api/verify-payment/route.js

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const paymentIntentId = url.searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      throw new Error('Payment Intent ID is missing');
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const orderId = paymentIntent.metadata.order_id;
      const userId = paymentIntent.metadata.user_id;

      // Оновлюємо статус замовлення
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId)
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      // Якщо є користувач, оновлюємо його профіль (бали + лічильник замовлень)
      if (userId && orderData) {
        const pointsToAdd = Math.floor(orderData.total_price);
        
        if (pointsToAdd >= 0) { // Нараховуємо, навіть якщо 0 (для оновлення лічильника)
          
          // ▼▼▼ ВИКЛИКАЄМО НАШУ НОВУ ФУНКЦІЮ ▼▼▼
          const { error: profileUpdateError } = await supabase.rpc('update_profile_after_order', {
            user_id_input: userId,
            points_to_add: pointsToAdd,
          });
          
          if (profileUpdateError) throw new Error(profileUpdateError.message);
        }
      }
      return NextResponse.json({ status: 'success' });
    } else {
      return NextResponse.json({ status: 'failed' });
    }
  } catch (error) {
    console.error('Verification error:', error.message);
    return NextResponse.json({ status: 'failed', error: error.message }, { status: 500 });
  }
}