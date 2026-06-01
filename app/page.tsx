'use client';
import { useState, useEffect, FormEvent } from 'react';

type Slot = {
  id: string;
  day_of_week: string;
  start_time: string;
  is_available: boolean;
};

type Step = 'slots' | 'details' | 'confirm';

const DAY_ORDER = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function BookingPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('slots');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sessionType, setSessionType] = useState('Individual');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetch('/api/slots')
      .then(r => r.json())
      .then(data => { setSlots(data.slots ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const grouped = DAY_ORDER.reduce<Record<string, Slot[]>>((acc, day) => {
    const daySlots = slots.filter(s => s.day_of_week === day);
    if (daySlots.length) acc[day] = daySlots;
    return acc;
  }, {});

  async function handleBooking(e: FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setSubmitError('');
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: name,
        patient_phone: phone,
        session_type: sessionType,
        slot_id: selectedSlot.id,
        notes,
      }),
    });
    if (res.ok) {
      setStep('confirm');
    } else {
      const body = await res.json();
      setSubmitError(body.error ?? 'Something went wrong. Please try again.');
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-5 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Dr. Saad El Mahdy</h1>
          <p className="text-slate-500 text-sm mt-1">Online Therapy Sessions • Book Your Appointment</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Step indicator */}
        {step !== 'confirm' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {(['slots','details'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s ? 'bg-teal-600 text-white' :
                  (step === 'details' && s === 'slots') ? 'bg-teal-200 text-teal-700' :
                  'bg-slate-200 text-slate-500'
                }`}>{i + 1}</div>
                <span className={`text-xs font-medium ${step === s ? 'text-teal-700' : 'text-slate-400'}`}>
                  {s === 'slots' ? 'Choose Slot' : 'Your Details'}
                </span>
                {i === 0 && <div className="w-8 h-px bg-slate-300 mx-1" />}
              </div>
            ))}
          </div>
        )}

        {/* ---- STEP 1: Slots ---- */}
        {step === 'slots' && (
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-5">Available Time Slots</h2>
            {loading ? (
              <div className="text-center py-16 text-slate-400">Loading available slots…</div>
            ) : Object.keys(grouped).length === 0 ? (
              <div className="text-center py-16 text-slate-400">No slots available at the moment. Please check back soon.</div>
            ) : (
              <div className="space-y-5">
                {DAY_ORDER.filter(d => grouped[d]).map(day => (
                  <div key={day}>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{day}</h3>
                    <div className="flex flex-wrap gap-2">
                      {grouped[day].map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => { setSelectedSlot(slot); setStep('details'); }}
                          className="bg-white border border-teal-200 hover:border-teal-500 hover:bg-teal-50 text-teal-700 font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
                        >
                          {slot.start_time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- STEP 2: Details ---- */}
        {step === 'details' && selectedSlot && (
          <div>
            <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-teal-800">
                {selectedSlot.day_of_week} at {selectedSlot.start_time}
              </span>
              <button onClick={() => setStep('slots')} className="ml-auto text-xs text-teal-600 hover:underline">Change</button>
            </div>

            <h2 className="text-lg font-semibold text-slate-700 mb-5">Your Details</h2>
            <form onSubmit={handleBooking} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="e.g. Ahmed Hassan"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  placeholder="e.g. 01012345678"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Session Type</label>
                <select
                  value={sessionType}
                  onChange={e => setSessionType(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>Individual</option>
                  <option>Couples</option>
                  <option>Family</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Anything you'd like the doctor to know before the session"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 text-base"
              >
                {submitting ? 'Booking…' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        )}

        {/* ---- STEP 3: Confirmation ---- */}
        {step === 'confirm' && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-9 h-9 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Received!</h2>
            <p className="text-slate-500 mb-1">Thank you, <span className="font-medium text-slate-700">{name}</span>.</p>
            {selectedSlot && (
              <p className="text-slate-500 mb-8">Your slot: <span className="font-medium text-slate-700">{selectedSlot.day_of_week} at {selectedSlot.start_time}</span></p>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-left mb-6">
              <h3 className="font-bold text-amber-800 text-base mb-4">💳 Please Pay to Confirm Your Session</h3>
              <p className="text-sm text-amber-700 mb-5">Send the session fee using one of the methods below, then WhatsApp Dr. Saad with a screenshot to confirm your spot.</p>

              <div className="space-y-4">
                {/* Instapay */}
                <div className="bg-white rounded-xl border border-amber-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🏦</span>
                    <span className="font-semibold text-slate-800">Instapay</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Account / IPA</p>
                      <p className="font-mono font-bold text-teal-700 text-lg">dr.saad.elmahdy</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText('dr.saad.elmahdy')}
                      className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg transition font-medium"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Vodafone Cash */}
                <div className="bg-white rounded-xl border border-amber-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📱</span>
                    <span className="font-semibold text-slate-800">Vodafone Cash</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Phone Number</p>
                      <p className="font-mono font-bold text-teal-700 text-lg">01012345678</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText('01012345678')}
                      className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg transition font-medium"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 bg-amber-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-800 mb-1">💬 After you pay:</p>
                <p className="text-sm text-amber-700">Send a WhatsApp message with your payment screenshot to confirm your appointment. Dr. Saad will reply with the video call link.</p>
              </div>
            </div>

            <button
              onClick={() => { setStep('slots'); setSelectedSlot(null); setName(''); setPhone(''); setNotes(''); }}
              className="text-sm text-teal-600 hover:underline"
            >
              Book another appointment
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
