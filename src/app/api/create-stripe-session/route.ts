// src/app/api/create-stripe-session/route.ts

import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';
import { CartItem } from '@/context/CartContext'; // Припускаємо, що CartItem експортується

// --- Інтерфейси ---

// Тип для тіла запиту, який ми очікуємо від клієнта
interface RequestBody {
  order_items: CartItem[];
  total_price: number;
  user_id: string | null;
  points_to_use: number;
  name: string;
  phone: string;
  address: string;
}

// Тип для даних, які ми вставляємо в таблицю 'orders'
interface OrderInsert {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_price: number;
  status: 'pending' | 'succeeded'; // Або інші статуси, які у вас є
  order_items: CartItem[];
  user_id: string | null;
}

// --- Ініціалізація Stripe ---

// 1. Чітко типізуємо ключ як string
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// --- Обробник POST ---

// 2. Типізуємо 'req' як NextRequest
export async function POST(req: NextRequest) {
  try {
    // 3. Типізуємо тіло запиту
    const { 
      order_items, 
      total_price, 
      user_id, 
      points_to_use, 
      name, 
      phone, 
      address 
    } = await req.json() as RequestBody;

    // 4. Типізуємо об'єкт для Supabase
    const orderToInsert: OrderInsert = {
      customer_name: name,
      customer_phone: phone,
      delivery_address: address,
      total_price: total_price,
      status: 'pending', // Початковий статус
      order_items: order_items,
      user_id: user_id,
    };

    // 5. Типізуємо відповідь від Supabase
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([orderToInsert])
      .select('id') // Вибираємо лише 'id'
      .single<{ id: number }>(); // Очікуємо один об'єкт з 'id'
      
    if (orderError || !newOrder) {
      console.error('Error creating order in Supabase:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const orderId = newOrder.id;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total_price * 100), // Конвертуємо в центи/рапени
      currency: 'chf',
      metadata: {
        order_id: orderId,
        user_id: user_id || 'guest', // Stripe metadata не любить 'null'
        points_to_use: points_to_use || 0,
      },
      payment_method_types: ['card', 'paypal'], // Як у .js файлі
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderId,
    }, { status: 200 });

  } catch (error: any) { // 6. Типізуємо помилку
    console.error('Payment Intent creation failed:', error);
    // Повертаємо помилку у форматі, який очікує клієнт
    return NextResponse.json({ error: { message: error.message || 'Internal Server Error' } }, { status: 500 });
  }
}