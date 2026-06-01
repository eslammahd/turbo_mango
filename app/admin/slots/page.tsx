import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import type { Slot } from '@/lib/types';
import AdminSlotsManager from '@/components/AdminSlotsManager';

export const dynamic = 'force-dynamic';

export default async function SlotsPage() {
  const { data: slots, error } = await supabaseAdmin
    .from('slots')
    .select('*')
    .order('day_of_week')
    .order('start_time');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Manage Slots</h1>
            <p className="text-sm text-slate-500">Add or remove available time slots</p>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">
            Could not load slots. Database may not be set up yet.
          </div>
        ) : (
          <AdminSlotsManager slots={slots ?? []} />
        )}
      </main>
    </div>
  );
}
