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

    // 2. Створюємо товари для Stripe-сесії
    const lineItems = order_items.map(item => ({
      price_data: {
        currency: 'chf',
        product_data: {
          name: item.name,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100), // Ціна в сантимах
      },
      quantity: item.quantity,
    }));

    // 3. Створюємо Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      metadata: {
        order_id: orderId, // Передаємо ID замовлення, створеного в Supabase
      },
    });

    return NextResponse.json(session, { status: 200 });

  } catch (error) {
    console.error('Stripe session creation failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}