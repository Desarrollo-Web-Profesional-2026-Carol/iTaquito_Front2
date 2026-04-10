import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { C, FONT, glow } from '../../../styles/designTokens';
import {
  LayoutDashboard, TableProperties, UtensilsCrossed,
  Users, BarChart3, TrendingUp, TrendingDown,
  Clock, CheckCircle, XCircle, AlertCircle,
  ShoppingBag, DollarSign, Star, ArrowRight,
  Activity, RefreshCw
} from 'lucide-react';
import { tablesService } from '../../../services/tables';
import { ordersService } from '../../../services/orders';

/* ─── STAT CARD ──────────────────────────────────────────────── */
function StatCard({ label, value, sub, Icon, color, trend, trendValue }) {
  const [hov, setHov] = useState(false);
  const isUp = trend === 'up';

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.bgCardHov : C.bgCard,
        border: `1.5px solid ${hov ? color : C.border}`,
        borderRadius: "16px",
        padding: "22px",
        transition: "all 0.22s ease",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? `0 12px 28px rgba(0,0,0,0.3), ${glow(color, "18")}` : "0 2px 8px rgba(0,0,0,0.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color, boxShadow: 'none' }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{
          width: "42px", height: "42px", borderRadius: "10px",
          background: `${color}18`, border: `1.5px solid ${color}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={20} color={color} />
        </div>
        {trend && (
          <div style={{
            display: "flex", alignItems: "center", gap: "3px",
            background: isUp ? `${C.teal}18` : `${C.pink}18`,
            border: `1px solid ${isUp ? C.teal : C.pink}44`,
            borderRadius: "20px", padding: "3px 8px",
            color: isUp ? C.teal : C.pink,
            fontSize: "11px", fontWeight: "700",
          }}>
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trendValue}
          </div>
        )}
      </div>

      <div style={{ color: C.textPrimary, fontSize: "30px", fontWeight: "800", lineHeight: 1, marginBottom: "6px" }}>
        {value}
      </div>
      <div style={{ color: C.textSecondary, fontSize: "13px", fontWeight: "600" }}>{label}</div>
      {sub && <div style={{ color: C.textMuted, fontSize: "11px", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

/* ─── ACTIVITY ITEM ──────────────────────────────────────────── */
function ActivityItem({ icon: Icon, color, title, sub, time }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "10px 0",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={15} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: C.textPrimary, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        <div style={{ color: C.textMuted, fontSize: "11px", marginTop: "1px" }}>{sub}</div>
      </div>
      <div style={{ color: C.textMuted, fontSize: "11px", flexShrink: 0 }}>{time}</div>
    </div>
  );
}

/* ─── QUICK ACTION BUTTON ────────────────────────────────────── */
function QuickAction({ label, Icon, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `${color}22` : `${color}10`,
        border: `1.5px solid ${hov ? color : color + "44"}`,
        borderRadius: "12px", padding: "14px 16px",
        cursor: "pointer", fontFamily: FONT,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        transition: "all 0.2s",
        boxShadow: hov ? glow(color, "22") : "none",
      }}
    >
      <Icon size={22} color={color} />
      <span style={{ color: hov ? color : C.textSecondary, fontSize: "12px", fontWeight: "700" }}>{label}</span>
    </button>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────────── */
const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para datos reales
  const [stats, setStats] = useState({
    totalMesas: 0,
    mesasOcupadas: 0,
    mesasDisponibles: 0,
    mesasReservadas: 0,
    pedidosPendientes: 0,
    pedidosPreparacion: 0,
    pedidosActivos: 0,
    ventasDia: 0,
    ventasSemana: 0,
    calificacion: 4.8
  });
  const [actividad, setActividad] = useState([]);
  const [mesasPreview, setMesasPreview] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirigir si no es admin
  useEffect(() => {
    if (!isAdmin && user) {
      // Redirigir según el rol del usuario
      const rolRedirects = {
        mesero: '/tables',
        caja: '/orders',
        mesa: '/menu'
      };
      navigate(rolRedirects[user?.rol] || '/');
    }
  }, [isAdmin, user, navigate]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

   useEffect(() => {
    // Si no es admin, redirige al 403
    if (user.rol !== 'admin') {
      navigate('/403', { replace: true });
    }
  }, [user.rol, navigate]);


  // Función para formatear tiempo relativo
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Reciente';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return `Hace ${diffDays} d`;
  };

  // Cargar datos del dashboard
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Cargar mesas
      const mesasData = await tablesService.getAll();
      const mesas = Array.isArray(mesasData) ? mesasData : (mesasData.data || []);
      
      // Crear mapa de mesas por ID para acceder rápidamente al nombre
      const mesasMap = {};
      mesas.forEach(mesa => {
        mesasMap[mesa.id] = mesa;
      });
      
      const totalMesas = mesas.length;
      const mesasOcupadas = mesas.filter(m => m.sEstado === 'ocupada').length;
      const mesasDisponibles = mesas.filter(m => m.sEstado === 'disponible').length;
      const mesasReservadas = mesas.filter(m => m.sEstado === 'reservada').length;
      
      // 2. Cargar pedidos
      const pedidosData = await ordersService.getAll();
      const pedidos = Array.isArray(pedidosData) ? pedidosData : (pedidosData.data || []);
      
      const pedidosPendientes = pedidos.filter(p => p.sEstado === 'pendiente').length;
      const pedidosPreparacion = pedidos.filter(p => p.sEstado === 'en_preparacion').length;
      const pedidosActivos = pedidosPendientes + pedidosPreparacion;
      
      // 3. Calcular ventas del día (pedidos entregados hoy)
      const hoy = new Date().toISOString().split('T')[0];
      const pedidosHoy = pedidos.filter(p => {
        if (!p.createdAt) return false;
        const fechaPedido = new Date(p.createdAt).toISOString().split('T')[0];
        return fechaPedido === hoy && p.sEstado === 'entregado';
      });
      
      const ventasDia = pedidosHoy.reduce((total, p) => total + (parseFloat(p.dTotal) || 0), 0);
      
      // 4. Calcular ventas de la semana
      const unaSemanaAtras = new Date();
      unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);
      const pedidosSemana = pedidos.filter(p => {
        if (!p.createdAt) return false;
        const fechaPedido = new Date(p.createdAt);
        return fechaPedido >= unaSemanaAtras && p.sEstado === 'entregado';
      });
      
      const ventasSemana = pedidosSemana.reduce((total, p) => total + (parseFloat(p.dTotal) || 0), 0);
      
      // 5. Calcular calificación promedio (si tienes reviews, si no, placeholder)
      const calificacion = 4.8;
      
      // 6. Preparar actividad reciente (últimos 6 eventos)
      const eventos = [];
      
      // Agregar cambios de estado de pedidos recientes
      const pedidosRecientes = [...pedidos]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 8);
      
      pedidosRecientes.forEach(pedido => {
        const estadoMap = {
          'pendiente': { icon: Clock, color: C.yellow, label: 'creado' },
          'en_preparacion': { icon: UtensilsCrossed, color: C.orange, label: 'en preparación' },
          'listo': { icon: CheckCircle, color: C.teal, label: 'listo' },
          'entregado': { icon: ShoppingBag, color: C.purple, label: 'entregado' },
          'cancelado': { icon: XCircle, color: C.error, label: 'cancelado' }
        };
        const estadoInfo = estadoMap[pedido.sEstado] || estadoMap.pendiente;
        
        // Obtener el nombre de la mesa usando el mapa
        const mesa = mesasMap[pedido.iMesaId];
        const nombreMesa = mesa?.sNombre || `Mesa ${pedido.iMesaId}`;
        
        eventos.push({
          icon: estadoInfo.icon,
          color: estadoInfo.color,
          title: `Pedido #${pedido.id} ${estadoInfo.label}`,
          sub: `Lugar: ${nombreMesa} · Total $${parseFloat(pedido.dTotal || 0).toFixed(2)}`,
          time: formatTimeAgo(pedido.updatedAt || pedido.createdAt)
        });
      });
      
      // Agregar cambios de estado de mesas recientes
      const mesasRecientes = [...mesas]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 4);
      
      mesasRecientes.forEach(mesa => {
        const estadoMap = {
          'disponible': { icon: CheckCircle, color: C.teal, label: 'disponible' },
          'ocupada': { icon: Users, color: C.orange, label: 'ocupada' },
          'reservada': { icon: Clock, color: C.yellow, label: 'reservada' },
          'inactiva': { icon: XCircle, color: C.textMuted, label: 'inactiva' }
        };
        const estadoInfo = estadoMap[mesa.sEstado] || estadoMap.disponible;
        
        eventos.push({
          icon: estadoInfo.icon,
          color: estadoInfo.color,
          title: `Mesa ${mesa.sNombre || mesa.id} ${estadoInfo.label}`,
          sub: `Capacidad: ${mesa.iCapacidad} personas · ${mesa.sUbicacion || 'interior'}`,
          time: formatTimeAgo(mesa.updatedAt)
        });
      });
      
      // Ordenar por tiempo y tomar los primeros 6
      const actividadReciente = eventos
        .sort((a, b) => {
          const getMinutes = (timeStr) => {
            if (timeStr.includes('Ahora')) return 0;
            const match = timeStr.match(/\d+/);
            if (match) {
              if (timeStr.includes('min')) return parseInt(match[0]);
              if (timeStr.includes('h')) return parseInt(match[0]) * 60;
              if (timeStr.includes('d')) return parseInt(match[0]) * 1440;
            }
            return 9999;
          };
          return getMinutes(a.time) - getMinutes(b.time);
        })
        .slice(0, 6);
      
      // 7. Preparar preview de mesas (primeras 8 mesas)
      const mesasPreviewData = mesas.slice(0, 8).map(m => ({
        id: m.id,
        num: m.sNombre || `Mesa ${m.id}`,
        cap: m.iCapacidad || 4,
        status: m.sEstado || 'disponible',
        ubicacion: m.sUbicacion
      }));
      
      setStats({
        totalMesas,
        mesasOcupadas,
        mesasDisponibles,
        mesasReservadas,
        pedidosPendientes,
        pedidosPreparacion,
        pedidosActivos,
        ventasDia,
        ventasSemana,
        calificacion
      });
      
      setActividad(actividadReciente);
      setMesasPreview(mesasPreviewData);
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData().finally(() => {
      setTimeout(() => setRefreshing(false), 1000);
    });
  };

  const h = now.getHours();
  const greeting = h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
  
  // Calcular porcentaje de ocupación
  const ocupacionPorcentaje = stats.totalMesas > 0 
    ? Math.round((stats.mesasOcupadas / stats.totalMesas) * 100) 
    : 0;

  // Datos de estadísticas con valores reales
  const STATS = [
    { label: "Total Mesas",       value: stats.totalMesas,  sub: "En el establecimiento",    Icon: TableProperties,  color: C.pink },
    { label: "Mesas Ocupadas",    value: stats.mesasOcupadas,  sub: `${ocupacionPorcentaje}% de ocupación`, Icon: Users, color: C.orange },
    { label: "Mesas Disponibles", value: stats.mesasDisponibles,   sub: `${stats.mesasReservadas} reservadas`, Icon: CheckCircle, color: C.teal },
    { label: "Pedidos Activos",   value: stats.pedidosActivos,  sub: `${stats.pedidosPendientes} pendientes · ${stats.pedidosPreparacion} en cocina`, Icon: ShoppingBag, color: C.yellow },
    { label: "Ventas del Día",    value: `$${stats.ventasDia.toLocaleString()}`, sub: "Hoy", Icon: DollarSign, color: C.purple },
    { label: "Calificación",      value: stats.calificacion.toFixed(1), sub: "Promedio del mes", Icon: Star, color: C.yellow },
  ];

  // Si no es admin y está cargando, mostrar loading
  if (!isAdmin && user) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.textMuted }}>Redirigiendo...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.textPrimary }}>
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px" }}>

        {/* ── HEADER ROW ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <LayoutDashboard size={18} color={C.pink} />
              <span style={{ color: C.textMuted, fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase" }}>Panel de Control</span>
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(22px,4vw,30px)", fontWeight: "800", color: C.textPrimary, lineHeight: 1.1 }}>
              {greeting}, <span style={{ color: C.pink }}>{user?.nombre || "Admin"}</span>
            </h1>
            <p style={{ margin: "4px 0 0", color: C.textMuted, fontSize: "13px" }}>
              {now.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })} ·{" "}
              {now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              background: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: "10px", padding: "8px 16px",
              color: C.textSecondary, fontFamily: FONT, fontWeight: "600",
              fontSize: "13px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
              transition: "all 0.2s",
              opacity: refreshing ? 0.6 : 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.color = C.pink; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.8s linear" : "none" }} />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {/* ── STATS GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {STATS.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* ── ACCIONES RÁPIDAS ── */}
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: C.pink, boxShadow: glow(C.pink) }} />
            <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: C.textPrimary }}>Acciones Rápidas</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px" }}>
            <QuickAction label="Mesas"    Icon={TableProperties}  color={C.pink}   onClick={() => navigate('/tables')}    />
            <QuickAction label="Menú"     Icon={UtensilsCrossed}  color={C.orange} onClick={() => navigate('/menu')}      />
            <QuickAction label="Usuarios" Icon={Users}            color={C.teal}   onClick={() => navigate('/users')}     />
            <QuickAction label="Reportes" Icon={BarChart3}        color={C.yellow} onClick={() => navigate('/reports')}   />
            <QuickAction label="Pedidos"  Icon={ShoppingBag}      color={C.purple} onClick={() => navigate('/orders')}    />
          </div>
        </div>

        {/* ── DOS COLUMNAS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          {/* Actividad reciente */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: C.teal, boxShadow: glow(C.teal) }} />
                <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: C.textPrimary }}>Actividad Reciente</h2>
              </div>
              <Activity size={15} color={C.textMuted} />
            </div>
            <div>
              {loading ? (
                <div style={{ textAlign: "center", padding: "20px", color: C.textMuted }}>Cargando actividad...</div>
              ) : actividad.length > 0 ? (
                actividad.map((a, i) => <ActivityItem key={i} {...a} />)
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: C.textMuted }}>No hay actividad reciente</div>
              )}
            </div>
          </div>

          {/* Estado de mesas */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: C.orange, boxShadow: glow(C.orange) }} />
                <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: C.textPrimary }}>Estado de Mesas</h2>
              </div>
              <button
                onClick={() => navigate('/tables')}
                style={{ background: "none", border: "none", color: C.pink, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700", fontFamily: FONT, padding: 0 }}
              >
                Ver todas <ArrowRight size={12} />
              </button>
            </div>

            {/* Leyenda */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
              {[
                { color: C.teal,    label: "Disponible" },
                { color: C.orange,  label: "Ocupada"    },
                { color: C.yellow,  label: "Reservada"  },
                { color: C.textMuted, label: "Inactiva" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
                  <span style={{ color: C.textMuted, fontSize: "11px" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Grid de mesas */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {loading ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "20px", color: C.textMuted }}>Cargando mesas...</div>
              ) : mesasPreview.length > 0 ? (
                mesasPreview.map(({ id, num, cap, status }) => {
                  const colors = { disponible: C.teal, ocupada: C.orange, reservada: C.yellow, inactiva: C.textMuted };
                  const col = colors[status] || C.textMuted;
                  return (
                    <div
                      key={id}
                      onClick={() => navigate('/tables')}
                      style={{
                        background: `${col}12`,
                        border: `1.5px solid ${col}44`,
                        borderRadius: "10px",
                        padding: "10px 8px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = col; e.currentTarget.style.background = `${col}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = `${col}44`; e.currentTarget.style.background = `${col}12`; }}
                    >
                      <div style={{ color: col, fontWeight: "800", fontSize: "16px" }}>{num}</div>
                      <div style={{ color: C.textMuted, fontSize: "9px", marginTop: "2px" }}>{cap} pers.</div>
                    </div>
                  );
                })
              ) : (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "20px", color: C.textMuted }}>No hay mesas disponibles</div>
              )}
            </div>

            {/* Resumen ocupación */}
            <div style={{ marginTop: "16px", background: C.bg, borderRadius: "10px", padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ color: C.textSecondary, fontSize: "12px", fontWeight: "600" }}>Ocupación actual</span>
                <span style={{ color: C.orange, fontWeight: "800", fontSize: "13px" }}>{ocupacionPorcentaje}%</span>
              </div>
              <div style={{ height: "6px", background: C.border, borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${ocupacionPorcentaje}%`, height: "100%", background: C.orange, borderRadius: "4px", boxShadow: glow(C.orange, "66") }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <span style={{ color: C.textMuted, fontSize: "10px" }}>Disponibles: {stats.mesasDisponibles}</span>
                <span style={{ color: C.textMuted, fontSize: "10px" }}>Ocupadas: {stats.mesasOcupadas}</span>
                <span style={{ color: C.textMuted, fontSize: "10px" }}>Reservadas: {stats.mesasReservadas}</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Dashboard;


