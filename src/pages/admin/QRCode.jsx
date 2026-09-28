import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function QRCodePage() {
  const [qr, setQr] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/admin/login');
      return;
    }

    let cancelled = false;

    const fetchQR = async () => {
      try {
        const { data } = await API.get('/qr');
        if (!cancelled) setQr(data);
      } catch {
        if (!cancelled) setError('Could not generate the QR code.');
      }
    };

    fetchQR();
    return () => { cancelled = true; };
  }, [navigate]);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qr.qrImage;
    link.download = 'smartdine-menu-qr.png';
    link.click();
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">SmartDine</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-muted hover:text-ink transition-colors text-sm"
          >
            Back to dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-display text-3xl font-bold mb-2">Your menu QR code</h2>
        <p className="text-muted mb-10">Print this and place it on your tables. Scanning it opens your menu.</p>

        {error && (
          <div className="mb-6 border border-accent/40 bg-accent/10 text-accent-soft px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {qr && (
          <div className="bg-surface border border-border rounded-xl p-8 inline-block">
            <div className="bg-white p-5 rounded-lg inline-block">
              <img src={qr.qrImage} alt="Menu QR code" className="w-56 h-56" />
            </div>
            <p className="text-muted text-sm mt-5 break-all max-w-56">{qr.menuUrl}</p>
            <button
              onClick={downloadQR}
              className="mt-5 w-full bg-accent text-ground font-medium py-3 rounded-lg hover:bg-accent-soft transition-colors"
            >
              Download QR code
            </button>
          </div>
        )}
      </main>
    </div>
  );
}