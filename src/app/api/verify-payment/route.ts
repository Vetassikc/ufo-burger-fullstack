// src/app/api/verify-payment/route.ts

import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

// --- Ініціалізація Stripe ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// --- Інтерфейси ---

// Тіло запиту, яке ми очікуємо від OrderSuccessContent.tsx
interface VerifyRequest {
  order_id: string; // <-- ВИПРАВЛЕННЯ: Очікуємо string, а не number
  client_secret: string;
}

// Тип для замовлення, яке ми оновлюємо
interface OrderUpdate {
  id: number;
  total_price: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Отримуємо дані з тіла POST-запиту
    const { order_id, client_secret } = (await req.json()) as VerifyRequest;

    if (!order_id || !client_secret) {
      throw new Error('Відсутні ID замовлення або client_secret');
    }

    // 2. Отримуємо ID платіжного наміру (Payment Intent ID) з client_secret
    const paymentIntentId = client_secret.split('_secret_')[0];

    if (!paymentIntentId) {
      throw new Error('Недійсний client_secret');
    }

    // 3. Отримуємо PaymentIntent від Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // 4. Перевіряємо статус
    if (paymentIntent.status === 'succeeded') {
      // orderId з metadata - це string
      const orderId = paymentIntent.metadata.order_id; 
      
      // ▼▼▼ ОСЬ ВИПРАВЛЕННЯ ▼▼▼
      // Переконуємось, що ID збігаються (порівнюємо string зі string)
      // order_id з тіла запиту - це теж string
      if (orderId !== order_id) { 
         throw new Error(`Невідповідність ID замовлення. (Metadata: ${orderId}, Param: ${order_id})`);
      }
      // ▲▲▲ КІНЕЦЬ ВИПРАВЛЕННЯ ▲▲▲

      const userId = paymentIntent.metadata.user_id;
      const pointsToUse = parseInt(paymentIntent.metadata.points_to_use || '0', 10);

      // 5. Оновлюємо статус замовлення в Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .update({ status: 'succeeded' })
        .eq('id', orderId) // Supabase коректно обробить string 'id'
        .select('id, total_price')
        .single<OrderUpdate>();

      if (orderError) throw new Error(orderError.message);

      // 6. Оновлюємо бали та лічильник замовлень користувача
      if (userId && userId !== 'guest' && orderData) {
        const pointsToAdd = Math.floor(orderData.total_price);
        
        const { error: profileUpdateError } = await supabase.rpc('update_profile_after_order', {
          user_id_input: userId,
          points_to_add: pointsToAdd,
          points_to_subtract: pointsToUse,
        });
          
        if (profileUpdateError) throw new Error(profileUpdateError.message);
      }
      
      return NextResponse.json({ success: true, message: 'Платіж верифіковано' });
    } else {
      return NextResponse.json({ success: false, message: `Статус платежу: ${paymentIntent.status}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Verification error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}