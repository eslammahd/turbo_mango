import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(req: NextRequest) {
  const { id, payment_status } = await req.json();
  if (!id || !['pending','confirmed'].includes(payment_status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { error } = await supabaseAdmin
    .from('bookings')
    .update({ payment_status })
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
