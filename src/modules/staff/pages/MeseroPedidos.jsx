import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { ordersService } from '../../../services/orders';
import { C, FONT, glow } from '../../../styles/designTokens';
import { 
  ClipboardList, 
  RefreshCw, 
  Clock, 
  Flame,
  CheckCircle,
  Truck,
  XCircle,
  ChefHat,
  ArrowLeft,
  MapPin,
  Utensils
} from 'lucide-react';

/* ─── ESTADOS Y COLORES ─── */
const ESTADO = {
  pendiente:      { label: 'En fila',          color: C.yellow, Icon: Clock },
  en_preparacion: { label: 'En preparación',   color: C.orange, Icon: Flame },
  listo:          { label: '¡Listo!',          color: C.teal,   Icon: CheckCircle },
  entregado:      { label: 'Entregado',        color: C.textMuted, Icon: Truck },
  cancelado:      { label: 'Cancelado',        color: C.pink,   Icon: XCircle },
};

/* ─── ORDER CARD PARA MESERO ─── */
function MeseroOrderCard({ order }) {
  const estado = ESTADO[order.sEstado] || ESTADO.pendiente;
  const isListo = order.sEstado === 'listo';

  return (
    <div style={{ 
      background: C.bgCard, 
      border: `1.5px solid ${isListo ? C.teal : C.border}`, 
      borderRadius: '16px', 
      overflow: 'hidden',
      boxShadow: isListo ? glow(C.teal, '15') : 'none',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ height: '4px', background: estado.color }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ color: C.textPrimary, fontWeight: '800', fontSize: '18px' }}>Pedido #{order.id}</div>
            <div style={{ color: C.textMuted, fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              {new Date(order.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '5px', 
            background: `${estado.color}18`, 
            border: `1px solid ${estado.color}44`, 
            color: estado.color, 
            borderRadius: '20px', 
            padding: '4px 12px', 
            fontSize: '12px', 
            fontWeight: '700' 
          }}>
            <estado.Icon size={14} /> {estado.label}
          </div>
        </div>

        {/* Lista de productos */}
        <div style={{ 
          background: C.bgAccent, 
          borderRadius: '12px', 
          padding: '12px', 
          marginBottom: '16px',
          flex: 1
        }}>
          <h4 style={{ color: C.textSecondary, margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Platillos:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(order.items || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ color: C.textMuted, fontWeight: '700', fontSize: '12px', background: C.bgCard, borderRadius: '4px', padding: '1px 6px' }}>x{item.iCantidad}</span>
                <div style={{ color: C.textPrimary, fontSize: '13px', fontWeight: '600', lineHeight: 1.3 }}>
                  {item.producto?.sNombre || `Prod #${item.iProductoId}`}
                </div>
              </div>
            ))}
          </div>
          {order.sNotas && (
            <div style={{ 
              marginTop: '12px', 
              paddingTop: '12px', 
              borderTop: `1px dashed ${C.borderBright}`,
              color: C.yellow,
              fontSize: '12px',
              fontStyle: 'italic'
            }}>
              <span style={{ fontWeight: '700' }}>Nota:</span> {order.sNotas}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MeseroPedidos = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadActiveOrders = useCallback(async () => {
    try {
      const data = await ordersService.getAll();
      const allOrders = data.data || data || [];
      // Filtrar solo las ordenes activas para el mesero (pendiente, preparado, listo)
      // Y que la orden haya sido creada por este mesero
      const active = allOrders.filter(o => 
        ['pendiente', 'en_preparacion', 'listo'].includes(o.sEstado) &&
        (o.iUsuarioId === user?.id || o.usuario?.id === user?.id)
      );
      
      setOrders(active);
      setError(null);
    } catch (err) {
      console.error("Error cargando pedidos del mesero:", err);
      setError("No se pudieron cargar los pedidos activos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadActiveOrders();
    // Auto-refresh cada 15 segundos
    const interval = setInterval(loadActiveOrders, 15000);
    return () => clearInterval(interval);
  }, [loadActiveOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadActiveOrders();
  };

  // Agrupar por Mesa
  const ordersByMesa = orders.reduce((acc, current) => {
    const mesaId = current.iMesaId || 'Sin Mesa';
    if (!acc[mesaId]) {
      acc[mesaId] = [];
    }
    acc[mesaId].push(current);
    return acc;
  }, {});

  // Ordenar mesas
  const sortedMesaKeys = Object.keys(ordersByMesa).sort((a, b) => {
    if (a === 'Sin Mesa') return 1;
    if (b === 'Sin Mesa') return -1;
    return parseInt(a) - parseInt(b);
  });

  const pendingCount = orders.filter(o => o.sEstado === 'pendiente').length;
  const readyCount = orders.filter(o => o.sEstado === 'listo').length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT }}>
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          flexWrap: 'wrap', gap: '16px', marginBottom: '32px',
          background: C.bgCard, padding: '24px', borderRadius: '20px', border: `1.5px solid ${C.border}`
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <button 
                onClick={() => navigate('/tables')}
                style={{ 
                  width: '32px', height: '32px', borderRadius: '8px', 
                  background: C.bgAccent, border: `1px solid ${C.borderBright}`, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: C.textSecondary
                }}
              >
                <ArrowLeft size={16} />
              </button>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '8px', 
                background: `${C.purple}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <ClipboardList size={18} color={C.purple} />
              </div>
              <span style={{ color: C.purple, fontSize: '13px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Monitoreo de Pedidos
              </span>
            </div>
            <h1 style={{ margin: 0, color: C.textPrimary, fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: '900' }}>
              Pedidos por Mesa
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ background: `${C.yellow}15`, border: `1px solid ${C.yellow}44`, borderRadius: '10px', padding: '10px 16px' }}>
                <div style={{ color: C.textMuted, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>En preparación</div>
                <div style={{ color: C.yellow, fontSize: '20px', fontWeight: '900' }}>{pendingCount}</div>
              </div>
              <div style={{ background: `${C.teal}15`, border: `1px solid ${C.teal}44`, borderRadius: '10px', padding: '10px 16px' }}>
                <div style={{ color: C.textMuted, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Listos para entregar</div>
                <div style={{ color: C.teal, fontSize: '20px', fontWeight: '900' }}>{readyCount}</div>
              </div>
            </div>

            <button 
              onClick={handleRefresh}
              style={{
                height: '48px',
                background: C.bgAccent, border: `1.5px solid ${C.borderBright}`, borderRadius: '12px',
                padding: '0 20px', color: C.textSecondary, fontFamily: FONT, fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <RefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} /> 
              Actualizar
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ 
              display: 'inline-block', width: '48px', height: '48px', 
              border: `4px solid ${C.border}`, borderTopColor: C.purple, borderRadius: '50%', 
              animation: 'spin 0.8s linear infinite' 
            }} />
            <p style={{ marginTop: '16px', color: C.textMuted, fontWeight: '600' }}>Cargando pedidos activos...</p>
          </div>
        ) : error ? (
          <div style={{ background: `${C.pink}12`, border: `1px solid ${C.pink}44`, borderRadius: '16px', padding: '24px', color: C.pink, textAlign: 'center', fontWeight: '600' }}>
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: C.bgCard, borderRadius: '24px', border: `1.5px dashed ${C.border}` }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '24px', 
              background: `${C.teal}15`, border: `2px solid ${C.teal}33`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 24px', boxShadow: glow(C.teal, '22') 
            }}>
              <CheckCircle size={40} color={C.teal} />
            </div>
            <h2 style={{ color: C.textPrimary, margin: '0 0 12px', fontWeight: '900', fontSize: '24px' }}>
              ¡Todo bajo control!
            </h2>
            <p style={{ color: C.textSecondary, margin: 0, fontSize: '16px' }}>
              No hay pedidos activos actualmente.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sortedMesaKeys.map(mesa => (
              <div key={mesa} style={{ 
                background: C.bgCard, 
                border: `1.5px solid ${C.border}`, 
                borderRadius: '24px', 
                overflow: 'hidden' 
              }}>
                {/* Cabecera Mesa */}
                <div style={{ 
                  background: C.bgAccent, 
                  padding: '16px 24px', 
                  borderBottom: `1.5px solid ${C.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '12px', 
                    background: `${C.teal}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${C.teal}44`
                  }}>
                    <MapPin size={20} color={C.teal} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: C.textPrimary }}>
                      {mesa === 'Sin Mesa' ? 'Pedidos sin mesa' : `Mesa ${mesa}`}
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: C.textMuted, fontWeight: '600' }}>
                      {ordersByMesa[mesa].length} pedido(s) activo(s)
                    </p>
                  </div>
                </div>
                
                {/* Grind de Pedidos para esta Mesa */}
                <div style={{ 
                  padding: '24px', 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                  gap: '24px'
                }}>
                  {ordersByMesa[mesa].map(o => (
                    <MeseroOrderCard key={o.id} order={o} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MeseroPedidos;
