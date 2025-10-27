"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Search, CheckCircle2 } from "lucide-react"

export default function CheckDeliveryPage({ user, orders, updateOrders }) {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    inStockOrNot: "",
    orderNumberProduction: "",
    qtyTransferred: "",
    batchNumberRemarks: "",
  })

  // Filter orders based on user role and SO checked
  const getFilteredOrders = () => {
    let filtered = orders.filter((order) => 
      order.expectedDeliveryDate &&  // Only include orders with expected delivery date
      !order.deliveryChecked  // Show if delivery is not checked
    )
    
    if (user.role !== "master") {
      filtered = filtered.filter((order) => order.firmName === user.firm)
    }
    return filtered
  }

  const filteredOrders = getFilteredOrders()
  const pendingOrders = filteredOrders.filter((order) => !order.deliveryChecked)
  const historyOrders = orders.filter((order) => 
    order.expectedDeliveryDate &&
    order.deliveryChecked &&
    (user.role === "master" || order.firmName === user.firm)
  )

  // Apply search filter
  const searchFilteredOrders = (ordersList) => {
    return ordersList.filter((order) =>
      Object.values(order).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }

  const displayOrders =
    activeTab === "pending" ? searchFilteredOrders(pendingOrders) : searchFilteredOrders(historyOrders)

  const handleCheck = (order) => {
    setSelectedOrder(order)
    setFormData({
      inStockOrNot: "",
      orderNumberProduction: "",
      qtyTransferred: "",
      batchNumberRemarks: "",
    })
  }

  const handleSubmit = () => {
    if (!selectedOrder) return

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          deliveryChecked: true,
          deliveryCheckDate: new Date().toISOString().split("T")[0],
          ...formData,
        }
      }
      return order
    })

    updateOrders(updatedOrders)
    setSelectedOrder(null)
    setFormData({
      inStockOrNot: "",
      orderNumberProduction: "",
      qtyTransferred: "",
      batchNumberRemarks: "",
    })
  }

  const handleCancel = () => {
    setSelectedOrder(null)
    setFormData({
      inStockOrNot: "",
      orderNumberProduction: "",
      qtyTransferred: "",
      batchNumberRemarks: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-900">Check for Delivery</h1>
        <p className="text-gray-600">Check stock availability and delivery readiness</p>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Check Delivery</h1>
        <p className="text-sm text-gray-600 mt-1">Verify stock & readiness</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Delivery Check</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-t-lg">
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all text-center ${
                  activeTab === "pending" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pending ({pendingOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all text-center ${
                  activeTab === "history" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                History ({historyOrders.length})
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50 w-full"
                />
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                    {activeTab === "pending" && (
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Action</TableHead>
                    )}
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Serial No</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Firm Name</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Party PO Number</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Party Name</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Contact Person</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Expected Delivery Date</TableHead>
                    {activeTab === "history" && (
                      <>
                        <TableHead className="font-semibold text-gray-900 py-4 px-6">In Stock Or Not</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4 px-6">Order Number Production</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4 px-6">Qty Transferred</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-4 px-6">Batch Number Remarks</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                      {activeTab === "pending" && (
                        <TableCell className="py-4 px-6">
                          <Button
                            size="sm"
                            onClick={() => handleCheck(order)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Check
                          </Button>
                        </TableCell>
                      )}
                      <TableCell className="font-medium py-4 px-6">{order.serialNo}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200">
                          {order.firmName}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6">{order.partyPONumber}</TableCell>
                      <TableCell className="py-4 px-6">{order.partyName}</TableCell>
                      <TableCell className="py-4 px-6">{order.contactPersonName}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge className="bg-green-500 text-white rounded-full">{order.expectedDeliveryDate}</Badge>
                      </TableCell>
                      {activeTab === "history" && (
                        <>
                          <TableCell className="py-4 px-6">
                            <Badge className="bg-blue-500 text-white rounded-full">{order.inStockOrNot}</Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6">{order.orderNumberProduction}</TableCell>
                          <TableCell className="py-4 px-6">{order.qtyTransferred}</TableCell>
                          <TableCell className="py-4 px-6">{order.batchNumberRemarks}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                {displayOrders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No orders found</p>
                ) : (
                  displayOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">#{order.serialNo}</p>
                          <p className="text-xs text-gray-500">{order.partyPODate}</p>
                        </div>
                        <Badge variant="outline" className="rounded-full text-xs">
                          {order.firmName}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">PO Number:</span>
                          <span className="font-medium">{order.partyPONumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Party:</span>
                          <span className="font-medium">{order.partyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contact:</span>
                          <span className="font-medium">{order.contactPersonName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expected:</span>
                          <Badge className="bg-green-500 text-white text-xs">{order.expectedDeliveryDate}</Badge>
                        </div>
                      </div>

                      {activeTab === "pending" && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <Button
                            size="sm"
                            onClick={() => handleCheck(order)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Check for Delivery
                          </Button>
                        </div>
                      )}

                      {activeTab === "history" && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge className="bg-blue-500 text-white text-xs">{order.inStockOrNot}</Badge>
                          </div>
                          {order.orderNumberProduction && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Prod #:</span>
                              <span className="font-medium">{order.orderNumberProduction}</span>
                            </div>
                          )}
                          {order.qtyTransferred && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Qty:</span>
                              <span className="font-medium">{order.qtyTransferred}</span>
                            </div>
                          )}
                          {order.batchNumberRemarks && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Batch:</span>
                              <span className="font-medium">{order.batchNumberRemarks}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="px-4 sm:px-6 py-3 bg-gray-50 text-sm text-gray-600 rounded-b-lg border-t border-gray-200">
              Showing {displayOrders.length} of {activeTab === "pending" ? pendingOrders.length : historyOrders.length} orders
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check Modal - Fullscreen on Mobile */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 lg:p-0">
          <Card className="w-full max-w-2xl lg:max-w-3xl max-h-screen lg:max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white border-b">
              <CardTitle className="text-lg lg:text-xl">Check for Delivery</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="space-y-4">
                {/* Pre-filled fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <Label className="text-xs">Firm Name</Label>
                    <Input value={selectedOrder.firmName} disabled className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Party PO Number</Label>
                    <Input value={selectedOrder.partyPONumber} disabled className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Party PO Date</Label>
                    <Input value={selectedOrder.partyPODate} disabled className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Party Name</Label>
                    <Input value={selectedOrder.partyName} disabled className="h-9" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Product Name</Label>
                    <Input value={selectedOrder.products?.[0]?.productName || "N/A"} disabled className="h-9" />
                  </div>
                </div>

                {/* In Stock Or Not */}
                <div className="space-y-2">
                  <Label className="text-sm">In Stock Or Not *</Label>
                  <Select
                    value={formData.inStockOrNot}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, inStockOrNot: value }))}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="For Production Planning">For Production Planning</SelectItem>
                      <SelectItem value="From Purchase">From Purchase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional fields for "In Stock" */}
                {formData.inStockOrNot === "In Stock" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Order Number Of The Production</Label>
                      <Input
                        value={formData.orderNumberProduction}
                        onChange={(e) => setFormData((prev) => ({ ...prev, orderNumberProduction: e.target.value }))}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Qty Transferred</Label>
                      <Input
                        value={formData.qtyTransferred}
                        onChange={(e) => setFormData((prev) => ({ ...prev, qtyTransferred: e.target.value }))}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Batch Number In Remarks</Label>
                      <Input
                        value={formData.batchNumberRemarks}
                        onChange={(e) => setFormData((prev) => ({ ...prev, batchNumberRemarks: e.target.value }))}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    Submit Check
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}