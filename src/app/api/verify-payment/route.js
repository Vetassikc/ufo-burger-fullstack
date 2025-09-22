// src/app/api/verify-payment/route.js

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  console.log("\n--- [API /verify-payment] Отримано запит ---");
  try {
    const url = new URL(req.url);
    const paymentIntentId = url.searchParams.get('payment_intent_id');
    console.log(`1. Отримано Payment Intent ID: ${paymentIntentId}`);

    if (!paymentIntentId) {
      throw new Error('Payment Intent ID відсутній');
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("2. Отримано дані від Stripe.");

    if (paymentIntent.status === 'succeeded') {
      console.log("3. Статус платежу: 'succeeded'.");
      const orderId = paymentIntent.metadata.order_id;
      const userId = paymentIntent.metadata.user_id;
      console.log(`4. Зчитано метадані: orderId=${orderId}, userId=${userId}`);

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId)
        .select()
        .single();

      if (orderError) throw new Error(`Помилка оновлення замовлення в Supabase: ${orderError.message}`);
      console.log("5. Статус замовлення оновлено на 'completed'.");

      if (userId && orderData) {
        console.log("6. Умови для нарахування балів виконано (є userId та дані замовлення).");
        const pointsToAdd = Math.floor(orderData.total_price);
        console.log(`7. Розраховано балів для нарахування: ${pointsToAdd}`);

        if (pointsToAdd > 0) {
          console.log(`8. Викликаємо функцію 'increment_points' для користувача ${userId} з ${pointsToAdd} балами.`);
          const { error: pointsError } = await supabase.rpc('increment_points', {
            user_id_input: userId,
            points_to_add: pointsToAdd,
          });

          if (pointsError) throw new Error(`Помилка нарахування балів в Supabase: ${pointsError.message}`);
          console.log("✅ 9. Бали успішно нараховано!");
        } else {
          console.log("Пропускаємо нарахування, оскільки сума балів 0 або менше.");
        }
      } else {
        console.log("⚠️ Пропускаємо нарахування балів. Причина: відсутній userId або дані замовлення.", { userId: userId, hasOrderData: !!orderData });
      }
      return NextResponse.json({ status: 'success' });
    } else {
      console.log(`Статус платежу: '${paymentIntent.status}'. Бали не нараховано.`);
      return NextResponse.json({ status: 'failed' });
    }
  } catch (error) {
    console.error('🔴 [API /verify-payment] КРИТИЧНА ПОМИЛКА:', error.message);
    return NextResponse.json({ status: 'failed', error: error.message }, { status: 500 });
  }
}