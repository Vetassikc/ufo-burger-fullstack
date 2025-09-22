// src/app/api/create-stripe-session/route.js

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    // 1. Отримуємо user_id з тіла запиту
    const { order_items, total_price, user_id, ...formData } = await req.json();

    // 2. Створюємо замовлення у Supabase, передаючи user_id
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([
        { 
          customer_name: formData.name, // Виправляємо помилку: було formData.customer_name
          customer_phone: formData.phone, // Виправляємо помилку: було formData.customer_phone
          delivery_address: formData.address, // Виправляємо помилку: було formData.delivery_address
          total_price: total_price,
          status: 'pending',
          order_items: order_items,
          user_id: user_id, // <-- Ось наше нове поле
        }
      ])
      .select();
      
    if (orderError) {
      console.error('Error creating order in Supabase:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const orderId = newOrder[0].id;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total_price * 100),
      currency: 'chf',
      metadata: {
        order_id: orderId,
        user_id: user_id, // <-- Також передаємо в Stripe на всяк випадок
      },
      payment_method_types: ['card', 'paypal'],
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderId,
    }, { status: 200 });

  } catch (error) {
    console.error('Payment Intent creation failed:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}