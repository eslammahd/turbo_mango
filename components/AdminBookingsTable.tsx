'use client';
import { useState } from 'react';
import type { Booking } from '@/lib/types';

const DAY_ORDER = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function formatSlot(booking: Booking) {
  if (!booking.slots) return '—';
  return `${booking.slots.day_of_week} ${booking.slots.start_time}`;
}

export default function AdminBookingsTable({ bookings }: { bookings: Booking[] }) {
  const [data, setData] = useState<Booking[]>(bookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function togglePayment(booking: Booking) {
    const next = booking.payment_status === 'pending' ? 'confirmed' : 'pending';
    setLoadingId(booking.id);
    const res = await fetch('/api/admin/bookings/payment', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: booking.id, payment_status: next }),
    });
    if (res.ok) {
      setData(prev => prev.map(b => b.id === booking.id ? { ...b, payment_status: next } : b));
    }
    setLoadingId(null);
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">
        No bookings yet. Patients will appear here once they book.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Patient</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Phone</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Session</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Slot</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Booked</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(b => (
              <tr key={b.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-slate-800">{b.patient_name}</td>
                <td className="px-4 py-3 text-slate-600">{b.patient_phone}</td>
                <td className="px-4 py-3 text-slate-600">{b.session_type}</td>
                <td className="px-4 py-3 text-slate-600">{formatSlot(b)}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(b.created_at).toLocaleDateString('en-GB')}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePayment(b)}
                    disabled={loadingId === b.id}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition disabled:opacity-50 ${
                      b.payment_status === 'confirmed'
                        ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {loadingId === b.id ? '…' : b.payment_status === 'confirmed' ? 'Confirmed ✓' : 'Pending — Mark Confirmed'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
