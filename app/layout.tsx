import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dr. Saad El Mahdy — Online Therapy',
  description: 'Book an online therapy session with Dr. Saad El Mahdy. Serving patients in Egypt via Instapay & Vodafone Cash.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans text-gray-800 antialiased">{children}</body>
    </html>
  );
}
