import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { order_items, total_price, ...formData } = await req.json();

    // 1. Створюємо замовлення у Supabase зі статусом 'pending'
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([
        { 
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          delivery_address: formData.delivery_address,
          total_price: total_price,
          status: 'pending', // Встановлюємо статус "очікує"
          order_items: order_items,
        }
      ])
      .select();
      
    if (orderError) {
      console.error('Error creating order in Supabase:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const orderId = newOrder[0].id;

    // 2. Створюємо Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total_price * 100), // Сума в сантимах
      currency: 'chf',
      metadata: {
        order_id: orderId,
      },
      // Зараз ми залишаємо тільки "card" та "paypal"
      payment_method_types: ['card', 'paypal'],
    });

    // 3. Повертаємо клієнту секрет Payment Intent та ID замовлення
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderId,
    }, { status: 200 });

  } catch (error) {
    console.error('Payment Intent creation failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}