export const dynamic = "force-dynamic";
async function getOrders(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/admin/orders`,{ cache:"no-store" });
  return res.json();
}

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/admin/stats`, { cache: "no-store" });
  return res.json();
}

export default async function AdminPage() {
  const orders = await getOrders();
  const stats = await getStats(); // Add daily/weekly stats
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <h3>Today's Orders</h3>
          <p className="text-2xl font-bold">{stats.todayOrders}</p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p className="text-2xl font-bold">${stats.todayRevenue}</p>
        </div>
        {/* More stats */}
      </div>
      
      {/* Orders list with real-time updates */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Live Orders</h2>
        <div className="grid gap-3">
          {orders.map((o:any)=>(
            <div key={o.id} className="card">
              <div className="flex justify-between">
                <div><b>{o.code}</b> — {o.customerName} ({o.customerPhone})</div>
                <form action={`/api/admin/orders/${o.id}/advance`} method="post">
                  <button className="btn btn-primary">Advance</button>
                </form>
              </div>
              <div className="text-sm text-gray-500">Status: {o.status} • Total ${(o.totalCents/100).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">Reload page to refresh (swap to WS later).</p>
      </div>
    </div>
  );
}