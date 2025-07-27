import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { SubscriptionPlan, PaymentMethod } from '@ewa/types';
import { ArrowLeft, CheckCircle, Check, Clock, Settings } from 'lucide-react';

const PlansPage = () => {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'plans' | 'checkout'>('plans');
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'payment' | 'review'>('address');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: 'PR',
    zipCode: '',
    instructions: ''
  });
  // const [selectedFrequency, setSelectedFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card' as const,
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCvc: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: 'PR',
      zipCode: '',
      country: 'US'
    }
  });
  const [startDate, setStartDate] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Mock data para demostración
        const mockPlans: SubscriptionPlan[] = [
          {
            id: 'plan_weekly_5gal',
            name: 'Plan Semanal Básico',
            description: 'Perfecto para familias pequeñas',
            productId: 'prod_5gal',
            productName: 'Agua Purificada EWA',
            productSize: '5 galones',
            frequency: 'weekly',
            price: 12.99,
            originalPrice: 15.99,
            discount: 19,
            minQuantity: 1,
            maxQuantity: 10,
            features: [
              'Entrega semanal',
              'Agua 100% purificada',
              'Botellón retornable',
              'Soporte 24/7'
            ],
            isPopular: false,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'plan_biweekly_5gal',
            name: 'Plan Quincenal Estándar',
            description: 'La opción más popular para familias',
            productId: 'prod_5gal',
            productName: 'Agua Purificada EWA',
            productSize: '5 galones',
            frequency: 'biweekly',
            price: 24.99,
            originalPrice: 31.98,
            discount: 22,
            minQuantity: 2,
            maxQuantity: 15,
            features: [
              'Entrega cada 2 semanas',
              'Agua 100% purificada',
              'Botellón retornable',
              'Descuento por volumen',
              'Soporte prioritario',
              'Flexibilidad de horarios'
            ],
            isPopular: true,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'plan_monthly_5gal',
            name: 'Plan Mensual Premium',
            description: 'Ideal para oficinas y familias grandes',
            productId: 'prod_5gal',
            productName: 'Agua Purificada EWA',
            productSize: '5 galones',
            frequency: 'monthly',
            price: 45.99,
            originalPrice: 63.96,
            discount: 28,
            minQuantity: 4,
            maxQuantity: 25,
            features: [
              'Entrega mensual',
              'Agua 100% purificada',
              'Botellón retornable',
              'Máximo descuento',
              'Soporte VIP',
              'Horarios flexibles',
              'Entrega gratuita',
              'Garantía de calidad'
            ],
            isPopular: false,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];

        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: 'pm_1',
            userId: 'user1',
            type: 'card',
            isDefault: true,
            cardLast4: '4242',
            cardBrand: 'Visa',
            cardExpMonth: 12,
            cardExpYear: 2027,
            billingAddress: {
              street: '123 Calle Principal',
              city: 'San Juan',
              state: 'PR',
              zipCode: '00901',
              country: 'US'
            },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];

        setPlans(mockPlans);
        setPaymentMethods(mockPaymentMethods);
        if (mockPaymentMethods.length > 0) {
          setSelectedPaymentMethod(mockPaymentMethods.find(pm => pm.isDefault)?.id || mockPaymentMethods[0].id);
        }

        // Set default start date to next week
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        setStartDate(nextWeek.toISOString().split('T')[0]);

      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    // setSelectedFrequency(plan.frequency);
    setQuantity(plan.minQuantity);
    setCurrentStep('checkout');
    setCheckoutStep('address');
  };

  const handleBackToPlans = () => {
    setCurrentStep('plans');
    setSelectedPlan(null);
    setCheckoutStep('address');
  };

  const calculateTotal = () => {
    if (!selectedPlan) return { subtotal: 0, tax: 0, total: 0 };
    
    const subtotal = selectedPlan.price * quantity;
    const tax = subtotal * 0.115; // 11.5% IVU en PR
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const handleAddressNext = () => {
    if (deliveryAddress.street && deliveryAddress.city && deliveryAddress.zipCode) {
      setCheckoutStep('payment');
    }
  };

  const handlePaymentNext = () => {
    if (selectedPaymentMethod || showAddPayment) {
      setCheckoutStep('review');
    }
  };

  const handleAddPaymentMethod = () => {
    const newPm: PaymentMethod = {
      id: `pm_${Date.now()}`,
      userId: 'user1',
      type: newPaymentMethod.type,
      isDefault: paymentMethods.length === 0,
      cardLast4: newPaymentMethod.cardNumber.slice(-4),
      cardBrand: 'Visa', // Mock
      cardExpMonth: parseInt(newPaymentMethod.cardExpMonth),
      cardExpYear: parseInt(newPaymentMethod.cardExpYear),
      billingAddress: newPaymentMethod.billingAddress,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPaymentMethods([...paymentMethods, newPm]);
    setSelectedPaymentMethod(newPm.id);
    setShowAddPayment(false);
    
    // Reset form
    setNewPaymentMethod({
      type: 'card',
      cardNumber: '',
      cardExpMonth: '',
      cardExpYear: '',
      cardCvc: '',
      cardholderName: '',
      billingAddress: {
        street: '',
        city: '',
        state: 'PR',
        zipCode: '',
        country: 'US'
      }
    });
  };

  const handleCompleteCheckout = async () => {
    if (!selectedPlan) return;

    try {
      const { total } = calculateTotal();
      
      // Simulate checkout data creation
      console.log('Creating subscription with:', {
        planId: selectedPlan.id,
        quantity,
        deliveryAddress,
        startDate,
        totalAmount: total
      });

      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccessMessage('¡Suscripción creada exitosamente! Recibirás tu primera entrega el ' + new Date(startDate).toLocaleDateString('es-PR'));
      
      // Redirect to subscriptions page after successful creation
      setTimeout(() => {
        router.push('/customer/subscriptions');
      }, 2000);

    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'weekly': return 'Semanal';
      case 'biweekly': return 'Quincenal';
      case 'monthly': return 'Mensual';
      default: return frequency;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando planes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {currentStep === 'plans' && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Planes de Suscripción</h1>
                <p className="text-xl text-gray-600">Elige el plan perfecto para tu familia u oficina</p>
              </div>

              {successMessage && (
                <div className="mb-8 bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {plans.map((plan) => (
                  <div 
                    key={plan.id} 
                    className={`relative bg-white border border-gray-200 rounded-lg ${plan.isPopular ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md'}`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Más Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                        
                        <div className="mt-4">
                          <div className="flex items-center justify-center">
                            <span className="text-4xl font-bold text-blue-600">${plan.price}</span>
                            <span className="text-gray-500 ml-2">/{getFrequencyLabel(plan.frequency).toLowerCase()}</span>
                          </div>
                          {plan.originalPrice && (
                            <div className="flex items-center justify-center mt-2">
                              <span className="text-lg text-gray-400 line-through">${plan.originalPrice}</span>
                              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                {plan.discount}% OFF
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-center text-sm text-gray-600 mb-4">
                          <span className="font-medium">{plan.productName}</span> • {plan.productSize}
                        </p>
                        <p className="text-center text-sm text-gray-500">
                          Cantidad: {plan.minQuantity} - {plan.maxQuantity} unidades
                        </p>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                            <span className="ml-3 text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                          plan.isPopular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                        onClick={() => handleSelectPlan(plan)}
                      >
                        Seleccionar Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">¿Por qué elegir EWA Box Water?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">100% Purificada</h3>
                    <p className="text-gray-600">Agua sometida a rigurosos procesos de purificación para garantizar la máxima calidad.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Entrega Puntual</h3>
                    <p className="text-gray-600">Entregas programadas y confiables en el horario que mejor te convenga.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Flexibilidad Total</h3>
                    <p className="text-gray-600">Pausa, modifica o cancela tu suscripción en cualquier momento sin penalizaciones.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 'checkout' && selectedPlan && (
            <>
              <div className="mb-6">
                <button
                  onClick={handleBackToPlans}
                  className="mb-4 inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Planes
                </button>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Configurar Suscripción</h1>
                <p className="mt-2 text-gray-600">{selectedPlan.name}</p>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-center">
                  <div className={`flex items-center ${checkoutStep === 'address' ? 'text-blue-600' : checkoutStep === 'payment' || checkoutStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${checkoutStep === 'address' ? 'border-blue-600 bg-blue-600 text-white' : checkoutStep === 'payment' || checkoutStep === 'review' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                      1
                    </span>
                    <span className="ml-2 text-sm font-medium">Dirección</span>
                  </div>
                  <div className={`flex-1 h-1 mx-4 max-w-xs ${checkoutStep === 'payment' || checkoutStep === 'review' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center ${checkoutStep === 'payment' ? 'text-blue-600' : checkoutStep === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${checkoutStep === 'payment' ? 'border-blue-600 bg-blue-600 text-white' : checkoutStep === 'review' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                      2
                    </span>
                    <span className="ml-2 text-sm font-medium">Pago</span>
                  </div>
                  <div className={`flex-1 h-1 mx-4 max-w-xs ${checkoutStep === 'review' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <div className={`flex items-center ${checkoutStep === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${checkoutStep === 'review' ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                      3
                    </span>
                    <span className="ml-2 text-sm font-medium">Revisar</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {/* Address Step */}
                  {checkoutStep === 'address' && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Dirección de Entrega</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                          <input
                            type="text"
                            value={deliveryAddress.street}
                            onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Calle y número"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                            <input
                              type="text"
                              value={deliveryAddress.city}
                              onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ciudad"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                            <input
                              type="text"
                              value={deliveryAddress.zipCode}
                              onChange={(e) => setDeliveryAddress({...deliveryAddress, zipCode: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="00901"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Instrucciones especiales (opcional)</label>
                          <textarea
                            value={deliveryAddress.instructions}
                            onChange={(e) => setDeliveryAddress({...deliveryAddress, instructions: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Instrucciones para el repartidor..."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                            <select
                              value={quantity}
                              onChange={(e) => setQuantity(parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {Array.from({length: selectedPlan.maxQuantity - selectedPlan.minQuantity + 1}, (_, i) => selectedPlan.minQuantity + i).map(q => (
                                <option key={q} value={q}>{q} unidades</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de inicio</label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={handleAddressNext}
                          disabled={!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zipCode}
                          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Continuar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Step */}
                  {checkoutStep === 'payment' && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Método de Pago</h4>
                      
                      {!showAddPayment ? (
                        <div className="space-y-4">
                          {paymentMethods.map((pm) => (
                            <label key={pm.id} className="flex items-start">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={pm.id}
                                checked={selectedPaymentMethod === pm.id}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">
                                    {pm.cardBrand} ****{pm.cardLast4}
                                  </span>
                                  {pm.isDefault && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Predeterminado
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">
                                  Expira {pm.cardExpMonth}/{pm.cardExpYear}
                                </p>
                              </div>
                            </label>
                          ))}
                          
                          <button
                            onClick={() => setShowAddPayment(true)}
                            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="mt-2 block text-sm font-medium text-gray-600">Agregar nuevo método de pago</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Número de tarjeta</label>
                            <input
                              type="text"
                              value={newPaymentMethod.cardNumber}
                              onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardNumber: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                              <select
                                value={newPaymentMethod.cardExpMonth}
                                onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardExpMonth: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">MM</option>
                                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                  <option key={month} value={month.toString().padStart(2, '0')}>
                                    {month.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                              <select
                                value={newPaymentMethod.cardExpYear}
                                onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardExpYear: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">YYYY</option>
                                {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                              <input
                                type="text"
                                value={newPaymentMethod.cardCvc}
                                onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardCvc: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="123"
                                maxLength={4}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del titular</label>
                            <input
                              type="text"
                              value={newPaymentMethod.cardholderName}
                              onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardholderName: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Juan Pérez"
                            />
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={handleAddPaymentMethod}
                              disabled={!newPaymentMethod.cardNumber || !newPaymentMethod.cardExpMonth || !newPaymentMethod.cardExpYear || !newPaymentMethod.cardCvc}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              Agregar tarjeta
                            </button>
                            <button
                              onClick={() => setShowAddPayment(false)}
                              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {!showAddPayment && (
                        <div className="mt-6 flex space-x-3">
                          <button
                            onClick={() => setCheckoutStep('address')}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Atrás
                          </button>
                          <button
                            onClick={handlePaymentNext}
                            disabled={!selectedPaymentMethod}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            Continuar
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Step */}
                  {checkoutStep === 'review' && (
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Revisar Pedido</h4>
                      
                      <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Plan Seleccionado</h5>
                          <p className="text-gray-600">{selectedPlan.name} - {quantity} unidades</p>
                          <p className="text-sm text-gray-500">{getFrequencyLabel(selectedPlan.frequency)} • ${selectedPlan.price} cada entrega</p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Dirección de Entrega</h5>
                          <p className="text-gray-600">
                            {deliveryAddress.street}<br />
                            {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}
                          </p>
                          {deliveryAddress.instructions && (
                            <p className="text-sm text-gray-500 mt-1">Instrucciones: {deliveryAddress.instructions}</p>
                          )}
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Método de Pago</h5>
                          {(() => {
                            const pm = paymentMethods.find(p => p.id === selectedPaymentMethod);
                            return pm ? (
                              <p className="text-gray-600">{pm.cardBrand} ****{pm.cardLast4}</p>
                            ) : null;
                          })()}
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Fecha de Inicio</h5>
                          <p className="text-gray-600">{new Date(startDate).toLocaleDateString('es-PR')}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex space-x-3">
                        <button
                          onClick={() => setCheckoutStep('payment')}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Atrás
                        </button>
                        <button
                          onClick={handleCompleteCheckout}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Completar Suscripción
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Resumen del Pedido</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{selectedPlan.name} × {quantity}</span>
                        <span className="font-medium">${(selectedPlan.price * quantity).toFixed(2)}</span>
                      </div>
                      
                      {selectedPlan.discount && (
                        <div className="flex justify-between text-green-600">
                          <span>Descuento ({selectedPlan.discount}%)</span>
                          <span>-${((selectedPlan.originalPrice! - selectedPlan.price) * quantity).toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">IVU (11.5%)</span>
                        <span className="font-medium">${calculateTotal().tax.toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-medium text-gray-900">Total</span>
                          <span className="text-lg font-bold text-blue-600">${calculateTotal().total.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Se cobrará {getFrequencyLabel(selectedPlan.frequency).toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PlansPage;