/**
 * Back4App REST API Client para EWA Box Water
 * Configuración para conectar con Parse Server en Back4App
 */

export interface Back4AppConfig {
  applicationId: string;
  restKey: string;
  masterKey: string;
  serverURL: string;
}

export class Back4AppClient {
  private config: Back4AppConfig;
  private baseURL: string;

  constructor(config: Back4AppConfig) {
    this.config = config;
    this.baseURL = `${config.serverURL}/classes`;
  }

  private getHeaders(useMasterKey: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'X-Parse-Application-Id': this.config.applicationId,
      'Content-Type': 'application/json',
    };

    if (useMasterKey) {
      headers['X-Parse-Master-Key'] = this.config.masterKey;
    } else {
      headers['X-Parse-REST-API-Key'] = this.config.restKey;
    }

    return headers;
  }

  // Métodos para usuarios
  async createUser(userData: any): Promise<any> {
    const response = await fetch(`${this.config.serverURL}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error creating user: ${response.statusText}`);
    }

    return response.json();
  }

  async loginUser(username: string, password: string): Promise<any> {
    const response = await fetch(`${this.config.serverURL}/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Error logging in: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentUser(sessionToken: string): Promise<any> {
    const response = await fetch(`${this.config.serverURL}/users/me`, {
      method: 'GET',
      headers: {
        ...this.getHeaders(),
        'X-Parse-Session-Token': sessionToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Error getting current user: ${response.statusText}`);
    }

    return response.json();
  }

  // Métodos genéricos para objetos Parse
  async createObject(className: string, data: any, useMasterKey: boolean = false): Promise<any> {
    const response = await fetch(`${this.baseURL}/${className}`, {
      method: 'POST',
      headers: this.getHeaders(useMasterKey),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error creating ${className}: ${response.statusText}`);
    }

    return response.json();
  }

  async getObjects(className: string, query?: any, useMasterKey: boolean = false): Promise<any> {
    let url = `${this.baseURL}/${className}`;
    
    if (query) {
      const queryString = new URLSearchParams();
      queryString.append('where', JSON.stringify(query));
      url += `?${queryString.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(useMasterKey),
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${className}: ${response.statusText}`);
    }

    return response.json();
  }

  async getObject(className: string, objectId: string, useMasterKey: boolean = false): Promise<any> {
    const response = await fetch(`${this.baseURL}/${className}/${objectId}`, {
      method: 'GET',
      headers: this.getHeaders(useMasterKey),
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${className} ${objectId}: ${response.statusText}`);
    }

    return response.json();
  }

  async updateObject(className: string, objectId: string, data: any, useMasterKey: boolean = false): Promise<any> {
    const response = await fetch(`${this.baseURL}/${className}/${objectId}`, {
      method: 'PUT',
      headers: this.getHeaders(useMasterKey),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error updating ${className} ${objectId}: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteObject(className: string, objectId: string, useMasterKey: boolean = false): Promise<any> {
    const response = await fetch(`${this.baseURL}/${className}/${objectId}`, {
      method: 'DELETE',
      headers: this.getHeaders(useMasterKey),
    });

    if (!response.ok) {
      throw new Error(`Error deleting ${className} ${objectId}: ${response.statusText}`);
    }

    return response.json();
  }

  // Métodos específicos para EWA
  async createSubscription(subscriptionData: any): Promise<any> {
    return this.createObject('Subscription', subscriptionData);
  }

  async getUserSubscriptions(userId: string): Promise<any> {
    return this.getObjects('Subscription', { user: { __type: 'Pointer', className: '_User', objectId: userId } });
  }

  async createPricingPlan(planData: any): Promise<any> {
    return this.createObject('PricingPlan', planData, true); // Usar master key para crear planes
  }

  async getPricingPlans(): Promise<any> {
    return this.getObjects('PricingPlan', { isActive: true });
  }
}

// Instancia singleton del cliente
let back4appClient: Back4AppClient | null = null;

export function getBack4AppClient(): Back4AppClient {
  if (!back4appClient) {
    const config: Back4AppConfig = {
      applicationId: process.env.NEXT_PUBLIC_BACK4APP_APPLICATION_ID || '',
      restKey: process.env.BACK4APP_REST_KEY || '',
      masterKey: process.env.BACK4APP_MASTER_KEY || '',
      serverURL: process.env.BACK4APP_SERVER_URL || 'https://parseapi.back4app.com',
    };

    if (!config.applicationId || !config.restKey) {
      throw new Error('Back4App configuration is missing. Please check your environment variables.');
    }

    back4appClient = new Back4AppClient(config);
  }

  return back4appClient;
}
