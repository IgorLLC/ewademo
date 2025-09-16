import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Send, Phone, Mail } from 'lucide-react';

interface MobileFloatingChatProps {
  isOnline?: boolean;
  onStartChat?: () => void;
  onCall?: () => void;
  onEmail?: () => void;
}

const MobileFloatingChat: React.FC<MobileFloatingChatProps> = ({
  isOnline = true,
  onStartChat,
  onCall,
  onEmail
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    type: 'user' | 'support';
    message: string;
    timestamp: Date;
  }>>([
    {
      id: '1',
      type: 'support',
      message: '¡Hola! ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar chat si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        if (isExpanded && !isMinimized) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, isMinimized]);

  const handleStartChat = () => {
    setIsExpanded(true);
    setIsMinimized(false);
    onStartChat?.();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        message: message.trim(),
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simular respuesta del soporte
      setTimeout(() => {
        const supportResponse = {
          id: (Date.now() + 1).toString(),
          type: 'support' as const,
          message: 'Gracias por tu mensaje. Un agente te responderá en breve.',
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, supportResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const closeChat = () => {
    setIsExpanded(false);
    setIsMinimized(false);
  };

  // Si está minimizado, solo mostrar el bubble pequeño
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-200"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  // Si está expandido, mostrar el chat completo
  if (isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]" ref={chatRef}>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header del chat */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Soporte EWA</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <span className="text-xs text-white/90">
                      {isOnline ? 'En línea' : 'Desconectado'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Historial del chat */}
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input del mensaje */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onCall}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar</span>
              </button>
              <button
                onClick={onEmail}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado inicial: solo el bubble flotante
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Indicador de estado online */}
        {isOnline && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        )}
        
        {/* Bubble principal */}
        <button
          onClick={handleStartChat}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-200 group"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
        
        {/* Tooltip flotante */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            ¿Necesitas ayuda?
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 ml-auto mr-2"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileFloatingChat;
