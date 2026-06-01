export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface Slot {
  id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  patient_name: string;
  patient_phone: string;
  session_type: string;
  slot_id: string;
  payment_status: 'pending' | 'confirmed';
  notes: string | null;
  created_at: string;
  slots?: Slot;
}
