import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { day_of_week, start_time } = await req.json();
  if (!day_of_week || !start_time) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  // Check for duplicate
  const { data: existing } = await supabaseAdmin
    .from('slots')
    .select('id')
    .eq('day_of_week', day_of_week)
    .eq('start_time', start_time)
    .single();
  if (existing) {
    return NextResponse.json({ error: 'This slot already exists.' }, { status: 409 });
  }
  const { data: slot, error } = await supabaseAdmin
    .from('slots')
    .insert({ day_of_week, start_time, is_available: true })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slot });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabaseAdmin.from('slots').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
