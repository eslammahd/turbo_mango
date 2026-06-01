'use client';

import { useState } from 'react';
import { Slot } from './BookingPage';

type Props = {
  slot: Slot;
  onSubmit: (data: { name: string; phone: string; sessionType: string }) => void;
  onBack: () => void;
};

const SESSION_TYPES = [
  'Individual Therapy',
  'Couples Therapy',
  'Anxiety & Stress',
  'Depression Support',
  'Relationship Issues',
  'General Consultation',
];

export default function IntakeForm({ slot, onSubmit, onBack }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please enter your full name.';
    if (!phone.trim()) e.phone = 'Please enter your phone number.';
    else if (!/^[0-9+\s\-]{7,15}$/.test(phone.trim())) e.phone = 'Please enter a valid Egyptian phone number.';
    if (!sessionType) e.sessionType = 'Please select a session type.';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ name: name.trim(), phone: phone.trim(), sessionType });
  }

  return (
    <div>
      <button onClick={onBack} className="text-sm text-teal-600 hover:underline mb-4 flex items-center gap-1">
        &#8592; Back to slots
      </button>

      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-teal-700">Booking for: <span className="font-semibold">{slot.label}</span></p>
      </div>

      <h2 className="text-2xl font-bold text-teal-800 mb-1">Your Details</h2>
      <p className="text-gray-500 mb-6 text-sm">We&apos;ll use this to confirm your session.</p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ahmed Hassan"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 01012345678"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">Select a session type...</option>
            {SESSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.sessionType && <p className="text-red-500 text-xs mt-1">{errors.sessionType}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl py-3 transition-colors text-sm"
        >
          Confirm Booking &rarr;
        </button>
      </form>
    </div>
  );
}
