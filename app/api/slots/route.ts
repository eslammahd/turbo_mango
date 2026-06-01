import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('slots')
    .select('*')
    .eq('is_available', true)
    .order('day_of_week')
    .order('start_time');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slots: data });
}
