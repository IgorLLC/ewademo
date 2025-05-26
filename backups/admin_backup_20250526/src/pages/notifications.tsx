import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button, Card } from '@ewa/ui';

// Tipos para las notificaciones
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'push' | 'sms';
  status: 'draft' | 'scheduled' | 'sent';
  recipients: string;
  scheduledDate?: string;
  sentDate?: string;
  openRate?: number;
  clickRate?: number;
}

// Tipo para los templates
interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms';
  subject?: string;
  content: string;
}

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'templates' | 'new'>('history');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  
  // Estado para nueva notificación
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'email',
    recipients: 'all',
    scheduledDate: ''
  });

  useEffect(() => {
    // Simulamos la carga de notificaciones
    const mockNotifications: Notification[] = [
      {
        id: 'notif_1',
        title: 'New Subscription Plan Available',
        message: 'We\'ve added a new family subscription plan! Check it out now and save 15% on your monthly water delivery.',
        type: 'email',
        status: 'sent',
        recipients: 'All Customers',
        sentDate: '2023-10-18',
        openRate: 68,
        clickRate: 42
      },
      {
        id: 'notif_2',
        title: 'Delivery Schedule Change',
        message: 'Due to the upcoming holiday, your delivery will be rescheduled from Monday to Tuesday next week.',
        type: 'email',
        status: 'sent',
        recipients: 'Monday Route Customers',
        sentDate: '2023-10-15',
        openRate: 85,
        clickRate: 12
      },
      {
        id: 'notif_3',
        title: 'Your Box Water is on the way!',
        message: 'Your EWA Box Water delivery is out for delivery and will arrive today between 2-4pm.',
        type: 'push',
        status: 'sent',
        recipients: 'Today\'s Delivery Customers',
        sentDate: '2023-10-20',
        openRate: 92,
        clickRate: 76
      },
      {
        id: 'notif_4',
        title: 'Sustainability Report 2023',
        message: 'Our annual sustainability report is now available. See how EWA Box Water has helped reduce plastic waste in Puerto Rico.',
        type: 'email',
        status: 'scheduled',
        recipients: 'All Subscribers',
        scheduledDate: '2023-10-25'
      },
      {
        id: 'notif_5',
        title: 'Payment Reminder',
        message: 'This is a friendly reminder that your subscription payment is due in 3 days.',
        type: 'sms',
        status: 'draft',
        recipients: 'Customers with Pending Payments'
      }
    ];

    // Simulamos la carga de templates
    const mockTemplates: NotificationTemplate[] = [
      {
        id: 'template_1',
        name: 'Welcome Email',
        type: 'email',
        subject: 'Welcome to EWA Box Water!',
        content: 'Dear {{customer.name}},\n\nWelcome to EWA Box Water! We\'re thrilled to have you join our mission to reduce plastic waste while enjoying pure, refreshing water.\n\nYour first delivery is scheduled for {{subscription.firstDeliveryDate}}.\n\nIf you have any questions, please don\'t hesitate to contact us.\n\nBest regards,\nThe EWA Box Water Team'
      },
      {
        id: 'template_2',
        name: 'Delivery Notification',
        type: 'push',
        content: 'Your EWA Box Water delivery is on its way! Expected arrival: {{delivery.estimatedTime}}'
      },
      {
        id: 'template_3',
        name: 'Payment Confirmation',
        type: 'email',
        subject: 'Payment Confirmation - EWA Box Water',
        content: 'Dear {{customer.name}},\n\nThank you for your payment of ${{payment.amount}} for your EWA Box Water subscription.\n\nYour next delivery is scheduled for {{subscription.nextDeliveryDate}}.\n\nBest regards,\nThe EWA Box Water Team'
      },
      {
        id: 'template_4',
        name: 'Payment Reminder',
        type: 'sms',
        content: 'EWA Box Water: Your subscription payment of ${{payment.amount}} is due on {{payment.dueDate}}. Please update your payment method to avoid service interruption.'
      },
      {
        id: 'template_5',
        name: 'Special Promotion',
        type: 'email',
        subject: 'Special Offer Just for You!',
        content: 'Dear {{customer.name}},\n\nAs a valued EWA Box Water customer, we\'re offering you an exclusive discount on your next order!\n\nUse code {{promotion.code}} at checkout to receive {{promotion.discount}}% off.\n\nOffer valid until {{promotion.endDate}}.\n\nBest regards,\nThe EWA Box Water Team'
      }
    ];

    setNotifications(mockNotifications);
    setTemplates(mockTemplates);
  }, []);

  const handleNotificationSelect = (notification: Notification) => {
    setSelectedNotification(notification);
    setSelectedTemplate(null);
  };

  const handleTemplateSelect = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setSelectedNotification(null);
  };

  const handleSendNow = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return {
          ...notification,
          status: 'sent' as const,
          sentDate: new Date().toISOString().split('T')[0],
          openRate: 0,
          clickRate: 0
        };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
    
    if (selectedNotification && selectedNotification.id === notificationId) {
      setSelectedNotification({
        ...selectedNotification,
        status: 'sent',
        sentDate: new Date().toISOString().split('T')[0],
        openRate: 0,
        clickRate: 0
      });
    }
    
    alert(`Notification "${notifications.find(n => n.id === notificationId)?.title}" has been sent!`);
  };

  const handleCreateNotification = () => {
    const newId = `notif_${notifications.length + 1}`;
    const notification: Notification = {
      id: newId,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type as 'email' | 'push' | 'sms',
      status: newNotification.scheduledDate ? 'scheduled' : 'draft',
      recipients: newNotification.recipients,
      scheduledDate: newNotification.scheduledDate || undefined
    };
    
    setNotifications([...notifications, notification]);
    setNewNotification({
      title: '',
      message: '',
      type: 'email',
      recipients: 'all',
      scheduledDate: ''
    });
    setActiveTab('history');
    alert('Notification created successfully!');
  };

  const renderHistoryTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  onClick={() => handleNotificationSelect(notification)}
                  className={`w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none ${
                    selectedNotification?.id === notification.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.type === 'email' ? 'bg-blue-100 text-blue-800' :
                          notification.type === 'push' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {notification.type.toUpperCase()}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                          notification.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {notification.sentDate || notification.scheduledDate || 'Not scheduled'}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 bg-gray-50 text-right">
            <Button
              onClick={() => setActiveTab('new')}
              variant="primary"
              size="small"
            >
              Create Notification
            </Button>
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedNotification ? (
          <Card className="h-full">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {selectedNotification.title}
                </h3>
                {selectedNotification.status !== 'sent' && (
                  <div>
                    <Button
                      onClick={() => handleSendNow(selectedNotification.id)}
                      variant="primary"
                      size="small"
                      className="mr-2"
                    >
                      Send Now
                    </Button>
                    <Button
                      onClick={() => alert('Edit functionality would go here')}
                      variant="secondary"
                      size="small"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Type</h4>
                  <p className="mt-1">{selectedNotification.type.toUpperCase()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1">{selectedNotification.status.charAt(0).toUpperCase() + selectedNotification.status.slice(1)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Recipients</h4>
                  <p className="mt-1">{selectedNotification.recipients}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    {selectedNotification.sentDate ? 'Sent Date' : 'Scheduled Date'}
                  </h4>
                  <p className="mt-1">{selectedNotification.sentDate || selectedNotification.scheduledDate || 'Not scheduled'}</p>
                </div>
              </div>

              {selectedNotification.status === 'sent' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Open Rate</h4>
                    <p className="mt-1">{selectedNotification.openRate}%</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Click Rate</h4>
                    <p className="mt-1">{selectedNotification.clickRate}%</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <div className="mt-1 p-4 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-wrap">{selectedNotification.message}</p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg p-6">
            <p className="text-gray-500">Select a notification to view details</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {templates.map((template) => (
              <li key={template.id}>
                <button
                  onClick={() => handleTemplateSelect(template)}
                  className={`w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none ${
                    selectedTemplate?.id === template.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{template.name}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        template.type === 'email' ? 'bg-blue-100 text-blue-800' :
                        template.type === 'push' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {template.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 bg-gray-50 text-right">
            <Button
              onClick={() => alert('Add template functionality would go here')}
              variant="secondary"
              size="small"
            >
              Add Template
            </Button>
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedTemplate ? (
          <Card className="h-full">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {selectedTemplate.name}
                </h3>
                <div>
                  <Button
                    onClick={() => {
                      setActiveTab('new');
                      setNewNotification({
                        ...newNotification,
                        title: selectedTemplate.subject || selectedTemplate.name,
                        message: selectedTemplate.content,
                        type: selectedTemplate.type
                      });
                    }}
                    variant="primary"
                    size="small"
                    className="mr-2"
                  >
                    Use Template
                  </Button>
                  <Button
                    onClick={() => alert('Edit template functionality would go here')}
                    variant="secondary"
                    size="small"
                  >
                    Edit
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Type</h4>
                  <p className="mt-1">{selectedTemplate.type.toUpperCase()}</p>
                </div>
                {selectedTemplate.subject && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Subject</h4>
                    <p className="mt-1">{selectedTemplate.subject}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Content</h4>
                <div className="mt-1 p-4 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-wrap">{selectedTemplate.content}</p>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Note: Variables in double curly braces (e.g. {"{{"} customer.name {"}"}) will be replaced with actual values when sending.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg p-6">
            <p className="text-gray-500">Select a template to view details</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderNewNotificationTab = () => (
    <Card>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Create New Notification
        </h3>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title/Subject
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={newNotification.title}
              onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Notification Type
            </label>
            <select
              id="type"
              name="type"
              value={newNotification.type}
              onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
            >
              <option value="email">Email</option>
              <option value="push">Push Notification</option>
              <option value="sms">SMS</option>
            </select>
          </div>

          <div>
            <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
              Recipients
            </label>
            <select
              id="recipients"
              name="recipients"
              value={newNotification.recipients}
              onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
            >
              <option value="all">All Customers</option>
              <option value="active">Active Subscribers</option>
              <option value="inactive">Inactive Customers</option>
              <option value="pending">Customers with Pending Payments</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={newNotification.message}
              onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
              Schedule Date (optional)
            </label>
            <input
              type="date"
              name="scheduledDate"
              id="scheduledDate"
              value={newNotification.scheduledDate}
              onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setActiveTab('history')}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNotification}
              disabled={!newNotification.title || !newNotification.message}
            >
              {newNotification.scheduledDate ? 'Schedule' : 'Save as Draft'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <Layout title="Notifications - EWA Box Water">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and send notifications to customers
          </p>
        </div>

        <div className="mb-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'history' | 'templates' | 'new')}
            >
              <option value="history">Notification History</option>
              <option value="templates">Templates</option>
              <option value="new">Create New</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`${
                    activeTab === 'history'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Notification History
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`${
                    activeTab === 'templates'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Templates
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`${
                    activeTab === 'new'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Create New
                </button>
              </nav>
            </div>
          </div>
        </div>

        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'new' && renderNewNotificationTab()}
      </div>
    </Layout>
  );
};

export default NotificationsPage;
