import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Activity, AlertTriangle, ArrowUpRight, Bell, Box, Building2, CheckCircle2, CircleDot, CreditCard, MapPin, MapPinned, Package, Plus, RefreshCw, Search, ShieldCheck, Store, Truck, Users, Warehouse, X } from 'lucide-react'
import './styles.css'

type OrderStatus = 'CREATED' | 'PAYMENT_PENDING' | 'INVENTORY_RESERVED' | 'PREPARING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
type Order = { id: number; customerName: string; deliveryAddress: string; total: number; status: OrderStatus; createdAt: string }
type Dashboard = { totalOrders: number; inTransit: number; delivered: number; cancelled: number }

type TabType = 'dashboard' | 'orders' | 'customers' | 'inventory' | 'warehouses' | 'deliveries' | 'routes' | 'incidents' | 'payments' | 'channels'

const API = import.meta.env.VITE_API_URL ?? '/api'

const statusLabels: Record<OrderStatus, string> = {
  CREATED: 'Creado',
  PAYMENT_PENDING: 'Pago pendiente',
  INVENTORY_RESERVED: 'Inventario reservado',
  PREPARING: 'En preparación',
  ASSIGNED: 'Asignado',
  IN_TRANSIT: 'En ruta',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado'
}

const NAV_ITEMS: { id: TabType; label: string; icon: React.ReactNode; eyebrow: string; title: string; subtitle: string }[] = [
  { id: 'dashboard', label: 'Resumen', icon: <Box size={17} />, eyebrow: 'CENTRO DE OPERACIONES LOGÍSTICAS', title: 'Resumen General', subtitle: 'Gestión de pedidos y entregas de última milla.' },
  { id: 'orders', label: 'Pedidos', icon: <Package size={17} />, eyebrow: 'GESTIÓN DE PEDIDOS', title: 'Consola de Pedidos', subtitle: 'Monitoreo, estado y registro de nuevas órdenes.' },
  { id: 'customers', label: 'Clientes', icon: <Users size={17} />, eyebrow: 'DIRECTORIO DE CLIENTES', title: 'Clientes Retail', subtitle: 'Cuentas activas, historial de compra y frecuencia.' },
  { id: 'inventory', label: 'Inventario', icon: <Warehouse size={17} />, eyebrow: 'CONTROL DE STOCK', title: 'Inventario Central', subtitle: 'Disponibilidad de productos en bodegas y centros de distribución.' },
  { id: 'warehouses', label: 'Almacenes', icon: <Building2 size={17} />, eyebrow: 'RED LOGÍSTICA', title: 'Centros de Distribución', subtitle: 'Capacidad de almacenamiento, muelles y estado operativo.' },
  { id: 'deliveries', label: 'Entregas', icon: <Truck size={17} />, eyebrow: 'FLOTA Y REPARTIDORES', title: 'Entregas en Curso', subtitle: 'Despacho de guías y transportadores asignados.' },
  { id: 'routes', label: 'Rutas y tracking', icon: <MapPinned size={17} />, eyebrow: 'GEOLOCALIZACIÓN Y SEGUIMIENTO', title: 'Rutas en Tiempo Real', subtitle: 'Monitoreo GPS de unidades de transporte y tiempos de entrega.' },
  { id: 'incidents', label: 'Incidencias', icon: <AlertTriangle size={17} />, eyebrow: 'GESTIÓN DE EXCEPCIONES', title: 'Centro de Incidencias', subtitle: 'Reportes de retrasos, fallas de entrega y devoluciones.' },
  { id: 'payments', label: 'Pagos', icon: <CreditCard size={17} />, eyebrow: 'GESTIÓN FINANCIERA', title: 'Control de Pagos', subtitle: 'Transacciones, recaudos de última milla y métodos de pago.' },
  { id: 'channels', label: 'Canales de venta', icon: <Store size={17} />, eyebrow: 'INTEGRACIONES E-COMMERCE', title: 'Canales Conectados', subtitle: 'Sincronización de tiendas Shopify, WooCommerce, VTEX y marketplaces.' },
]

const SAMPLE_ORDERS: Order[] = [
  { id: 101, customerName: 'Laura Gómez', deliveryAddress: 'Calle 45 # 22-10, Medellín', total: 120000, status: 'IN_TRANSIT', createdAt: new Date().toISOString() },
  { id: 102, customerName: 'Carlos Restrepo', deliveryAddress: 'Cra 70 # 12-45, Medellín', total: 350000, status: 'PREPARING', createdAt: new Date().toISOString() },
  { id: 103, customerName: 'Retail Moda S.A.S', deliveryAddress: 'Av. El Poblado # 5-80, Medellín', total: 1450000, status: 'DELIVERED', createdAt: new Date().toISOString() },
  { id: 104, customerName: 'TecnoTienda Express', deliveryAddress: 'Cll 10 # 43D-21, Medellín', total: 890000, status: 'ASSIGNED', createdAt: new Date().toISOString() },
  { id: 105, customerName: 'Camila Vargas', deliveryAddress: 'Transversal 39 # 7-14, Medellín', total: 210000, status: 'PAYMENT_PENDING', createdAt: new Date().toISOString() }
]

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [orders, setOrders] = useState<Order[]>([])
  const [dashboard, setDashboard] = useState<Dashboard>({ totalOrders: 0, inTransit: 0, delivered: 0, cancelled: 0 })
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadData() {
    try {
      const [ordersResponse, dashboardResponse] = await Promise.all([
        fetch(`${API}/orders`),
        fetch(`${API}/dashboard`)
      ])
      if (!ordersResponse.ok || !dashboardResponse.ok) throw new Error('API no disponible')
      const dataOrders: Order[] = await ordersResponse.json()
      const dataDash: Dashboard = await dashboardResponse.json()
      setOrders(dataOrders)
      setDashboard(dataDash)
      setError('')
    } catch {
      setOrders(SAMPLE_ORDERS)
      setDashboard({
        totalOrders: SAMPLE_ORDERS.length,
        inTransit: SAMPLE_ORDERS.filter(o => o.status === 'IN_TRANSIT').length,
        delivered: SAMPLE_ORDERS.filter(o => o.status === 'DELIVERED').length,
        cancelled: SAMPLE_ORDERS.filter(o => o.status === 'CANCELLED').length
      })
      setError('Modo demostración activo (Conecta el backend para ver base de datos en vivo).')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  async function updateStatus(id: number, status: OrderStatus) {
    try {
      await fetch(`${API}/orders/${id}/status?status=${status}`, { method: 'PATCH' })
    } catch {
      // Local fallback update
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    }
    loadData()
  }

  const currentTabMeta = NAV_ITEMS.find(item => item.id === activeTab)!

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><Activity size={19} /></span>
          <span>LAstrack<span>.ITM</span></span>
        </div>
        <div className="workspace-label">PLATAFORMA LOGÍSTICA</div>

        <nav>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={activeTab === item.id ? 'active' : ''}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === 'dashboard' && <span className="nav-count">{dashboard.totalOrders}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="status-dot">
            <span /> Sistemas operativos
          </div>
          <div className="user">
            <div className="avatar">JD</div>
            <div>
              <strong>Julián Díaz</strong>
              <small>Administrador</small>
            </div>
            <ArrowUpRight size={15} />
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main">
        <header>
          <div>
            <p className="eyebrow">{currentTabMeta.eyebrow}</p>
            <h1>{currentTabMeta.title}</h1>
            <p className="subhead">{currentTabMeta.subtitle}</p>
          </div>
          <div className="header-actions">
            <button className="icon-button" title="Notificaciones"><Bell size={18} /><i /></button>
            <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={17} /> Nuevo pedido</button>
          </div>
        </header>

        {error && <div className="connection-alert"><CircleDot size={17} />{error}</div>}

        {/* View Switcher */}
        {activeTab === 'dashboard' && (
          <DashboardView
            dashboard={dashboard}
            orders={orders}
            search={search}
            setSearch={setSearch}
            loading={loading}
            updateStatus={updateStatus}
            setShowForm={setShowForm}
          />
        )}
        {activeTab === 'orders' && (
          <OrdersView
            orders={orders}
            search={search}
            setSearch={setSearch}
            loading={loading}
            updateStatus={updateStatus}
            setShowForm={setShowForm}
          />
        )}
        {activeTab === 'customers' && <CustomersView />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'warehouses' && <WarehousesView />}
        {activeTab === 'deliveries' && <DeliveriesView />}
        {activeTab === 'routes' && <RoutesView />}
        {activeTab === 'incidents' && <IncidentsView />}
        {activeTab === 'payments' && <PaymentsView />}
        {activeTab === 'channels' && <ChannelsView />}
      </main>

      {showForm && (
        <NewOrder
          onClose={() => setShowForm(false)}
          onCreated={() => { setShowForm(false); loadData() }}
        />
      )}
    </div>
  )
}

/* 1. RESUMEN / DASHBOARD */
function DashboardView({ dashboard, orders, search, setSearch, loading, updateStatus, setShowForm }: {
  dashboard: Dashboard; orders: Order[]; search: string; setSearch: (s: string) => void;
  loading: boolean; updateStatus: (id: number, s: OrderStatus) => void; setShowForm: (b: boolean) => void
}) {
  const filteredOrders = orders.filter(o => `${o.id} ${o.customerName} ${o.deliveryAddress}`.toLowerCase().includes(search.toLowerCase()))
  return (
    <>
      <section className="metrics">
        <Metric icon={<Package />} label="Pedidos totales" value={dashboard.totalOrders} detail="+12% vs. ayer" positive />
        <Metric icon={<Truck />} label="En ruta" value={dashboard.inTransit} detail="Seguimiento activo" />
        <Metric icon={<CheckCircle2 />} label="Entregados" value={dashboard.delivered} detail="Últimas 24 horas" positive />
        <Metric icon={<CircleDot />} label="Incidencias" value={dashboard.cancelled} detail="Requieren atención" warning />
      </section>

      <section className="content-grid">
        <div className="orders-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">OPERACIÓN RECIENTE</p>
              <h2>Pedidos en sistema</h2>
            </div>
            <div className="tools">
              <label className="search">
                <Search size={16} />
                <input placeholder="Buscar pedido o cliente" value={search} onChange={e => setSearch(e.target.value)} />
              </label>
              <button className="text-button" onClick={() => setShowForm(true)}>Nuevo <ArrowUpRight size={15} /></button>
            </div>
          </div>

          {loading ? (
            <div className="empty">Cargando operación...</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>PEDIDO</th>
                    <th>CLIENTE</th>
                    <th>ESTADO</th>
                    <th>TOTAL</th>
                    <th>UBICACIÓN</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong className="order-id">#{String(order.id).padStart(5, '0')}</strong>
                        <small>{new Date(order.createdAt).toLocaleDateString('es-CO')}</small>
                      </td>
                      <td>
                        <strong>{order.customerName}</strong>
                        <small>Cliente retail</small>
                      </td>
                      <td>
                        <span className={`status status-${order.status.toLowerCase()}`}>
                          <span />{statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="money">${order.total.toLocaleString('es-CO')}</td>
                      <td>
                        <span className="location">
                          <MapPin size={14} />{order.deliveryAddress}
                        </span>
                      </td>
                      <td>
                        <select
                          aria-label={`Cambiar estado del pedido ${order.id}`}
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                        >
                          {(Object.keys(statusLabels) as OrderStatus[]).map(status => (
                            <option key={status} value={status}>{statusLabels[status]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredOrders.length && <div className="empty">No hay pedidos registrados.</div>}
            </div>
          )}
        </div>

        <aside className="route-panel">
          <div className="route-header">
            <div>
              <p className="eyebrow">EN TIEMPO REAL</p>
              <h2>Red de entregas</h2>
            </div>
            <span className="live"><i /> LIVE</span>
          </div>
          <div className="map">
            <div className="map-grid" />
            <div className="map-road road-a" />
            <div className="map-road road-b" />
            <div className="map-road road-c" />
            <div className="map-pin pin-one"><Truck size={14} /></div>
            <div className="map-pin pin-two"><Truck size={14} /></div>
            <div className="map-pin pin-three"><Truck size={14} /></div>
            <div className="map-label label-one">R-08</div>
            <div className="map-label label-two">R-12</div>
          </div>
          <div className="route-stat">
            <div>
              <strong>{dashboard.inTransit}</strong>
              <span>vehículos activos</span>
            </div>
            <div>
              <strong>94<span>%</span></strong>
              <span>entregas a tiempo</span>
            </div>
          </div>
          <button className="outline-button">Abrir mapa interactivo <ArrowUpRight size={15} /></button>
        </aside>
      </section>
    </>
  )
}

/* 2. PEDIDOS / ORDERS VIEW */
function OrdersView({ orders, search, setSearch, loading, updateStatus, setShowForm }: {
  orders: Order[]; search: string; setSearch: (s: string) => void;
  loading: boolean; updateStatus: (id: number, s: OrderStatus) => void; setShowForm: (b: boolean) => void
}) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = `${order.id} ${order.customerName} ${order.deliveryAddress}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="full-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">CONSOLA OPERATIVA</p>
          <h2>Todos los pedidos ({filteredOrders.length})</h2>
        </div>
        <div className="tools">
          <label className="search">
            <Search size={16} />
            <input placeholder="Filtrar por pedido, cliente..." value={search} onChange={e => setSearch(e.target.value)} />
          </label>
          <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={16} /> Crear Pedido</button>
        </div>
      </div>

      <div className="tab-filter-bar">
        <button className={`filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`} onClick={() => setFilterStatus('ALL')}>
          Todos ({orders.length})
        </button>
        <button className={`filter-btn ${filterStatus === 'IN_TRANSIT' ? 'active' : ''}`} onClick={() => setFilterStatus('IN_TRANSIT')}>
          En ruta
        </button>
        <button className={`filter-btn ${filterStatus === 'PREPARING' ? 'active' : ''}`} onClick={() => setFilterStatus('PREPARING')}>
          En preparación
        </button>
        <button className={`filter-btn ${filterStatus === 'DELIVERED' ? 'active' : ''}`} onClick={() => setFilterStatus('DELIVERED')}>
          Entregados
        </button>
        <button className={`filter-btn ${filterStatus === 'PAYMENT_PENDING' ? 'active' : ''}`} onClick={() => setFilterStatus('PAYMENT_PENDING')}>
          Pago pendiente
        </button>
      </div>

      {loading ? (
        <div className="empty">Cargando pedidos...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>FECHA</th>
                <th>CLIENTE</th>
                <th>DIRECCIÓN DE ENTREGA</th>
                <th>ESTADO ACTUAL</th>
                <th>VALOR TOTAL</th>
                <th>CAMBIAR ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td><strong className="order-id">#{String(order.id).padStart(5, '0')}</strong></td>
                  <td><small>{new Date(order.createdAt).toLocaleDateString('es-CO')}</small></td>
                  <td><strong>{order.customerName}</strong></td>
                  <td>
                    <span className="location">
                      <MapPin size={14} />{order.deliveryAddress}
                    </span>
                  </td>
                  <td>
                    <span className={`status status-${order.status.toLowerCase()}`}>
                      <span />{statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="money">${order.total.toLocaleString('es-CO')}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                    >
                      {(Object.keys(statusLabels) as OrderStatus[]).map(status => (
                        <option key={status} value={status}>{statusLabels[status]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredOrders.length && <div className="empty">No se encontraron pedidos con este filtro.</div>}
        </div>
      )}
    </div>
  )
}

/* 3. CLIENTES / CUSTOMERS VIEW */
function CustomersView() {
  const [customers] = useState([
    { id: 'CLI-001', name: 'Laura Gómez', city: 'Medellín', orders: 12, spent: 1450000, level: 'VIP', status: 'Activo' },
    { id: 'CLI-002', name: 'Carlos Restrepo', city: 'Medellín', orders: 5, spent: 680000, level: 'Standard', status: 'Activo' },
    { id: 'CLI-003', name: 'Retail Moda S.A.S', city: 'Bogotá', orders: 34, spent: 18900000, level: 'VIP', status: 'Activo' },
    { id: 'CLI-004', name: 'TecnoTienda Express', city: 'Cali', orders: 21, spent: 9400000, level: 'Premium', status: 'Activo' },
    { id: 'CLI-005', name: 'DistriSuper Colombia', city: 'Barranquilla', orders: 18, spent: 12300000, level: 'Premium', status: 'Activo' }
  ])

  return (
    <>
      <section className="metrics">
        <Metric icon={<Users />} label="Clientes totales" value={148} detail="+8 nuevos este mes" positive />
        <Metric icon={<CheckCircle2 />} label="Clientes VIP" value={32} detail="Alto volumen de compra" positive />
        <Metric icon={<CreditCard />} label="Ticket promedio" value={385000} detail="COP / pedido" />
        <Metric icon={<Activity />} label="Tasa de retención" value={94} detail="% fidelización anual" positive />
      </section>

      <div className="full-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">BASE DE DATOS DE CLIENTES</p>
            <h2>Clientes y Cuentas Retail</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>NOMBRE / RAZÓN SOCIAL</th>
                <th>CIUDAD</th>
                <th>PEDIDOS TOTALES</th>
                <th>INVERSIÓN ACUMULADA</th>
                <th>CATEGORÍA</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td><strong className="order-id">{c.id}</strong></td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.city}</td>
                  <td><strong>{c.orders} pedidos</strong></td>
                  <td className="money">${c.spent.toLocaleString('es-CO')} COP</td>
                  <td>
                    <span className={`tag tag-${c.level.toLowerCase()}`}>{c.level}</span>
                  </td>
                  <td>
                    <span className="status status-active"><span />{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* 4. INVENTARIO / INVENTORY VIEW */
function InventoryView() {
  const [items] = useState([
    { sku: 'SKU-8821', name: 'Laptop Stand Aluminium Pro', category: 'Accesorios', warehouse: 'Bodega Medellín Norte', stock: 145, min: 20, status: 'En Stock' },
    { sku: 'SKU-9043', name: 'Teclado Mecánico Wireless', category: 'Electrónica', warehouse: 'Hub Bogotá Fontibón', stock: 14, min: 25, status: 'Stock Bajo' },
    { sku: 'SKU-1102', name: 'Monitor Ultrawide 34" Curved', category: 'Monitores', warehouse: 'Bodega Medellín', stock: 42, min: 10, status: 'En Stock' },
    { sku: 'SKU-3329', name: 'Cable USB-C 100W Braided 2m', category: 'Cables', warehouse: 'Hub Cali Yumbo', stock: 0, min: 50, status: 'Agotado' },
    { sku: 'SKU-5541', name: 'Silla Ergonómica Ejecutiva', category: 'Mobiliario', warehouse: 'Bodega Medellín', stock: 88, min: 15, status: 'En Stock' }
  ])

  return (
    <>
      <section className="metrics">
        <Metric icon={<Warehouse />} label="SKUs Registrados" value={1240} detail="Catálogo activo" />
        <Metric icon={<Box />} label="Stock disponible" value={48500} detail="Unidades totales" positive />
        <Metric icon={<CircleDot />} label="Alertas stock bajo" value={12} detail="Requieren reposición" warning />
        <Metric icon={<CreditCard />} label="Valor inventario" value={420000000} detail="COP total valorizado" />
      </section>

      <div className="full-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">CATÁLOGO DE PRODUCTOS</p>
            <h2>Existencias en Almacén</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>PRODUCTO</th>
                <th>CATEGORÍA</th>
                <th>BODEGA ASIGNADA</th>
                <th>STOCK DISPONIBLE</th>
                <th>MIN. REQUERIDO</th>
                <th>ESTADO STOCK</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.sku}>
                  <td><strong className="order-id">{item.sku}</strong></td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.category}</td>
                  <td>{item.warehouse}</td>
                  <td><strong>{item.stock} unids</strong></td>
                  <td><small>{item.min} unids</small></td>
                  <td>
                    <span className={`status ${item.stock === 0 ? 'status-cancelled' : item.stock < item.min ? 'status-preparing' : 'status-delivered'}`}>
                      <span />{item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* 5. ALMACENES / WAREHOUSES VIEW */
function WarehousesView() {
  const warehouses = [
    { name: 'Almacén Principal Medellín Norte', city: 'Medellín', area: '1,850 m²', docks: 14, capacity: 85, manager: 'Mateo Ríos', status: 'Operativo' },
    { name: 'Hub Logístico Bogotá Fontibón', city: 'Bogotá', area: '3,200 m²', docks: 22, capacity: 92, manager: 'Ana María Torres', status: 'Alerta Ocupación' },
    { name: 'Centro Distribución Cali Yumbo', city: 'Cali', area: '1,400 m²', docks: 10, capacity: 64, manager: 'Felipe Morales', status: 'Operativo' },
    { name: 'Bodega Bucaramanga Centro', city: 'Bucaramanga', area: '850 m²', docks: 5, capacity: 38, manager: 'Diana Herrera', status: 'Operativo' }
  ]

  return (
    <>
      <section className="metrics">
        <Metric icon={<Building2 />} label="Centros activos" value={4} detail="Cobertura nacional" positive />
        <Metric icon={<Warehouse />} label="Área total" value={7300} detail="Metros cuadrados" />
        <Metric icon={<Truck />} label="Muelles de carga" value={51} detail="Operativos 24/7" positive />
        <Metric icon={<Activity />} label="Capacidad promedio" value={70} detail="% nivel de ocupación" />
      </section>

      <div className="cards-grid">
        {warehouses.map((w, idx) => (
          <div key={idx} className="card-item">
            <div className="card-header">
              <div>
                <div className="card-title">{w.name}</div>
                <div className="card-sub">{w.city} • {w.area}</div>
              </div>
              <span className={`status ${w.capacity > 90 ? 'status-cancelled' : 'status-active'}`}>
                <span />{w.status}
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span>Ocupación de bodega</span>
                <strong>{w.capacity}%</strong>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${w.capacity > 90 ? 'high' : ''}`} style={{ width: `${w.capacity}%` }} />
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#64716b', display: 'grid', gap: '4px', marginTop: '6px' }}>
              <div>• Muelles de carga: <strong>{w.docks} muelles</strong></div>
              <div>• Responsable: <strong>{w.manager}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* 6. ENTREGAS / DELIVERIES VIEW */
function DeliveriesView() {
  const deliveries = [
    { id: 'GUI-99201', driver: 'Juan Pérez (Moto #08)', destination: 'El Poblado, Medellín', orderId: '#00101', eta: '15 min', status: 'IN_TRANSIT' },
    { id: 'GUI-99202', driver: 'Mario Gómez (Van #03)', destination: 'Laureles, Medellín', orderId: '#00104', eta: '28 min', status: 'IN_TRANSIT' },
    { id: 'GUI-99203', driver: 'Esteban Ruíz (Van #11)', destination: 'Envigado, Antioquia', orderId: '#00103', eta: 'Completado', status: 'DELIVERED' },
    { id: 'GUI-99204', driver: 'David Castro (Moto #12)', destination: 'Belén, Medellín', orderId: '#00102', eta: '40 min', status: 'ASSIGNED' }
  ]

  return (
    <>
      <section className="metrics">
        <Metric icon={<Truck />} label="Vehículos activos" value={24} detail="En vía pública" positive />
        <Metric icon={<ShieldCheck />} label="Efectividad entrega" value={98} detail="% a tiempo" positive />
        <Metric icon={<Activity />} label="Tiempo prom. entrega" value={34} detail="Minutos por pedido" />
        <Metric icon={<CheckCircle2 />} label="Guías despachadas hoy" value={142} detail="Operación continua" positive />
      </section>

      <div className="full-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">DESPACHO Y FLOTA</p>
            <h2>Guías de Transporte y Repartidores</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>GUÍA #</th>
                <th>PEDIDO ASOCIADO</th>
                <th>TRANSPORTADOR / UNIDAD</th>
                <th>DESTINO FINAL</th>
                <th>TIEMPO ESTIMADO (ETA)</th>
                <th>ESTADO ENTREGA</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(d => (
                <tr key={d.id}>
                  <td><strong className="order-id">{d.id}</strong></td>
                  <td><strong>{d.orderId}</strong></td>
                  <td>{d.driver}</td>
                  <td>
                    <span className="location">
                      <MapPin size={14} />{d.destination}
                    </span>
                  </td>
                  <td><strong>{d.eta}</strong></td>
                  <td>
                    <span className={`status status-${d.status.toLowerCase()}`}>
                      <span />{statusLabels[d.status as OrderStatus] ?? d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* 7. RUTAS Y TRACKING / ROUTES VIEW */
function RoutesView() {
  const routes = [
    { code: 'Ruta R-01', zone: 'Medellín Centro & Laureles', stops: 18, completed: 13, driver: 'Juan Pérez (Moto #08)', progress: 72 },
    { code: 'Ruta R-04', zone: 'Bogotá Norte & Usaquén', stops: 24, completed: 21, driver: 'Andrea Gómez (Van #12)', progress: 88 },
    { code: 'Ruta R-08', zone: 'Cali Sur & Ciudad Jardín', stops: 12, completed: 6, driver: 'Mateo Ríos (Van #02)', progress: 50 },
    { code: 'Ruta R-12', zone: 'Bucaramanga Cabecera', stops: 10, completed: 9, driver: 'Felipe Silva (Moto #09)', progress: 90 }
  ]

  return (
    <div className="content-grid">
      <div className="full-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">SEGUIMIENTO GPS</p>
            <h2>Rutas activas en carretera</h2>
          </div>
        </div>
        <div className="cards-grid">
          {routes.map(r => (
            <div key={r.code} className="card-item">
              <div className="card-header">
                <div>
                  <div className="card-title">{r.code}</div>
                  <div className="card-sub">{r.zone}</div>
                </div>
                <span className="live"><i /> ACTIVA</span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span>Progreso de entregas ({r.completed}/{r.stops})</span>
                  <strong>{r.progress}%</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${r.progress}%` }} />
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#64716b' }}>
                Conductor: <strong>{r.driver}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="route-panel">
        <div className="route-header">
          <div>
            <p className="eyebrow">MAPA OPERATIVO</p>
            <h2>Geolocalización</h2>
          </div>
          <span className="live"><i /> LIVE</span>
        </div>
        <div className="map" style={{ height: '320px' }}>
          <div className="map-grid" />
          <div className="map-road road-a" />
          <div className="map-road road-b" />
          <div className="map-road road-c" />
          <div className="map-pin pin-one"><Truck size={14} /></div>
          <div className="map-pin pin-two"><Truck size={14} /></div>
          <div className="map-pin pin-three"><Truck size={14} /></div>
          <div className="map-label label-one">R-01</div>
          <div className="map-label label-two">R-04</div>
        </div>
      </aside>
    </div>
  )
}

/* 8. INCIDENCIAS / INCIDENTS VIEW */
function IncidentsView() {
  const incidents = [
    { id: 'INC-401', order: '#00105', issue: 'Dirección no encontrada por el repartidor', priority: 'Alta', status: 'En Gestión', agent: 'Sofía Martínez' },
    { id: 'INC-402', order: '#00098', issue: 'Cliente ausente en dirección de entrega', priority: 'Media', status: 'Pendiente', agent: 'Carlos Restrepo' },
    { id: 'INC-403', order: '#00084', issue: 'Empaque secundario levemente abollado', priority: 'Baja', status: 'Resuelto', agent: 'Elena Gómez' }
  ]

  return (
    <>
      <section className="metrics">
        <Metric icon={<AlertTriangle />} label="Incidencias activas" value={3} detail="En proceso de gestión" warning />
        <Metric icon={<CheckCircle2 />} label="Resueltas hoy" value={14} detail="Atención eficiente" positive />
        <Metric icon={<Activity />} label="Tiempo promedio solución" value={22} detail="Minutos de respuesta" />
        <Metric icon={<ShieldCheck />} label="Satisfacción del cliente" value={97} detail="% resolución favorable" positive />
      </section>

      <div className="full-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">REPORTE DE NOVEDADES</p>
            <h2>Registro de Incidencias Operativas</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>PEDIDO AFECTADO</th>
                <th>DESCRIPCIÓN DE LA NOVEDAD</th>
                <th>PRIORIDAD</th>
                <th>ESTADO RESOLUCIÓN</th>
                <th>AGENTE ASIGNADO</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map(inc => (
                <tr key={inc.id}>
                  <td><strong className="order-id">{inc.id}</strong></td>
                  <td><strong>{inc.order}</strong></td>
                  <td>{inc.issue}</td>
                  <td>
                    <span className={`status status-${inc.priority === 'Alta' ? 'high' : inc.priority === 'Media' ? 'medium' : 'low'}`}>
                      <span />{inc.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${inc.status === 'Resuelto' ? 'status-delivered' : 'status-preparing'}`}>
                      <span />{inc.status}
                    </span>
                  </td>
                  <td>{inc.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* 9. PAGOS / PAYMENTS VIEW */
function PaymentsView() {
  const transactions = [
    { id: 'TXN-881', order: '#00103', amount: 1450000, method: 'Tarjeta de Crédito (Visa)', status: 'Aprobado', date: 'Hoy 14:32' },
    { id: 'TXN-882', order: '#00101', amount: 120000, method: 'Efectivo Contra Entrega (COD)', status: 'Pendiente Recaudo', date: 'Hoy 12:15' },
    { id: 'TXN-883', order: '#00104', amount: 890000, method: 'Transferencia PSE', status: 'Aprobado', date: 'Hoy 10:45' },
    { id: 'TXN-884', order: '#00102', amount: 350000, method: 'Nequi / Daviplata', status: 'Aprobado', date: 'Ayer 18:20' }
  ]

  return (
    <>
      <section className="metrics">
        <Metric icon={<CreditCard />} label="Recaudo del mes" value={68450000} detail="COP procesados" positive />
        <Metric icon={<Box />} label="Pendiente recaudo (COD)" value={4200000} detail="Efectivo en ruta" warning />
        <Metric icon={<CheckCircle2 />} label="Transacciones exitosas" value={342} detail="99.1% aprobación" positive />
        <Metric icon={<Activity />} label="Comisión promedio gateway" value={1} detail="1.8% comisión baja" />
      </section>

      <div className="full-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">HISTORIAL FINANCIERO</p>
            <h2>Transacciones y Métodos de Pago</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID TRANSACCIÓN</th>
                <th>PEDIDO</th>
                <th>MÉTODO DE PAGO</th>
                <th>FECHA</th>
                <th>MONTO TOTAL</th>
                <th>ESTADO PAGO</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td><strong className="order-id">{t.id}</strong></td>
                  <td><strong>{t.order}</strong></td>
                  <td>{t.method}</td>
                  <td><small>{t.date}</small></td>
                  <td className="money">${t.amount.toLocaleString('es-CO')} COP</td>
                  <td>
                    <span className={`status ${t.status === 'Aprobado' ? 'status-delivered' : 'status-preparing'}`}>
                      <span />{t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* 10. CANALES DE VENTA / CHANNELS VIEW */
function ChannelsView() {
  const channels = [
    { name: 'Shopify Retail Store', type: 'E-Commerce Directo', ordersMonth: 248, syncInterval: 'Tiempo Real', status: 'Conectado' },
    { name: 'WooCommerce Store', type: 'Plugin WordPress', ordersMonth: 115, syncInterval: 'Cada 5 min', status: 'Conectado' },
    { name: 'MercadoLibre Official Store', type: 'Marketplace', ordersMonth: 320, syncInterval: 'Tiempo Real', status: 'Conectado' },
    { name: 'VTEX Enterprise', type: 'Plataforma B2B', ordersMonth: 85, syncInterval: 'Tiempo Real', status: 'Conectado' },
    { name: 'API REST Custom Webhook', type: 'Integración Directa', ordersMonth: 42, syncInterval: 'Instantáneo', status: 'Activo' }
  ]

  return (
    <>
      <section className="metrics">
        <Metric icon={<Store />} label="Canales conectados" value={5} detail="Sincronización activa" positive />
        <Metric icon={<Package />} label="Pedidos por integraciones" value={810} detail="Este mes" positive />
        <Metric icon={<RefreshCw />} label="Latencia de sync" value={2} detail="Segundos promedio" positive />
        <Metric icon={<ShieldCheck />} label="Disponibilidad API" value={99} detail="% uptime servicios" positive />
      </section>

      <div className="cards-grid">
        {channels.map((ch, idx) => (
          <div key={idx} className="card-item">
            <div className="card-header">
              <div>
                <div className="card-title">{ch.name}</div>
                <div className="card-sub">{ch.type}</div>
              </div>
              <span className="status status-connected"><span />{ch.status}</span>
            </div>

            <div style={{ display: 'grid', gap: '8px', fontSize: '11px', color: '#54635c', marginTop: '6px' }}>
              <div>• Pedidos procesados este mes: <strong>{ch.ordersMonth} órdenes</strong></div>
              <div>• Frecuencia de sincronización: <strong>{ch.syncInterval}</strong></div>
            </div>

            <button className="outline-button" style={{ margin: '10px 0 0', width: '100%' }}>
              Configurar Webhooks <ArrowUpRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

/* HELPER COMPONENTS */
function Metric({ icon, label, value, detail, positive, warning }: {
  icon: React.ReactNode; label: string; value: number; detail: string; positive?: boolean; warning?: boolean
}) {
  return (
    <div className="metric">
      <div className={`metric-icon ${warning ? 'warning' : ''}`}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{typeof value === 'number' ? value.toLocaleString('es-CO') : value}</strong>
        <small className={positive ? 'positive' : warning ? 'warning-text' : ''}>
          {positive && '↗ '}{detail}
        </small>
      </div>
    </div>
  )
}

function NewOrder({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ customerName: '', deliveryAddress: '', total: '' })
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, total: Number(form.total) })
      })
    } catch {
      // Fallback
    } finally {
      setSaving(false)
      onCreated()
    }
  }

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={submit}>
        <div className="modal-heading">
          <div>
            <p className="eyebrow">NUEVA OPERACIÓN</p>
            <h2>Registrar pedido</h2>
          </div>
          <button type="button" className="close-button" onClick={onClose}><X size={18} /></button>
        </div>
        <label>
          Nombre del cliente
          <input required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Ej. Laura Gómez" />
        </label>
        <label>
          Dirección de entrega
          <input required value={form.deliveryAddress} onChange={e => setForm({ ...form, deliveryAddress: e.target.value })} placeholder="Calle 00 # 00-00" />
        </label>
        <label>
          Total del pedido (COP)
          <input required min="1" type="number" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} placeholder="0" />
        </label>
        <button className="primary-button modal-submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Crear pedido'} <ArrowUpRight size={16} />
        </button>
      </form>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
