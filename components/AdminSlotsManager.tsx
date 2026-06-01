'use client';
import { useState } from 'react';
import type { Slot, DayOfWeek } from '@/lib/types';

const DAYS: DayOfWeek[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const TIMES = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

export default function AdminSlotsManager({ slots: initial }: { slots: Slot[] }) {
  const [slots, setSlots] = useState<Slot[]>(initial);
  const [newDay, setNewDay] = useState<DayOfWeek>('Sunday');
  const [newTime, setNewTime] = useState('10:00');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function addSlot() {
    setAdding(true);
    setError('');
    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day_of_week: newDay, start_time: newTime }),
    });
    if (res.ok) {
      const { slot } = await res.json();
      setSlots(prev => [...prev, slot]);
    } else {
      const body = await res.json();
      setError(body.error ?? 'Failed to add slot');
    }
    setAdding(false);
  }

  async function deleteSlot(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin/slots?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSlots(prev => prev.filter(s => s.id !== id));
    }
    setDeletingId(null);
  }

  const grouped = DAYS.reduce<Record<string, Slot[]>>((acc, day) => {
    acc[day] = slots.filter(s => s.day_of_week === day);
    return acc;
  }, {} as Record<string, Slot[]>);

  return (
    <div className="space-y-6">
      {/* Add slot form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Add New Slot</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Day</label>
            <select
              value={newDay}
              onChange={e => setNewDay(e.target.value as DayOfWeek)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Time</label>
            <select
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {TIMES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button
            onClick={addSlot}
            disabled={adding}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50"
          >
            {adding ? 'Adding…' : '+ Add Slot'}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      {/* Slots list */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAYS.map(day => (
          <div key={day} className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-700 mb-3">{day}</h3>
            {grouped[day].length === 0 ? (
              <p className="text-sm text-slate-400">No slots</p>
            ) : (
              <div className="space-y-2">
                {grouped[day]
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map(slot => (
                    <div key={slot.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-slate-700">{slot.start_time}</span>
                      <button
                        onClick={() => deleteSlot(slot.id)}
                        disabled={deletingId === slot.id}
                        className="text-red-400 hover:text-red-600 transition text-xs font-medium disabled:opacity-50"
                      >
                        {deletingId === slot.id ? '…' : 'Remove'}
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
