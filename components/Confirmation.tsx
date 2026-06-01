'use client';

import { BookingData } from './BookingPage';

type Props = { booking: BookingData; onStartOver: () => void };

export default function Confirmation({ booking, onStartOver }: Props) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-teal-800">Session Requested!</h2>
        <p className="text-gray-500 text-sm mt-1">Dr. Saad will confirm after payment is received.</p>
      </div>

      {/* Booking Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Patient</span>
            <span className="font-medium">{booking.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phone</span>
            <span className="font-medium">{booking.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Session</span>
            <span className="font-medium">{booking.sessionType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time Slot</span>
            <span className="font-medium text-teal-700">{booking.slot.label}</span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="space-y-4 mb-8">
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Complete Payment</h3>
        <p className="text-sm text-gray-500">Pay the session fee using one of the methods below, then wait for Dr. Saad to send you the session link.</p>

        {/* Instapay */}
        <div className="bg-white rounded-2xl border-2 border-blue-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
            <div>
              <p className="font-semibold text-gray-800">Instapay</p>
              <p className="text-xs text-gray-400">Bank transfer via Instapay</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 mb-0.5">Send to</p>
            <p className="font-bold text-blue-800 text-lg tracking-wider">dr.saad.elmahdy</p>
          </div>
          <p className="text-xs text-gray-400 mt-2">Include your name and booked slot in the transfer note.</p>
        </div>

        {/* Vodafone Cash */}
        <div className="bg-white rounded-2xl border-2 border-red-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              VC
            </div>
            <div>
              <p className="font-semibold text-gray-800">Vodafone Cash</p>
              <p className="text-xs text-gray-400">Mobile wallet transfer</p>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 mb-0.5">Send to</p>
            <p className="font-bold text-red-800 text-lg tracking-wider">01012345678</p>
          </div>
          <p className="text-xs text-gray-400 mt-2">Include your name and booked slot in the transfer note.</p>
        </div>
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-teal-700">&#9200; After payment, Dr. Saad will contact you via phone to confirm your session and send the online meeting link.</p>
      </div>

      <button
        onClick={onStartOver}
        className="w-full border border-teal-200 text-teal-700 hover:bg-teal-50 font-medium rounded-xl py-3 text-sm transition-colors"
      >
        Book another session
      </button>
    </div>
  );
}
