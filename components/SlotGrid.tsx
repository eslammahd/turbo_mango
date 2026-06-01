'use client';

import { Slot } from './BookingPage';

const STATIC_SLOTS: Slot[] = [
  { id: 's1', day: 'Sunday', time: '10:00 AM', label: 'Sunday, 10:00 AM' },
  { id: 's2', day: 'Sunday', time: '11:00 AM', label: 'Sunday, 11:00 AM' },
  { id: 's3', day: 'Sunday', time: '12:00 PM', label: 'Sunday, 12:00 PM' },
  { id: 's4', day: 'Monday', time: '06:00 PM', label: 'Monday, 6:00 PM' },
  { id: 's5', day: 'Monday', time: '07:00 PM', label: 'Monday, 7:00 PM' },
  { id: 's6', day: 'Tuesday', time: '05:00 PM', label: 'Tuesday, 5:00 PM' },
  { id: 's7', day: 'Tuesday', time: '06:00 PM', label: 'Tuesday, 6:00 PM' },
  { id: 's8', day: 'Wednesday', time: '10:00 AM', label: 'Wednesday, 10:00 AM' },
  { id: 's9', day: 'Thursday', time: '07:00 PM', label: 'Thursday, 7:00 PM' },
  { id: 's10', day: 'Thursday', time: '08:00 PM', label: 'Thursday, 8:00 PM' },
];

const DAYS_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type Props = { onSelect: (slot: Slot) => void };

export default function SlotGrid({ onSelect }: Props) {
  const grouped = DAYS_ORDER.reduce<Record<string, Slot[]>>((acc, day) => {
    const daySlots = STATIC_SLOTS.filter((s) => s.day === day);
    if (daySlots.length > 0) acc[day] = daySlots;
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-bold text-teal-800 mb-1">Available Sessions</h2>
      <p className="text-gray-500 mb-6 text-sm">All sessions are conducted online. Choose a weekly slot that works for you.</p>

      <div className="space-y-6">
        {Object.entries(grouped).map(([day, slots]) => (
          <div key={day}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">{day}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => onSelect(slot)}
                  className="bg-white border-2 border-teal-100 hover:border-teal-500 hover:bg-teal-50 rounded-xl p-4 text-left transition-all group shadow-sm"
                >
                  <p className="text-teal-700 font-semibold text-sm group-hover:text-teal-800">{slot.time}</p>
                  <p className="text-xs text-gray-400 mt-1">1 hour &bull; Online</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-teal-50 rounded-xl border border-teal-100">
        <p className="text-sm text-teal-700 font-medium">&#128204; Session fee is paid offline after booking via Instapay or Vodafone Cash.</p>
      </div>
    </div>
  );
}
