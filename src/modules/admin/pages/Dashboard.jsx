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
import Breadcrumb from '../../../components/layout/Breadcrumb';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

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
        borderRadius: "16px", padding: "22px",
        transition: "all 0.22s ease",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? `0 12px 28px rgba(0,0,0,0.3), ${glow(color, "18")}` : "0 2px 8px rgba(0,0,0,0.2)",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${color}18`, border: `1.5px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={20} color={color} />
        </div>
        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: "3px", background: isUp ? `${C.teal}18` : `${C.pink}18`, border: `1px solid ${isUp ? C.teal : C.pink}44`, borderRadius: "20px", padding: "3px 8px", color: isUp ? C.teal : C.pink, fontSize: "11px", fontWeight: "700" }}>
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trendValue}
          </div>
        )}
      </div>
      <div style={{ color: C.textPrimary, fontSize: "30px", fontWeight: "800", lineHeight: 1, marginBottom: "6px" }}>{value}</div>
      <div style={{ color: C.textSecondary, fontSize: "13px", fontWeight: "600" }}>{label}</div>
      {sub && <div style={{ color: C.textMuted, fontSize: "11px", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

/* ─── ACTIVITY ITEM ──────────────────────────────────────────── */
function ActivityItem({ icon: Icon, color, title, sub, time }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0, background: `${color}18`, border: `1px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

/* ─── QUICK ACTION ───────────────────────────────────────────── */
function QuickAction({ label, Icon, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? `${color}22` : `${color}10`, border: `1.5px solid ${hov ? color : color + "44"}`, borderRadius: "12px", padding: "14px 16px", cursor: "pointer", fontFamily: FONT, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", transition: "all 0.2s", boxShadow: hov ? glow(color, "22") : "none" }}>
      <Icon size={22} color={color} />
      <span style={{ color: hov ? color : C.textSecondary, fontSize: "12px", fontWeight: "700" }}>{label}</span>
    </button>
  );
}

/* ─── CUSTOM TOOLTIP ─────────────────────────────────────────── */
function CustomTooltip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '10px 14px', fontFamily: FONT, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      <div style={{ color: C.textMuted, fontSize: '11px', fontWeight: '700', marginBottom: '6px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: '13px', fontWeight: '800' }}>
          {prefix}{typeof p.value === 'number' ? p.value.toLocaleString('es-MX') : p.value}{suffix}
        </div>
      ))}
    </div>
  );
}

/* ─── CHART WRAPPER ──────────────────────────────────────────── */
function ChartCard({ title, accent, children, action }) {
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '18px', borderRadius: '2px', background: accent, boxShadow: glow(accent) }} />
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: C.textPrimary }}>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalMesas: 0, mesasOcupadas: 0, mesasDisponibles: 0, mesasReservadas: 0,
    pedidosPendientes: 0, pedidosPreparacion: 0, pedidosActivos: 0,
    ventasDia: 0, ventasSemana: 0,
  });
  const [actividad,     setActividad]     = useState([]);
  const [mesasPreview,  setMesasPreview]  = useState([]);
  const [loading,       setLoading]       = useState(true);

  const [ventasHora,    setVentasHora]    = useState([]);
  const [pedidosEstado, setPedidosEstado] = useState([]);
  const [mesasDonut,    setMesasDonut]    = useState([]);

  useEffect(() => {
    if (!isAdmin && user) {
      const rolRedirects = { mesero: '/tables', caja: '/orders', mesa: '/menu' };
      navigate(rolRedirects[user?.rol] || '/');
    }
  }, [isAdmin, user, navigate]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (user.rol !== 'admin') navigate('/403', { replace: true });
  }, [user.rol, navigate]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Reciente';
    const diff = Date.now() - new Date(dateString);
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (mins < 1)  return 'Ahora';
    if (mins < 60) return `Hace ${mins} min`;
    if (hrs < 24)  return `Hace ${hrs} h`;
    return `Hace ${days} d`;
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const mesasData  = await tablesService.getAll();
      const mesas      = Array.isArray(mesasData) ? mesasData : (mesasData.data || []);
      const mesasMap   = Object.fromEntries(mesas.map(m => [m.id, m]));

      const totalMesas       = mesas.length;
      const mesasOcupadas    = mesas.filter(m => m.sEstado === 'ocupada').length;
      const mesasDisponibles = mesas.filter(m => m.sEstado === 'disponible').length;
      const mesasReservadas  = mesas.filter(m => m.sEstado === 'reservada').length;
      const mesasInactivas   = mesas.filter(m => m.sEstado === 'inactiva').length;

      const pedidosData = await ordersService.getAll();
      const pedidos     = Array.isArray(pedidosData) ? pedidosData : (pedidosData.data || []);

      const pedidosPendientes  = pedidos.filter(p => p.sEstado === 'pendiente').length;
      const pedidosPreparacion = pedidos.filter(p => p.sEstado === 'en_preparacion').length;
      const pedidosActivos     = pedidosPendientes + pedidosPreparacion;

      const hoy = new Date().toISOString().split('T')[0];

      // ✅ FIX: usar sEstado === 'pagado' y dFechaPago (no 'entregado' ni createdAt)
      const pedidosHoy = pedidos.filter(p => {
        if (!p.dFechaPago) return false;
        return new Date(p.dFechaPago).toISOString().split('T')[0] === hoy && p.sEstado === 'pagado';
      });
      const ventasDia = pedidosHoy.reduce((t, p) => t + (parseFloat(p.dTotal) || 0), 0);

      const semanaAtras = new Date();
      semanaAtras.setDate(semanaAtras.getDate() - 7);
      const ventasSemana = pedidos
        .filter(p => p.dFechaPago && new Date(p.dFechaPago) >= semanaAtras && p.sEstado === 'pagado')
        .reduce((t, p) => t + (parseFloat(p.dTotal) || 0), 0);

      // ── 1. LINE CHART: ventas agrupadas por hora (hoy) ──
      const ventasPorHora = {};
      pedidosHoy.forEach(p => {
        const h = new Date(p.dFechaPago).getHours();
        const key = `${h.toString().padStart(2,'0')}:00`;
        ventasPorHora[key] = (ventasPorHora[key] || 0) + (parseFloat(p.dTotal) || 0);
      });
      const horasDelDia = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2,'0')}:00`);
      const lineData = horasDelDia
        .filter(h => parseInt(h) <= new Date().getHours())
        .map(h => ({ hora: h, ventas: +(ventasPorHora[h] || 0).toFixed(2) }));
      setVentasHora(lineData.length > 1 ? lineData : [
        { hora: '08:00', ventas: 0 }, { hora: '09:00', ventas: 0 },
      ]);

      // ── 2. BAR CHART: pedidos por estado ──
      const estadoLabels = {
        pendiente:      { label: 'Pendiente', color: C.yellow  },
        en_preparacion: { label: 'En cocina', color: C.orange  },
        listo:          { label: 'Listo',     color: C.teal    },
        entregado:      { label: 'Entregado', color: C.purple  },
        cancelado:      { label: 'Cancelado', color: C.pink    },
      };
      const countByEstado = {};
      pedidos.forEach(p => { countByEstado[p.sEstado] = (countByEstado[p.sEstado] || 0) + 1; });
      const barData = Object.entries(estadoLabels).map(([key, { label, color }]) => ({
        estado: label, cantidad: countByEstado[key] || 0, color,
      }));
      setPedidosEstado(barData);

      // ── 3. DONUT: distribución de mesas ──
      const donutData = [
        { name: 'Disponibles', value: mesasDisponibles, color: C.teal     },
        { name: 'Ocupadas',    value: mesasOcupadas,    color: C.orange   },
        { name: 'Reservadas',  value: mesasReservadas,  color: C.yellow   },
        { name: 'Inactivas',   value: mesasInactivas,   color: C.textMuted },
      ].filter(d => d.value > 0);
      setMesasDonut(donutData);

      // ── Actividad reciente ──
      const eventos = [];
      const estadoMap = {
        pendiente:      { icon: Clock,           color: C.yellow,   label: 'creado'          },
        en_preparacion: { icon: UtensilsCrossed, color: C.orange,   label: 'en preparación'  },
        listo:          { icon: CheckCircle,     color: C.teal,     label: 'listo'            },
        entregado:      { icon: ShoppingBag,     color: C.purple,   label: 'entregado'        },
        cancelado:      { icon: XCircle,         color: '#C0392B',  label: 'cancelado'        },
        pagado:         { icon: DollarSign,      color: C.teal,     label: 'pagado'           },
      };
      [...pedidos].sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,8).forEach(p => {
        const info = estadoMap[p.sEstado] || estadoMap.pendiente;
        const mesa = mesasMap[p.iMesaId];
        eventos.push({ icon: info.icon, color: info.color, title: `Pedido #${p.id} ${info.label}`, sub: `${mesa?.sNombre || `Mesa ${p.iMesaId}`} · $${parseFloat(p.dTotal||0).toFixed(2)}`, time: formatTimeAgo(p.updatedAt||p.createdAt) });
      });
      const mesaEstadoMap = {
        disponible: { icon: CheckCircle, color: C.teal,      label: 'disponible' },
        ocupada:    { icon: Users,       color: C.orange,    label: 'ocupada'    },
        reservada:  { icon: Clock,       color: C.yellow,    label: 'reservada'  },
        inactiva:   { icon: XCircle,     color: C.textMuted, label: 'inactiva'   },
      };
      [...mesas].sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,4).forEach(m => {
        const info = mesaEstadoMap[m.sEstado] || mesaEstadoMap.disponible;
        eventos.push({ icon: info.icon, color: info.color, title: `${m.sNombre||`Mesa ${m.id}`} ${info.label}`, sub: `Capacidad: ${m.iCapacidad} personas · ${m.sUbicacion||'interior'}`, time: formatTimeAgo(m.updatedAt) });
      });
      const getMinutes = s => {
        if (s.includes('Ahora')) return 0;
        const n = parseInt(s.match(/\d+/)?.[0] || 9999);
        if (s.includes('min')) return n;
        if (s.includes('h'))   return n * 60;
        return n * 1440;
      };
      setActividad(eventos.sort((a,b) => getMinutes(a.time)-getMinutes(b.time)).slice(0,6));
      setMesasPreview(mesas.slice(0,8).map(m => ({ id: m.id, num: m.sNombre||`Mesa ${m.id}`, cap: m.iCapacidad||4, status: m.sEstado||'disponible' })));
      setStats({ totalMesas, mesasOcupadas, mesasDisponibles, mesasReservadas, pedidosPendientes, pedidosPreparacion, pedidosActivos, ventasDia, ventasSemana});
    } catch (err) {
      console.error('Error cargando dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData().finally(() => setTimeout(() => setRefreshing(false), 1000));
  };

  const h = now.getHours();
  const greeting = h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
  const ocupacionPorcentaje = stats.totalMesas > 0 ? Math.round((stats.mesasOcupadas / stats.totalMesas) * 100) : 0;

  const STATS = [
    { label: "Total Mesas",       value: stats.totalMesas,                             sub: "En el establecimiento",                                                          Icon: TableProperties, color: C.pink   },
    { label: "Mesas Ocupadas",    value: stats.mesasOcupadas,                          sub: `${ocupacionPorcentaje}% de ocupación`,                                           Icon: Users,           color: C.orange },
    { label: "Mesas Disponibles", value: stats.mesasDisponibles,                       sub: `${stats.mesasReservadas} reservadas`,                                             Icon: CheckCircle,     color: C.teal   },
    { label: "Pedidos Activos",   value: stats.pedidosActivos,                         sub: `${stats.pedidosPendientes} pendientes · ${stats.pedidosPreparacion} en cocina`,   Icon: ShoppingBag,     color: C.yellow },
    { label: "Ventas del Día",    value: `$${stats.ventasDia.toLocaleString('es-MX')}`, sub: "Hoy",                                                                           Icon: DollarSign,      color: C.purple },
  ];

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
        <Breadcrumb />

        {/* ── HEADER ── */}
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
              {now.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })} · {now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button onClick={handleRefresh} disabled={refreshing}
            style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "8px 16px", color: C.textSecondary, fontFamily: FONT, fontWeight: "600", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s", opacity: refreshing ? 0.6 : 1 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.color = C.pink; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}>
            <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }} />
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
            <QuickAction label="Mesas"    Icon={TableProperties} color={C.pink}   onClick={() => navigate('/tables')}  />
            <QuickAction label="Menú"     Icon={UtensilsCrossed} color={C.orange} onClick={() => navigate('/menu')}    />
            <QuickAction label="Usuarios" Icon={Users}           color={C.teal}   onClick={() => navigate('/users')}   />
            <QuickAction label="Pedidos"  Icon={ShoppingBag}     color={C.purple} onClick={() => navigate('/orders')}  />
          </div>
        </div>

        {/* ── 1. LINE CHART ── */}
        <ChartCard title="Ventas por Hora (Hoy)" accent={C.teal} style={{ marginBottom: "24px" }}>
          {loading ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontSize: '13px' }}>Cargando datos...</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ventasHora} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={`${C.border}`} vertical={false} />
                <XAxis dataKey="hora" tick={{ fill: C.textMuted, fontSize: 11, fontFamily: FONT }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: C.textMuted, fontSize: 11, fontFamily: FONT }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={52} />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Line type="monotone" dataKey="ventas" stroke={C.teal} strokeWidth={2.5} dot={{ fill: C.teal, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: C.teal, stroke: C.bgCard, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* ── FILA: BAR + DONUT ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

          <ChartCard title="Pedidos por Estado" accent={C.orange}>
            {loading ? (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontSize: '13px' }}>Cargando datos...</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pedidosEstado} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="estado" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: FONT }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.textMuted, fontSize: 11, fontFamily: FONT }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                  <Tooltip content={<CustomTooltip suffix=" pedidos" />} />
                  <Bar dataKey="cantidad" radius={[6, 6, 0, 0]}>
                    {pedidosEstado.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Distribución de Mesas" accent={C.purple}>
            {loading ? (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontSize: '13px' }}>Cargando datos...</div>
            ) : mesasDonut.length === 0 ? (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontSize: '13px' }}>Sin datos de mesas</div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <ResponsiveContainer width="60%" height={220}>
                  <PieChart>
                    <Pie data={mesasDonut} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                      {mesasDonut.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip suffix=" mesas" />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {mesasDonut.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: entry.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: C.textSecondary, fontSize: '11px', fontWeight: '700' }}>{entry.name}</div>
                        <div style={{ color: entry.color, fontSize: '14px', fontWeight: '900' }}>{entry.value}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '4px', paddingTop: '10px', borderTop: `1px solid ${C.border}` }}>
                    <div style={{ color: C.textMuted, fontSize: '10px', fontWeight: '700' }}>TOTAL</div>
                    <div style={{ color: C.textPrimary, fontSize: '16px', fontWeight: '900' }}>{stats.totalMesas} mesas</div>
                  </div>
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* ── DOS COLUMNAS: Actividad + Estado mesas ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: C.teal, boxShadow: glow(C.teal) }} />
                <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: C.textPrimary }}>Actividad Reciente</h2>
              </div>
              <Activity size={15} color={C.textMuted} />
            </div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px", color: C.textMuted }}>Cargando actividad...</div>
            ) : actividad.length > 0 ? (
              actividad.map((a, i) => <ActivityItem key={i} {...a} />)
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: C.textMuted }}>No hay actividad reciente</div>
            )}
          </div>

          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: C.orange, boxShadow: glow(C.orange) }} />
                <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: C.textPrimary }}>Estado de Mesas</h2>
              </div>
              <button onClick={() => navigate('/tables')}
                style={{ background: "none", border: "none", color: C.pink, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700", fontFamily: FONT, padding: 0 }}>
                Ver todas <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
              {[{ color: C.teal, label: "Disponible" }, { color: C.orange, label: "Ocupada" }, { color: C.yellow, label: "Reservada" }, { color: C.textMuted, label: "Inactiva" }].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
                  <span style={{ color: C.textMuted, fontSize: "11px" }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {loading ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "20px", color: C.textMuted }}>Cargando mesas...</div>
              ) : mesasPreview.length > 0 ? (
                mesasPreview.map(({ id, num, cap, status }) => {
                  const colors = { disponible: C.teal, ocupada: C.orange, reservada: C.yellow, inactiva: C.textMuted };
                  const col = colors[status] || C.textMuted;
                  return (
                    <div key={id} onClick={() => navigate('/tables')}
                      style={{ background: `${col}12`, border: `1.5px solid ${col}44`, borderRadius: "10px", padding: "10px 8px", textAlign: "center", cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = col; e.currentTarget.style.background = `${col}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = `${col}44`; e.currentTarget.style.background = `${col}12`; }}>
                      <div style={{ color: col, fontWeight: "800", fontSize: "16px" }}>{num}</div>
                      <div style={{ color: C.textMuted, fontSize: "9px", marginTop: "2px" }}>{cap} pers.</div>
                    </div>
                  );
                })
              ) : (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "20px", color: C.textMuted }}>No hay mesas</div>
              )}
            </div>

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