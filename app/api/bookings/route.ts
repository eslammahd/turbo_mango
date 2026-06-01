import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { patient_name, patient_phone, session_type, slot_id, notes } = await req.json();
  if (!patient_name || !patient_phone || !slot_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('bookings')
    .insert({ patient_name, patient_phone, session_type: session_type || 'Individual', slot_id, notes: notes || null })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking: data });
}
