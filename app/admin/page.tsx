import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import type { Booking } from '@/lib/types';
import AdminBookingsTable from '@/components/AdminBookingsTable';
import AdminLogout from '@/components/AdminLogout';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .select('*, slots(*)')
    .order('created_at', { ascending: false });

  const pending = (bookings ?? []).filter((b: Booking) => b.payment_status === 'pending').length;
  const confirmed = (bookings ?? []).filter((b: Booking) => b.payment_status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Dr. Saad El Mahdy</h1>
            <p className="text-sm text-slate-500">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/slots" className="text-sm text-teal-600 hover:underline font-medium">Manage Slots</Link>
            <AdminLogout />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Total Bookings</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{(bookings ?? []).length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Pending Payment</p>
            <p className="text-3xl font-bold text-amber-500 mt-1">{pending}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Confirmed</p>
            <p className="text-3xl font-bold text-teal-600 mt-1">{confirmed}</p>
          </div>
        </div>

        {/* Bookings table */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">
            Could not load bookings. Database may not be set up yet.
          </div>
        ) : (
          <AdminBookingsTable bookings={bookings ?? []} />
        )}
      </main>
    </div>
  );
}
