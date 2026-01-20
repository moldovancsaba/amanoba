/**
 * Admin Payments Dashboard
 * 
 * What: View all payment transactions and revenue analytics
 * Why: Allows admins to track revenue, view transactions, and analyze payment data
 */

'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  User,
  BookOpen,
  X,
} from 'lucide-react';

interface PaymentTransaction {
  id: string;
  playerId: string | null;
  playerName: string;
  playerEmail: string | null;
  courseId: string | null;
  courseName: string | null;
  amount: number;
  currency: string;
  status: string;
  premiumGranted: boolean;
  premiumExpiresAt: string | null;
  premiumDurationDays: number | null;
  paymentMethod: {
    type: string;
    brand?: string;
    last4?: string;
    country?: string;
  } | null;
  stripePaymentIntentId: string;
  stripeCheckoutSessionId: string | null;
  stripeCustomerId: string | null;
  stripeChargeId: string | null;
  createdAt: string;
  processedAt: string | null;
  refundedAt: string | null;
  failureReason: string | null;
  refundReason: string | null;
}

interface Analytics {
  totalRevenue: Array<{ currency: string; amount: number; count: number }>;
  revenueByCourse: Array<{
    courseId: string | null;
    courseName: string;
    totalAmount: number;
    count: number;
  }>;
  statusBreakdown: Array<{ status: string; count: number }>;
  revenueByPeriod: {
    today: Array<{ currency: string; amount: number; count: number }>;
    last7Days: Array<{ currency: string; amount: number; count: number }>;
    last30Days: Array<{ currency: string; amount: number; count: number }>;
  };
  successRate: number;
  failureRate: number;
  refundRate: number;
  totalTransactions: number;
  succeededTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;
}

export default function AdminPaymentsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [playerFilter, setPlayerFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 50;

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, courseFilter, playerFilter, startDate, endDate, currentPage]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (courseFilter !== 'all') {
        params.append('courseId', courseFilter);
      }
      if (playerFilter) {
        params.append('playerId', playerFilter);
      }
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }
      
      params.append('limit', limit.toString());
      params.append('offset', ((currentPage - 1) * limit).toString());
      params.append('analytics', 'true');

      const response = await fetch(`/api/admin/payments?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTransactions(data.transactions || []);
        setTotalCount(data.pagination?.total || 0);
        setAnalytics(data.analytics || null);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string): string => {
    const formatter = new Intl.NumberFormat(
      currency === 'HUF' ? 'hu-HU' : currency === 'EUR' ? 'de-DE' : currency === 'GBP' ? 'en-GB' : 'en-US',
      {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: currency === 'HUF' ? 0 : 2,
        maximumFractionDigits: currency === 'HUF' ? 0 : 2,
      }
    );
    // Convert from cents to main unit
    const mainUnit = currency === 'HUF' ? amount : amount / 100;
    return formatter.format(mainUnit);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'succeeded':
        return 'text-green-400 bg-green-400/20';
      case 'failed':
        return 'text-red-400 bg-red-400/20';
      case 'refunded':
      case 'partially_refunded':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'pending':
      case 'processing':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'User Name',
      'User Email',
      'Course',
      'Amount',
      'Currency',
      'Status',
      'Payment Method',
      'Premium Granted',
      'Created At',
      'Stripe Payment Intent ID',
    ];

    const rows = transactions.map((tx) => [
      tx.id,
      tx.playerName,
      tx.playerEmail || '',
      tx.courseName || 'N/A',
      tx.amount,
      tx.currency,
      tx.status,
      tx.paymentMethod ? `${tx.paymentMethod.type} ${tx.paymentMethod.last4 || ''}` : 'N/A',
      tx.premiumGranted ? 'Yes' : 'No',
      new Date(tx.createdAt).toISOString(),
      tx.stripePaymentIntentId,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Dashboard</h1>
          <p className="text-gray-400">View all transactions and revenue analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-brand-darkGrey text-brand-white px-4 py-2 rounded-lg border border-brand-accent hover:bg-brand-accent hover:text-brand-black transition-colors"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
              <DollarSign className="w-5 h-5 text-brand-accent" />
            </div>
            <div className="space-y-1">
              {analytics.totalRevenue.length > 0 ? (
                analytics.totalRevenue.map((rev) => (
                  <div key={rev.currency} className="text-2xl font-bold text-white">
                    {formatCurrency(rev.amount, rev.currency)}
                  </div>
                ))
              ) : (
                <div className="text-2xl font-bold text-white">$0.00</div>
              )}
              <p className="text-xs text-gray-400">
                {analytics.succeededTransactions} successful transactions
              </p>
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Success Rate</h3>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {analytics.successRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-400">
              {analytics.succeededTransactions} / {analytics.totalTransactions} transactions
            </p>
          </div>

          {/* Failed Transactions */}
          <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Failed</h3>
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {analytics.failedTransactions}
            </div>
            <p className="text-xs text-gray-400">
              {analytics.failureRate.toFixed(1)}% failure rate
            </p>
          </div>

          {/* Refunded */}
          <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Refunded</h3>
              <RefreshCw className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {analytics.refundedTransactions}
            </div>
            <p className="text-xs text-gray-400">
              {analytics.refundRate.toFixed(1)}% refund rate
            </p>
          </div>
        </div>
      )}

      {/* Revenue by Period */}
      {analytics && (
        <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
          <h2 className="text-xl font-bold text-white mb-4">Revenue by Period</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Today</h3>
              {analytics.revenueByPeriod.today.length > 0 ? (
                analytics.revenueByPeriod.today.map((rev) => (
                  <div key={rev.currency} className="text-lg font-bold text-white">
                    {formatCurrency(rev.amount, rev.currency)}
                  </div>
                ))
              ) : (
                <div className="text-lg font-bold text-white">$0.00</div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Last 7 Days</h3>
              {analytics.revenueByPeriod.last7Days.length > 0 ? (
                analytics.revenueByPeriod.last7Days.map((rev) => (
                  <div key={rev.currency} className="text-lg font-bold text-white">
                    {formatCurrency(rev.amount, rev.currency)}
                  </div>
                ))
              ) : (
                <div className="text-lg font-bold text-white">$0.00</div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Last 30 Days</h3>
              {analytics.revenueByPeriod.last30Days.length > 0 ? (
                analytics.revenueByPeriod.last30Days.map((rev) => (
                  <div key={rev.currency} className="text-lg font-bold text-white">
                    {formatCurrency(rev.amount, rev.currency)}
                  </div>
                ))
              ) : (
                <div className="text-lg font-bold text-white">$0.00</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-brand-darkGrey rounded-xl p-4 border-2 border-brand-accent">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white focus:outline-none focus:border-brand-accent"
            >
              <option value="all">All Statuses</option>
              <option value="succeeded">Succeeded</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="refunded">Refunded</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Course</label>
            <input
              type="text"
              placeholder="Course ID..."
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white placeholder-brand-white/50 focus:outline-none focus:border-brand-accent"
            />
          </div>

          {/* Player Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">User ID</label>
              <input
                type="text"
                placeholder="User ID..."
              value={playerFilter}
              onChange={(e) => {
                setPlayerFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white placeholder-brand-white/50 focus:outline-none focus:border-brand-accent"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white focus:outline-none focus:border-brand-accent"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white focus:outline-none focus:border-brand-accent"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-brand-darkGrey rounded-xl border-2 border-brand-accent overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-black/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-brand-black/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {new Date(tx.createdAt).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-400">
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{tx.playerName}</div>
                      {tx.playerEmail && (
                        <div className="text-xs text-gray-400">{tx.playerEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {tx.courseName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}
                      >
                        {getStatusIcon(tx.status)}
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {tx.paymentMethod
                        ? `${tx.paymentMethod.type} ${tx.paymentMethod.last4 ? `••••${tx.paymentMethod.last4}` : ''}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedTransaction(tx)}
                        className="text-brand-accent hover:text-brand-primary-400 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-brand-black/50 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} transactions
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-accent hover:text-brand-black transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-accent hover:text-brand-black transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-darkGrey rounded-xl border-2 border-brand-accent max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-brand-black/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Transaction ID</label>
                  <div className="text-white font-mono text-sm">{selectedTransaction.id}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}
                    >
                      {getStatusIcon(selectedTransaction.status)}
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">User</label>
                  <div className="text-white">{selectedTransaction.playerName}</div>
                  {selectedTransaction.playerEmail && (
                    <div className="text-sm text-gray-400">{selectedTransaction.playerEmail}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Course</label>
                  <div className="text-white">{selectedTransaction.courseName || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Amount</label>
                  <div className="text-white font-bold">
                    {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Payment Method</label>
                  <div className="text-white">
                    {selectedTransaction.paymentMethod
                      ? `${selectedTransaction.paymentMethod.type} ${selectedTransaction.paymentMethod.last4 ? `••••${selectedTransaction.paymentMethod.last4}` : ''}`
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Created At</label>
                  <div className="text-white">
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </div>
                </div>
                {selectedTransaction.processedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Processed At</label>
                    <div className="text-white">
                      {new Date(selectedTransaction.processedAt).toLocaleString()}
                    </div>
                  </div>
                )}
                {selectedTransaction.refundedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Refunded At</label>
                    <div className="text-white">
                      {new Date(selectedTransaction.refundedAt).toLocaleString()}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-400">Premium Granted</label>
                  <div className="text-white">
                    {selectedTransaction.premiumGranted ? 'Yes' : 'No'}
                  </div>
                </div>
                {selectedTransaction.premiumExpiresAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Premium Expires</label>
                    <div className="text-white">
                      {new Date(selectedTransaction.premiumExpiresAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Stripe Payment Intent ID</label>
                <div className="text-white font-mono text-sm break-all">
                  {selectedTransaction.stripePaymentIntentId}
                </div>
              </div>
              {selectedTransaction.stripeCheckoutSessionId && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Stripe Checkout Session ID</label>
                  <div className="text-white font-mono text-sm break-all">
                    {selectedTransaction.stripeCheckoutSessionId}
                  </div>
                </div>
              )}
              {selectedTransaction.failureReason && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Failure Reason</label>
                  <div className="text-red-400">{selectedTransaction.failureReason}</div>
                </div>
              )}
              {selectedTransaction.refundReason && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Refund Reason</label>
                  <div className="text-yellow-400">{selectedTransaction.refundReason}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
