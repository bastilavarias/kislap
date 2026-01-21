'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  CreditCard,
  CheckCircle2,
  Activity,
  MoreHorizontal,
  Box,
} from 'lucide-react';

// --- Types ---

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: 'paid' | 'pending' | 'cancelled' | 'shipped';
  items_count: number;
  created_at: string;
}

interface Booking {
  id: string;
  service_name: string;
  customer_name: string;
  contact: string;
  date: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

interface BusinessStats {
  totalRevenue: number;
  activeOrders: number;
  pendingBookings: number;
  totalCustomers: number;
  revenueGrowth: number;
}

interface ActivityLog {
  id: number;
  type: 'order' | 'booking' | 'system';
  message: string;
  amount?: number;
  created_at: string;
}

// --- Constants ---
const ITEMS_PER_PAGE = 5;

// --- Helper Components ---

const PaginationControls = ({
  page,
  total,
  onPageChange,
}: {
  page: number;
  total: number;
  onPageChange: (p: number) => void;
}) => (
  <div className="flex items-center justify-end space-x-2 py-4 mt-auto">
    <div className="flex-1 text-xs text-muted-foreground">
      Page {page} of {Math.ceil(total / ITEMS_PER_PAGE) || 1}
    </div>
    <div className="space-x-2 flex items-center">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="h-8 px-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= Math.ceil(total / ITEMS_PER_PAGE)}
        onClick={() => onPageChange(page + 1)}
        className="h-8 px-2"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
    confirmed: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
    completed: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200',
    shipped: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200',
    pending: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200',
    cancelled: 'bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200',
  };

  return (
    <Badge variant="outline" className={`capitalize shadow-none ${styles[status] || ''}`}>
      {status}
    </Badge>
  );
};

// Modified to accept className for height control
const RecentActivityFeed = ({
  activities,
  className,
}: {
  activities: ActivityLog[];
  className?: string;
}) => {
  return (
    <Card className={`flex flex-col shadow-sm ${className}`}>
      <CardHeader className="pb-3 border-b bg-muted/20">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Live Business Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors flex gap-3 items-start text-sm"
                >
                  <div
                    className={`p-2 rounded-full shrink-0 mt-0.5 
                    ${
                      act.type === 'order'
                        ? 'bg-emerald-100 text-emerald-600'
                        : act.type === 'booking'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {act.type === 'order' && <DollarSign className="w-4 h-4" />}
                    {act.type === 'booking' && <Calendar className="w-4 h-4" />}
                    {act.type === 'system' && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-foreground leading-none">{act.message}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(act.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {act.amount && (
                        <span className="text-xs font-bold text-emerald-600">
                          +${act.amount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs">No recent activity.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Component ---

export function Dashboard({ projectID }: { projectID?: number }) {
  // State
  const [stats, setStats] = useState<BusinessStats>({
    totalRevenue: 0,
    activeOrders: 0,
    pendingBookings: 0,
    totalCustomers: 0,
    revenueGrowth: 0,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination State
  const [ordersPage, setOrdersPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);

  // --- API Simulation ---

  const onGetStats = async () => {
    setStats({
      totalRevenue: 12450.0,
      activeOrders: 12,
      pendingBookings: 5,
      totalCustomers: 148,
      revenueGrowth: 12.5,
    });
  };

  const onGetOrders = async (page: number) => {
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        customer_name: 'Alice Johnson',
        customer_email: 'alice@ex.com',
        total: 120.5,
        status: 'paid',
        items_count: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 'ORD-002',
        customer_name: 'Bob Smith',
        customer_email: 'bob@ex.com',
        total: 45.0,
        status: 'pending',
        items_count: 1,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'ORD-003',
        customer_name: 'Charlie Brown',
        customer_email: 'charlie@ex.com',
        total: 320.0,
        status: 'shipped',
        items_count: 4,
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'ORD-004',
        customer_name: 'Diana Prince',
        customer_email: 'diana@ex.com',
        total: 89.99,
        status: 'paid',
        items_count: 1,
        created_at: new Date(Date.now() - 200000000).toISOString(),
      },
      {
        id: 'ORD-005',
        customer_name: 'Evan Wright',
        customer_email: 'evan@ex.com',
        total: 12.0,
        status: 'cancelled',
        items_count: 1,
        created_at: new Date(Date.now() - 300000000).toISOString(),
      },
    ];
    setOrders(mockOrders);
  };

  const onGetBookings = async (page: number) => {
    const mockBookings: Booking[] = [
      {
        id: 'BKG-101',
        service_name: 'Consultation',
        customer_name: 'Sarah Lee',
        contact: 'sarah@lee.com',
        date: new Date(Date.now() + 86400000).toISOString(),
        status: 'confirmed',
      },
      {
        id: 'BKG-102',
        service_name: 'Haircut',
        customer_name: 'Mike Ross',
        contact: '555-0123',
        date: new Date(Date.now() + 172800000).toISOString(),
        status: 'pending',
      },
      {
        id: 'BKG-103',
        service_name: 'Therapy',
        customer_name: 'Jessica Pearson',
        contact: 'jess@law.com',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
      },
      {
        id: 'BKG-104',
        service_name: 'Consultation',
        customer_name: 'Louis Litt',
        contact: 'louis@litt.com',
        date: new Date(Date.now() - 90000000).toISOString(),
        status: 'cancelled',
      },
      {
        id: 'BKG-105',
        service_name: 'Massage',
        customer_name: 'Harvey Specter',
        contact: 'harvey@specter.com',
        date: new Date(Date.now() + 200000000).toISOString(),
        status: 'confirmed',
      },
    ];
    setBookings(mockBookings);
  };

  const onGetActivities = async () => {
    setActivities([
      {
        id: 1,
        type: 'order',
        message: 'New order #ORD-001 received',
        amount: 120.5,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        type: 'booking',
        message: 'Booking request from Sarah Lee',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        type: 'system',
        message: 'Inventory updated for "Summer Tee"',
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 4,
        type: 'order',
        message: 'Order #ORD-003 marked as shipped',
        created_at: new Date(Date.now() - 10000000).toISOString(),
      },
      {
        id: 5,
        type: 'booking',
        message: 'Mike Ross updated appointment',
        created_at: new Date(Date.now() - 15000000).toISOString(),
      },
    ]);
  };

  useEffect(() => {
    if (projectID) {
      onGetStats();
      onGetOrders(1);
      onGetBookings(1);
      onGetActivities();
    }
  }, [projectID]);

  const handleOrdersPageChange = (p: number) => {
    setOrdersPage(p);
    onGetOrders(p);
  };

  const handleBookingsPageChange = (p: number) => {
    setBookingsPage(p);
    onGetBookings(p);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* 1. BUSINESS STATS CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+{stats.revenueGrowth}%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Processing or Shipping</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires confirmation</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime unique customers</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. MAIN CONTENT AREA + FEED (Aligned Heights) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Orders & Bookings Tabs */}
        <div className="lg:col-span-2 h-full flex flex-col">
          <Tabs defaultValue="orders" className="w-full flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="w-4 h-4" /> Orders
                </TabsTrigger>
                <TabsTrigger value="bookings" className="gap-2">
                  <Calendar className="w-4 h-4" /> Bookings
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ORDERS TAB */}
            <TabsContent value="orders" className="mt-0 flex-1 flex flex-col">
              <Card className="shadow-sm flex-1 flex flex-col">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Manage and view latest customer purchases.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-4">
                  <div className="rounded-md border overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left min-w-[600px]">
                      <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                          <th className="px-4 py-3">Order ID</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className="bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium group-hover:text-primary transition-colors">
                                  {order.customer_name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {order.customer_email}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    page={ordersPage}
                    total={50}
                    onPageChange={handleOrdersPageChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* BOOKINGS TAB */}
            <TabsContent value="bookings" className="mt-0 flex-1 flex flex-col">
              <Card className="shadow-sm flex-1 flex flex-col">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <CardTitle>Appointment Requests</CardTitle>
                  <CardDescription>Upcoming schedule and service requests.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-4">
                  <div className="rounded-md border overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left min-w-[600px]">
                      <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                          <th className="px-4 py-3">Service</th>
                          <th className="px-4 py-3">Date & Time</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {bookings.map((booking) => (
                          <tr
                            key={booking.id}
                            className="bg-card hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium">{booking.service_name}</td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {new Date(booking.date).toLocaleDateString()} <br />
                              {new Date(booking.date).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">{booking.customer_name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {booking.contact}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={booking.status} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls
                    page={bookingsPage}
                    total={15}
                    onPageChange={handleBookingsPageChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT: Feed (Fills Height) */}
        {/* We add 'pt-[52px]' to account for the TabsList height + margins on the left side so they visually align nicely at the top */}
        <div className="lg:col-span-1 h-full flex flex-col pt-[52px]">
          {/* Added h-full to Card in RecentActivityFeed definition */}
          <RecentActivityFeed activities={activities} className="h-full" />
        </div>
      </div>

      {/* 3. DETAILS DIALOG (Shared for Orders) */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        {selectedOrder && (
          <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
            <div className="p-6 pb-2 border-b">
              <DialogHeader className="flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <DialogTitle className="flex items-center gap-2">
                    Order {selectedOrder.id}
                  </DialogTitle>
                  <DialogDescription>
                    Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                  </DialogDescription>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </DialogHeader>
            </div>

            <div className="grid gap-6 p-6 overflow-y-auto max-h-[70vh]">
              {/* Customer Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-xl bg-muted/20">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Customer
                  </h4>
                  <p className="font-semibold text-sm">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground break-all">
                    {selectedOrder.customer_email}
                  </p>
                </div>
                <div className="p-4 border rounded-xl bg-muted/20">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> Payment
                  </h4>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(selectedOrder.total * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(selectedOrder.total * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-1">
                  <Package className="w-3 h-3" /> Order Items
                </h4>
                <div className="border rounded-xl overflow-hidden">
                  {/* Sample Product 1 */}
                  <div className="flex items-center gap-4 p-3 hover:bg-muted/30 border-b last:border-0">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Box className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Premium Cotton T-Shirt</p>
                      <p className="text-xs text-muted-foreground">Variant: Black / L</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">2 x $25.00</p>
                      <p className="text-xs font-bold">$50.00</p>
                    </div>
                  </div>

                  {/* Sample Product 2 */}
                  <div className="flex items-center gap-4 p-3 hover:bg-muted/30">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Box className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Classic Baseball Cap</p>
                      <p className="text-xs text-muted-foreground">Variant: Navy</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">1 x $20.00</p>
                      <p className="text-xs font-bold">$20.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 pt-2 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
              <Button variant="default" className="gap-2">
                <Mail className="w-4 h-4" /> Email Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
