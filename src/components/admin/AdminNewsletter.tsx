import React, { useState, useEffect, useCallback } from 'react';
import { newsletterAPI, type Newsletter } from '../../lib/supabase';
import {
  Mail,
  Plus,
  Trash2,
  Edit3,
  Send,
  Users,
  FileText,
  Calendar
} from 'lucide-react';

const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadSubscribers();
    loadSubscriberCount();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const data = await newsletterAPI.getAllSubscribers();
      setSubscribers(data);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriberCount = async () => {
    try {
      const count = await newsletterAPI.getSubscriberCount();
      setSubscriberCount(count);
    } catch (error) {
      console.error('Error loading subscriber count:', error);
    }
  };

  const handleUnsubscribe = useCallback(async (email: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${email} dari newsletter?`)) {
      return;
    }

    try {
      setActionLoading(email);
      await newsletterAPI.unsubscribe(email);
      await loadSubscribers();
      await loadSubscriberCount();
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Terjadi kesalahan saat menghapus subscriber');
    } finally {
      setActionLoading(null);
    }
  }, []);

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Tanggal Berlangganan', 'Status'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        formatDate(sub.subscribed_at),
        sub.is_active ? 'Aktif' : 'Tidak Aktif'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Newsletter Management</h1>
          <p className="text-secondary-600">Kelola subscriber newsletter DIGCITY</p>
        </div>
        <button
          onClick={exportSubscribers}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Send size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">Total Subscribers</p>
          <p className="text-2xl font-bold text-secondary-900">{subscriberCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{subscribers.filter(s => s.is_active).length}</p>
        </div>
        <div className="bg-white rounded-lg border border-secondary-200 p-4 text-center">
          <p className="text-sm text-secondary-600">This Month</p>
          <p className="text-2xl font-bold text-secondary-600">
            {subscribers.filter(s => {
              const subDate = new Date(s.subscribed_at);
              const now = new Date();
              return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg border border-secondary-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari email subscriber..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg border border-secondary-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900">
            Daftar Subscribers ({filteredSubscribers.length})
          </h3>
        </div>

        {filteredSubscribers.length === 0 ? (
          <div className="p-8 text-center">
            <Mail size={64} className="mx-auto mb-4 text-secondary-300" />
            <p className="text-secondary-500">Tidak ada subscriber yang ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Tanggal Berlangganan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-500">
                        {formatDate(subscriber.subscribed_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscriber.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {subscriber.is_active && (
                        <button
                          onClick={() => handleUnsubscribe(subscriber.email)}
                          disabled={actionLoading === subscriber.email}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {actionLoading === subscriber.email ? 'Memproses...' : 'Unsubscribe'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletter;