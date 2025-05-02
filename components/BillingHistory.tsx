"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BillingHistoryProps {
  userId: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  date: number;
  pdfUrl: string;
  description: string;
  type: 'invoice' | 'receipt';
}

const BillingHistory = ({ userId }: BillingHistoryProps) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action: 'getBillingHistory' })
        });
        const result = await response.json();
        
        if (result.success) {
          setTransactions(result.transactions || []);
        }
      } catch (error) {
        console.error("Error fetching billing history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBillingHistory();
    }
  }, [userId]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-200"></div>
      </div>
    );
  }

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    if (activeTab === 'invoices') return transaction.type === 'invoice';
    if (activeTab === 'receipts') return transaction.type === 'receipt';
    return true;
  });

  // Count of each type
  const invoiceCount = transactions.filter(t => t.type === 'invoice').length;
  const receiptCount = transactions.filter(t => t.type === 'receipt').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Billing History</h3>
        {transactions.length > 0 && (
          <Button className="text-xs text-primary-200 hover:text-primary-100 transition-colors bg-transparent hover:bg-transparent p-0">
            Download All
          </Button>
        )}
      </div>
      
      {transactions.length === 0 ? (
        <div className="bg-dark-300/50 backdrop-blur-sm rounded-xl border border-dark-300 p-6 text-center">
          <p className="text-gray-400">No billing history available</p>
        </div>
      ) : (
        <div className="bg-dark-300/80 backdrop-blur-sm rounded-xl border border-dark-300/80 overflow-hidden shadow-lg">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-3 bg-dark-400/80 shadow-inner">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-primary-200/30 data-[state=active]:text-white text-gray-300 hover:text-white"
                >
                  All ({transactions.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="invoices" 
                  className="data-[state=active]:bg-primary-200/30 data-[state=active]:text-white text-gray-300 hover:text-white"
                >
                  Invoices ({invoiceCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="receipts" 
                  className="data-[state=active]:bg-primary-200/30 data-[state=active]:text-white text-gray-300 hover:text-white"
                >
                  Receipts ({receiptCount})
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <TransactionTable transactions={filteredTransactions} formatDate={formatDate} />
            </TabsContent>
            
            <TabsContent value="invoices" className="mt-0">
              <TransactionTable transactions={filteredTransactions} formatDate={formatDate} />
            </TabsContent>
            
            <TabsContent value="receipts" className="mt-0">
              <TransactionTable transactions={filteredTransactions} formatDate={formatDate} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

// Separate component for the transaction table
const TransactionTable = ({ 
  transactions, 
  formatDate 
}: { 
  transactions: Transaction[], 
  formatDate: (timestamp: number) => string 
}) => {
  return (
    <div className="overflow-x-auto p-4">
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-300">No transactions found</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-200/80">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-200/50">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-dark-400/40 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-200">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-md ${
                    transaction.type === 'invoice' 
                      ? 'bg-primary-200/30 text-white border border-primary-200/50' 
                      : 'bg-purple-500/30 text-white border border-purple-400/50'
                  }`}>
                    {transaction.type === 'invoice' ? 'Invoice' : 'Receipt'}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-200">
                  {transaction.description}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-sm font-bold text-white bg-primary-200/20 px-3 py-1.5 rounded-md border border-primary-200/30">
                    ${transaction.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-md ${
                    transaction.status === 'paid' || transaction.status === 'succeeded'
                      ? 'bg-green-500/30 text-white border border-green-400/50' 
                      : 'bg-yellow-500/30 text-white border border-yellow-400/50'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                  {transaction.pdfUrl ? (
                    <a 
                      href={transaction.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-200 hover:bg-primary-100 text-dark-100 font-medium rounded-md transition-colors shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      {transaction.type === 'invoice' ? 'Invoice' : 'Receipt'}
                    </a>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BillingHistory;
