import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button, Card } from '@ewa/ui';

// Tipos para tickets de soporte
interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdBy: string;
  createdAt: string;
  assignedTo?: string;
  lastUpdated: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isInternal: boolean;
}

// Tipos para auditoría
interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  entity: string;
  entityId: string;
}

const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'audit'>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketFilter, setTicketFilter] = useState('all');
  const [newMessage, setNewMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  useEffect(() => {
    // Simulamos la carga de tickets de soporte
    const mockTickets: SupportTicket[] = [
      {
        id: 'ticket_1',
        subject: 'Cannot access my subscription',
        description: 'I\'m trying to view my subscription details but keep getting an error message.',
        status: 'open',
        priority: 'high',
        category: 'Account Access',
        createdBy: 'Juan Rivera',
        createdAt: '2023-10-20 09:30',
        lastUpdated: '2023-10-20 09:30',
        messages: [
          {
            id: 'msg_1',
            content: 'I\'m trying to view my subscription details but keep getting an error message that says "Unable to load subscription data". I\'ve tried logging out and back in but still have the same issue.',
            sender: 'Juan Rivera',
            timestamp: '2023-10-20 09:30',
            isInternal: false
          }
        ]
      },
      {
        id: 'ticket_2',
        subject: 'Delivery not received',
        description: 'My scheduled delivery for yesterday was not received.',
        status: 'in-progress',
        priority: 'urgent',
        category: 'Delivery',
        createdBy: 'Restaurante Sobao',
        assignedTo: 'Carlos Rodríguez',
        createdAt: '2023-10-19 14:20',
        lastUpdated: '2023-10-20 10:15',
        messages: [
          {
            id: 'msg_2',
            content: 'We were expecting our weekly delivery yesterday (October 18) but it never arrived. This is causing issues for our restaurant as we\'re running low on water for customers.',
            sender: 'Restaurante Sobao',
            timestamp: '2023-10-19 14:20',
            isInternal: false
          },
          {
            id: 'msg_3',
            content: 'I\'ve checked the delivery logs and it seems there was a route issue. I\'ll contact the logistics team to arrange a priority delivery today.',
            sender: 'Carlos Rodríguez',
            timestamp: '2023-10-19 15:45',
            isInternal: true
          },
          {
            id: 'msg_4',
            content: 'We apologize for the missed delivery. We\'ve identified the issue and have scheduled a priority delivery for today between 2-4pm. Would this time frame work for you?',
            sender: 'Carlos Rodríguez',
            timestamp: '2023-10-20 10:15',
            isInternal: false
          }
        ]
      },
      {
        id: 'ticket_3',
        subject: 'Billing question',
        description: 'I was charged twice for my last subscription payment.',
        status: 'resolved',
        priority: 'medium',
        category: 'Billing',
        createdBy: 'María Torres',
        assignedTo: 'Ana Morales',
        createdAt: '2023-10-15 11:10',
        lastUpdated: '2023-10-17 09:25',
        messages: [
          {
            id: 'msg_5',
            content: 'I noticed that I was charged twice for my monthly subscription on October 14. Can you please look into this and refund the extra charge?',
            sender: 'María Torres',
            timestamp: '2023-10-15 11:10',
            isInternal: false
          },
          {
            id: 'msg_6',
            content: 'I\'ve verified the billing records and confirmed there was a duplicate charge. Processing refund now.',
            sender: 'Ana Morales',
            timestamp: '2023-10-16 14:30',
            isInternal: true
          },
          {
            id: 'msg_7',
            content: 'Thank you for bringing this to our attention. I\'ve confirmed there was a duplicate charge and have processed a refund for the extra amount. It should appear in your account within 3-5 business days. Please let us know if you have any other questions.',
            sender: 'Ana Morales',
            timestamp: '2023-10-16 14:45',
            isInternal: false
          },
          {
            id: 'msg_8',
            content: 'Thank you for the quick resolution! I can see the refund is being processed.',
            sender: 'María Torres',
            timestamp: '2023-10-17 09:25',
            isInternal: false
          }
        ]
      },
      {
        id: 'ticket_4',
        subject: 'Change delivery frequency',
        description: 'Need to change from weekly to biweekly delivery',
        status: 'closed',
        priority: 'low',
        category: 'Subscription',
        createdBy: 'Roberto Sánchez',
        assignedTo: 'Luisa Vega',
        createdAt: '2023-10-10 16:40',
        lastUpdated: '2023-10-11 13:15',
        messages: [
          {
            id: 'msg_9',
            content: 'I\'d like to change my delivery frequency from weekly to biweekly as I\'m not using as much water as expected.',
            sender: 'Roberto Sánchez',
            timestamp: '2023-10-10 16:40',
            isInternal: false
          },
          {
            id: 'msg_10',
            content: 'I\'ve updated the subscription frequency to biweekly. The next delivery will be on October 24.',
            sender: 'Luisa Vega',
            timestamp: '2023-10-11 10:20',
            isInternal: false
          },
          {
            id: 'msg_11',
            content: 'Thank you for making this change. The new schedule works perfectly for me.',
            sender: 'Roberto Sánchez',
            timestamp: '2023-10-11 13:15',
            isInternal: false
          }
        ]
      },
      {
        id: 'ticket_5',
        subject: 'Product quality issue',
        description: 'Received damaged boxes in last shipment',
        status: 'open',
        priority: 'high',
        category: 'Product Quality',
        createdBy: 'Carmen Figueroa',
        createdAt: '2023-10-21 08:50',
        lastUpdated: '2023-10-21 08:50',
        messages: [
          {
            id: 'msg_12',
            content: 'In my delivery yesterday, 3 of the boxes were damaged and leaking. I\'ve taken photos of the damaged products that I can provide if needed.',
            sender: 'Carmen Figueroa',
            timestamp: '2023-10-21 08:50',
            isInternal: false
          }
        ]
      }
    ];

    // Simulamos la carga de logs de auditoría
    const mockAuditLogs: AuditLog[] = [
      {
        id: 'log_1',
        action: 'User Login',
        user: 'María López (Admin)',
        timestamp: '2023-10-21 09:15:22',
        details: 'Successful login from IP 192.168.1.105',
        entity: 'User',
        entityId: 'user_1'
      },
      {
        id: 'log_2',
        action: 'Subscription Updated',
        user: 'Carlos Rodríguez (Operator)',
        timestamp: '2023-10-21 09:30:45',
        details: 'Changed delivery frequency from Weekly to Biweekly',
        entity: 'Subscription',
        entityId: 'sub_123'
      },
      {
        id: 'log_3',
        action: 'Product Added',
        user: 'María López (Admin)',
        timestamp: '2023-10-21 10:05:18',
        details: 'Added new product: "Box Water 24-Pack"',
        entity: 'Product',
        entityId: 'prod_6'
      },
      {
        id: 'log_4',
        action: 'User Created',
        user: 'María López (Admin)',
        timestamp: '2023-10-20 15:42:30',
        details: 'Created new support agent account for "Pedro Ramírez"',
        entity: 'User',
        entityId: 'user_6'
      },
      {
        id: 'log_5',
        action: 'Payment Processed',
        user: 'System',
        timestamp: '2023-10-20 00:05:00',
        details: 'Automatic monthly subscription payment processed: $19.99',
        entity: 'Payment',
        entityId: 'pay_789'
      },
      {
        id: 'log_6',
        action: 'Route Modified',
        user: 'Carlos Rodríguez (Operator)',
        timestamp: '2023-10-19 14:30:12',
        details: 'Added 3 new stops to "San Juan Downtown Route"',
        entity: 'Route',
        entityId: 'route_1'
      },
      {
        id: 'log_7',
        action: 'Content Updated',
        user: 'Ana Morales (Editor)',
        timestamp: '2023-10-19 11:20:45',
        details: 'Updated homepage hero section content',
        entity: 'Content',
        entityId: 'content_1'
      },
      {
        id: 'log_8',
        action: 'Notification Sent',
        user: 'María López (Admin)',
        timestamp: '2023-10-18 16:15:33',
        details: 'Sent email notification "New Subscription Plan Available" to all customers',
        entity: 'Notification',
        entityId: 'notif_1'
      },
      {
        id: 'log_9',
        action: 'Inventory Restocked',
        user: 'Carlos Rodríguez (Operator)',
        timestamp: '2023-10-18 10:45:20',
        details: 'Added 1500 units of "Small Box Water" to inventory',
        entity: 'Inventory',
        entityId: 'prod_1'
      },
      {
        id: 'log_10',
        action: 'User Permissions Modified',
        user: 'María López (Admin)',
        timestamp: '2023-10-17 14:20:10',
        details: 'Changed role from "Support" to "Operator" for "Luisa Vega"',
        entity: 'User',
        entityId: 'user_5'
      }
    ];

    setTickets(mockTickets);
    setAuditLogs(mockAuditLogs);
  }, []);

  const handleTicketSelect = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-yellow-100 text-yellow-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (ticketId: string, newStatus: 'open' | 'in-progress' | 'resolved' | 'closed') => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: newStatus,
          lastUpdated: new Date().toLocaleString()
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        lastUpdated: new Date().toLocaleString()
      });
    }
  };

  const handleSendMessage = () => {
    if (!selectedTicket || !newMessage.trim()) return;
    
    const newMessageObj: TicketMessage = {
      id: `msg_${Date.now()}`,
      content: newMessage,
      sender: 'Support Agent', // In a real app, this would be the current user
      timestamp: new Date().toLocaleString(),
      isInternal: isInternalNote
    };
    
    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessageObj],
      lastUpdated: new Date().toLocaleString()
    };
    
    const updatedTickets = tickets.map(ticket => 
      ticket.id === selectedTicket.id ? updatedTicket : ticket
    );
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTicket);
    setNewMessage('');
    setIsInternalNote(false);
  };

  const filteredTickets = ticketFilter === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === ticketFilter);

  const renderTicketsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="mb-4">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
            Filter by Status
          </label>
          <select
            id="status-filter"
            name="status-filter"
            value={ticketFilter}
            onChange={(e) => setTicketFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <li key={ticket.id}>
                <button
                  onClick={() => handleTicketSelect(ticket)}
                  className={`w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none ${
                    selectedTicket?.id === ticket.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">{ticket.createdBy}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedTicket ? (
          <Card className="h-full">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {selectedTicket.subject}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedTicket.status)}`}>
                      {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                    </span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(selectedTicket.priority)}`}>
                      {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {selectedTicket.category}
                    </span>
                  </div>
                </div>
                <div>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value as any)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created By</h4>
                  <p className="mt-1">{selectedTicket.createdBy}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                  <p className="mt-1">{selectedTicket.createdAt}</p>
                </div>
                {selectedTicket.assignedTo && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Assigned To</h4>
                    <p className="mt-1">{selectedTicket.assignedTo}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                  <p className="mt-1">{selectedTicket.lastUpdated}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Conversation</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-md">
                  {selectedTicket.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-3 rounded-lg ${
                        message.isInternal 
                          ? 'bg-yellow-50 border border-yellow-200' 
                          : message.sender === selectedTicket.createdBy
                            ? 'bg-gray-100'
                            : 'bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium">
                          {message.sender}
                          {message.isInternal && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Internal Note
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="mt-1 text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2">
                  <label htmlFor="new-message" className="block text-sm font-medium text-gray-700">
                    Reply
                  </label>
                  <textarea
                    id="new-message"
                    name="new-message"
                    rows={4}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
                    placeholder="Type your message here..."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="internal-note"
                      name="internal-note"
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="h-4 w-4 text-ewa-blue focus:ring-ewa-blue border-gray-300 rounded"
                    />
                    <label htmlFor="internal-note" className="ml-2 block text-sm text-gray-700">
                      Internal note (not visible to customer)
                    </label>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg p-6">
            <p className="text-gray-500">Select a ticket to view details</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAuditTab = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            System Audit Logs
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            View a history of all actions taken in the system
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.entity} ({log.entityId})
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Support & Audit - EWA Box Water">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Support & Audit</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage support tickets and view system audit logs
          </p>
        </div>

        <div className="mb-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'tickets' | 'audit')}
            >
              <option value="tickets">Support Tickets</option>
              <option value="audit">Audit Logs</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`${
                    activeTab === 'tickets'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Support Tickets
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`${
                    activeTab === 'audit'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Audit Logs
                </button>
              </nav>
            </div>
          </div>
        </div>

        {activeTab === 'tickets' ? renderTicketsTab() : renderAuditTab()}
      </div>
    </Layout>
  );
};

export default SupportPage;
