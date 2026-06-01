'use client';

import { useState } from 'react';
import SlotGrid from './SlotGrid';
import IntakeForm from './IntakeForm';
import Confirmation from './Confirmation';

export type Slot = {
  id: string;
  day: string;
  time: string;
  label: string;
};

export type BookingData = {
  name: string;
  phone: string;
  sessionType: string;
  slot: Slot;
};

export default function BookingPage() {
  const [step, setStep] = useState<'slots' | 'form' | 'confirm'>('slots');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);

  function handleSlotSelect(slot: Slot) {
    setSelectedSlot(slot);
    setStep('form');
  }

  function handleFormSubmit(data: { name: string; phone: string; sessionType: string }) {
    if (!selectedSlot) return;
    const bookingData: BookingData = { ...data, slot: selectedSlot };
    setBooking(bookingData);
    setStep('confirm');
  }

  function handleStartOver() {
    setStep('slots');
    setSelectedSlot(null);
    setBooking(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            SE
          </div>
          <div>
            <h1 className="text-xl font-bold text-teal-800">Dr. Saad El Mahdy</h1>
            <p className="text-sm text-gray-500">Licensed Therapist &bull; Online Sessions &bull; Egypt</p>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 text-sm">
          <span className={`font-medium ${step === 'slots' ? 'text-teal-700' : 'text-gray-400'}`}>1. Choose Slot</span>
          <span className="text-gray-300">/</span>
          <span className={`font-medium ${step === 'form' ? 'text-teal-700' : 'text-gray-400'}`}>2. Your Details</span>
          <span className="text-gray-300">/</span>
          <span className={`font-medium ${step === 'confirm' ? 'text-teal-700' : 'text-gray-400'}`}>3. Confirm & Pay</span>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {step === 'slots' && <SlotGrid onSelect={handleSlotSelect} />}
        {step === 'form' && selectedSlot && (
          <IntakeForm slot={selectedSlot} onSubmit={handleFormSubmit} onBack={() => setStep('slots')} />
        )}
        {step === 'confirm' && booking && (
          <Confirmation booking={booking} onStartOver={handleStartOver} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 pb-8 mt-4">
        &copy; {new Date().getFullYear()} Dr. Saad El Mahdy. All rights reserved.
      </footer>
    </div>
  );
}
