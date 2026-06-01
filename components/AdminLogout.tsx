'use client';
import { useRouter } from 'next/navigation';

export default function AdminLogout() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }
  return (
    <button onClick={logout} className="text-sm text-slate-500 hover:text-red-600 transition">
      Sign out
    </button>
  );
}
