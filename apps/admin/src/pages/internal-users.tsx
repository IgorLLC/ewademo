import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button, Card } from '@ewa/ui';

// Tipos para usuarios internos
interface InternalUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'editor' | 'support';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
}

const InternalUsersPage: React.FC = () => {
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<InternalUser | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'operator',
    permissions: [] as string[]
  });

  // Definimos los permisos disponibles por rol
  const rolePermissions = {
    admin: [
      'manage_users',
      'manage_subscriptions',
      'manage_products',
      'manage_content',
      'view_metrics',
      'manage_routes',
      'manage_inventory',
      'send_notifications',
      'manage_support',
      'system_settings'
    ],
    operator: [
      'view_subscriptions',
      'manage_routes',
      'manage_inventory',
      'view_metrics'
    ],
    editor: [
      'manage_content',
      'view_metrics'
    ],
    support: [
      'view_users',
      'view_subscriptions',
      'manage_support'
    ]
  };

  useEffect(() => {
    // Simulamos la carga de usuarios internos
    const mockUsers: InternalUser[] = [
      {
        id: 'user_1',
        name: 'María López',
        email: 'maria@ewaboxwater.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2023-10-20 09:45',
        createdAt: '2023-01-15',
        permissions: rolePermissions.admin
      },
      {
        id: 'user_2',
        name: 'Carlos Rodríguez',
        email: 'carlos@ewaboxwater.com',
        role: 'operator',
        status: 'active',
        lastLogin: '2023-10-19 14:30',
        createdAt: '2023-02-20',
        permissions: rolePermissions.operator
      },
      {
        id: 'user_3',
        name: 'Ana Morales',
        email: 'ana@ewaboxwater.com',
        role: 'editor',
        status: 'active',
        lastLogin: '2023-10-18 11:15',
        createdAt: '2023-03-10',
        permissions: rolePermissions.editor
      },
      {
        id: 'user_4',
        name: 'Roberto Díaz',
        email: 'roberto@ewaboxwater.com',
        role: 'support',
        status: 'active',
        lastLogin: '2023-10-20 08:20',
        createdAt: '2023-04-05',
        permissions: rolePermissions.support
      },
      {
        id: 'user_5',
        name: 'Luisa Vega',
        email: 'luisa@ewaboxwater.com',
        role: 'operator',
        status: 'inactive',
        lastLogin: '2023-09-15 10:30',
        createdAt: '2023-05-12',
        permissions: rolePermissions.operator
      }
    ];

    setUsers(mockUsers);
  }, []);

  const handleUserSelect = (user: InternalUser) => {
    setSelectedUser(user);
    setIsAddingUser(false);
    setIsEditingUser(false);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddingUser(true);
    setIsEditingUser(false);
    setFormData({
      name: '',
      email: '',
      role: 'operator',
      permissions: rolePermissions.operator
    });
  };

  const handleEditUser = () => {
    if (selectedUser) {
      setIsEditingUser(true);
      setIsAddingUser(false);
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        permissions: [...selectedUser.permissions]
      });
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData({
      ...formData,
      role: role as 'admin' | 'operator' | 'editor' | 'support',
      permissions: rolePermissions[role as keyof typeof rolePermissions]
    });
  };

  const handlePermissionToggle = (permission: string) => {
    const updatedPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({
      ...formData,
      permissions: updatedPermissions
    });
  };

  const handleSaveUser = () => {
    if (isAddingUser) {
      const newUser: InternalUser = {
        id: `user_${users.length + 1}`,
        name: formData.name,
        email: formData.email,
        role: formData.role as 'admin' | 'operator' | 'editor' | 'support',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        permissions: formData.permissions
      };
      
      setUsers([...users, newUser]);
      setSelectedUser(newUser);
      setIsAddingUser(false);
    } else if (isEditingUser && selectedUser) {
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            name: formData.name,
            email: formData.email,
            role: formData.role as 'admin' | 'operator' | 'editor' | 'support',
            permissions: formData.permissions
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setSelectedUser({
        ...selectedUser,
        name: formData.name,
        email: formData.email,
        role: formData.role as 'admin' | 'operator' | 'editor' | 'support',
        permissions: formData.permissions
      });
      setIsEditingUser(false);
    }
  };

  const handleToggleStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        return {
          ...user,
          status: newStatus
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({
        ...selectedUser,
        status: selectedUser.status === 'active' ? 'inactive' : 'active'
      });
    }
  };

  const handleCancel = () => {
    setIsAddingUser(false);
    setIsEditingUser(false);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'operator':
        return 'bg-blue-100 text-blue-800';
      case 'editor':
        return 'bg-green-100 text-green-800';
      case 'support':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const renderUserForm = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
        >
          <option value="admin">Administrator</option>
          <option value="operator">Operator</option>
          <option value="editor">Content Editor</option>
          <option value="support">Support Agent</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permissions
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
          {Object.entries(rolePermissions).flatMap(([role, permissions]) => 
            permissions.map(permission => (
              <div key={permission} className="flex items-center">
                <input
                  id={`permission-${permission}`}
                  name={`permission-${permission}`}
                  type="checkbox"
                  checked={formData.permissions.includes(permission)}
                  onChange={() => handlePermissionToggle(permission)}
                  className="h-4 w-4 text-ewa-blue focus:ring-ewa-blue border-gray-300 rounded"
                />
                <label htmlFor={`permission-${permission}`} className="ml-2 block text-sm text-gray-700">
                  {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </label>
              </div>
            ))
          ).filter((v, i, a) => a.findIndex(t => (t.key === v.key)) === i)}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          onClick={handleCancel}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveUser}
          disabled={!formData.name || !formData.email}
        >
          {isAddingUser ? 'Add User' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  const renderUserDetails = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {selectedUser?.name}
          </h3>
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(selectedUser?.role || '')}`}>
              {selectedUser?.role.charAt(0).toUpperCase() + selectedUser?.role.slice(1)}
            </span>
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedUser?.status || '')}`}>
              {selectedUser?.status.charAt(0).toUpperCase() + selectedUser?.status.slice(1)}
            </span>
          </div>
        </div>
        <div>
          <Button
            onClick={handleEditUser}
            variant="secondary"
            size="small"
            className="mr-2"
          >
            Edit
          </Button>
          <Button
            onClick={() => selectedUser && handleToggleStatus(selectedUser.id)}
            variant={selectedUser?.status === 'active' ? 'danger' : 'primary'}
            size="small"
          >
            {selectedUser?.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Email</h4>
          <p className="mt-1">{selectedUser?.email}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Created</h4>
          <p className="mt-1">{selectedUser?.createdAt}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Last Login</h4>
          <p className="mt-1">{selectedUser?.lastLogin || 'Never'}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Permissions</h4>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedUser?.permissions.map(permission => (
              <div key={permission} className="flex items-center">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-sm text-gray-700">
                  {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title="Internal Users - EWA Box Water">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Internal Users</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage staff accounts and permissions
              </p>
            </div>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                  <li key={user.id}>
                    <button
                      onClick={() => handleUserSelect(user)}
                      className={`w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none ${
                        selectedUser?.id === user.id ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full">
              <div className="px-4 py-5 sm:p-6">
                {isAddingUser || isEditingUser ? (
                  renderUserForm()
                ) : selectedUser ? (
                  renderUserDetails()
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Select a user to view details</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InternalUsersPage;
