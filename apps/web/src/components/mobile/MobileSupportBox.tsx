import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  HelpCircle,
  X,
  ChevronRight,
  Star
} from 'lucide-react';

interface MobileSupportBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: () => void;
  onCall: () => void;
  onEmail: () => void;
}

const MobileSupportBox: React.FC<MobileSupportBoxProps> = ({
  isOpen,
  onClose,
  onStartChat,
  onCall,
  onEmail
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const supportCategories = [
    {
      id: 'subscriptions',
      title: 'Suscripciones',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'Cambios, pausas, cancelaciones',
      color: 'bg-blue-500'
    },
    {
      id: 'deliveries',
      title: 'Entregas',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Seguimiento, reprogramar, problemas',
      color: 'bg-green-500'
    },
    {
      id: 'billing',
      title: 'Facturación',
      icon: <HelpCircle className="w-5 h-5" />,
      description: 'Pagos, facturas, reembolsos',
      color: 'bg-purple-500'
    },
    {
      id: 'technical',
      title: 'Soporte Técnico',
      icon: <HelpCircle className="w-5 h-5" />,
      description: 'Problemas con la app o servicio',
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    {
      id: 'chat',
      title: 'Chat en vivo',
      subtitle: 'Respuesta inmediata',
      icon: <MessageCircle className="w-6 h-6" />,
      action: onStartChat,
      color: 'bg-gradient-to-r from-blue-600 to-purple-600',
      online: true
    },
    {
      id: 'call',
      title: 'Llamar',
      subtitle: '1-800-EWA-HELP',
      icon: <Phone className="w-6 h-6" />,
      action: onCall,
      color: 'bg-green-600',
      online: true
    },
    {
      id: 'email',
      title: 'Email',
      subtitle: 'soporte@ewa.com',
      icon: <Mail className="w-6 h-6" />,
      action: onEmail,
      color: 'bg-blue-600',
      online: true
    }
  ];

  const faqs = [
    {
      question: '¿Cómo pausar mi suscripción?',
      answer: 'Ve a tu perfil > Suscripciones > Selecciona la suscripción > Pausar'
    },
    {
      question: '¿Puedo cambiar mi dirección de entrega?',
      answer: 'Sí, en Perfil > Ubicaciones puedes agregar o editar direcciones'
    },
    {
      question: '¿Cuál es el horario de entrega?',
      answer: 'Entregamos de lunes a viernes de 8:00 AM a 6:00 PM'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-1">¿Necesitas ayuda?</h2>
            <p className="text-white/90 text-sm">Chatea con nuestro equipo de soporte</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-200">¡Estamos en línea!</span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Acciones rápidas */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Contacto directo</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`w-full ${action.color} text-white p-4 rounded-xl flex items-center justify-between hover:scale-[1.02] transition-transform duration-200`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {action.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{action.title}</p>
                      <p className="text-sm text-white/90">{action.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Categorías de soporte */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">¿En qué te puedo ayudar?</h3>
            <div className="grid grid-cols-2 gap-3">
              {supportCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
                >
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-white mb-2`}>
                    {category.icon}
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{category.title}</h4>
                  <p className="text-xs text-gray-600">{category.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Preguntas frecuentes</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{faq.question}</h4>
                  <p className="text-xs text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Información de contacto</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Lunes a Viernes: 8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-600" />
                <span>1-800-EWA-HELP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>soporte@ewa.com</span>
              </div>
            </div>
          </div>

          {/* Calificación */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-2">¿Te ayudó este soporte?</p>
            <div className="flex items-center justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Star className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSupportBox;
