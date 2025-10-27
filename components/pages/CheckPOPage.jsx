"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, CheckCircle2 } from "lucide-react"

export default function CheckPOPage({ user, orders, updateOrders, onNavigate }) {
  const [selectedOrders, setSelectedOrders] = useState([])
  const [deliveryDates, setDeliveryDates] = useState({})
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter orders based on user role
  const getFilteredOrders = () => {
    if (user.role === "master") {
      return orders
    } else {
      return orders.filter((order) => order.firmName === user.firm)
    }
  }

  const filteredOrders = getFilteredOrders()
  const pendingOrders = filteredOrders.filter((order) => !order.expectedDeliveryDate)
  const historyOrders = filteredOrders.filter((order) => order.expectedDeliveryDate)

  // Apply search filter
  const searchFilteredOrders = (ordersList) => {
    return ordersList.filter((order) =>
      Object.values(order).some((value) => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }

  const displayOrders =
    activeTab === "pending" ? searchFilteredOrders(pendingOrders) : searchFilteredOrders(historyOrders)

  const handleOrderSelection = (orderId, checked) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId])
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
      const newDates = { ...deliveryDates }
      delete newDates[orderId]
      setDeliveryDates(newDates)
    }
  }

  const handleDeliveryDateChange = (orderId, date) => {
    setDeliveryDates({
      ...deliveryDates,
      [orderId]: date,
    })
  }

  const handleSubmit = () => {
    const updatedOrders = orders.map((order) => {
      if (selectedOrders.includes(order.id) && deliveryDates[order.id]) {
        return {
          ...order,
          expectedDeliveryDate: deliveryDates[order.id],
          soChecked: false,
          deliveryChecked: false
        }
      }
      return order
    })

    updateOrders(updatedOrders)
    setSelectedOrders([])
    setDeliveryDates({})
    
    if (onNavigate) {
      onNavigate("Check for Delivery")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header - Hidden on Mobile */}
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-gray-900">Check PO</h1>
        <p className="text-gray-600">Review and set expected delivery dates for purchase orders</p>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Check PO</h1>
        <p className="text-sm text-gray-600 mt-1">Set delivery dates</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <CardTitle className="text-xl">Purchase Orders</CardTitle>
          {selectedOrders.length > 0 && (
            <Button onClick={handleSubmit} size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit Selected ({selectedOrders.length})
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="space-y-0">
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-t-lg">
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all text-center ${
                  activeTab === "pending" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pending ({pendingOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all text-center ${
                  activeTab === "history" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
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
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Select</TableHead>
                    )}
                    {activeTab === "pending" && (
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Expected Delivery Date</TableHead>
                    )}
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Serial No</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Firm Name</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Party PO Number</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Party PO Date</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Party Name</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Contact Person</TableHead>
                    {activeTab === "history" && (
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Expected Delivery Date</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                      {activeTab === "pending" && (
                        <TableCell className="py-4 px-6">
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={(checked) => handleOrderSelection(order.id, checked)}
                          />
                        </TableCell>
                      )}
                      {activeTab === "pending" && (
                        <TableCell className="py-4 px-6">
                          <Input
                            type="date"
                            disabled={!selectedOrders.includes(order.id)}
                            value={deliveryDates[order.id] || ""}
                            onChange={(e) => handleDeliveryDateChange(order.id, e.target.value)}
                            className="w-40"
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium py-4 px-6">{order.serialNo}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200">
                          {order.firmName}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6">{order.partyPONumber}</TableCell>
                      <TableCell className="py-4 px-6">{order.partyPODate}</TableCell>
                      <TableCell className="py-4 px-6">{order.partyName}</TableCell>
                      <TableCell className="py-4 px-6">{order.contactPersonName}</TableCell>
                      {activeTab === "history" && (
                        <TableCell className="py-4 px-6">
                          <Badge className="bg-green-500 text-white rounded-full">{order.expectedDeliveryDate}</Badge>
                        </TableCell>
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
                      className={`p-4 rounded-lg border ${
                        selectedOrders.includes(order.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                      } shadow-sm transition-all`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {activeTab === "pending" && (
                            <Checkbox
                              checked={selectedOrders.includes(order.id)}
                              onCheckedChange={(checked) => handleOrderSelection(order.id, checked)}
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">#{order.serialNo}</p>
                            <p className="text-xs text-gray-500">{order.partyPODate}</p>
                          </div>
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
                      </div>

                      {activeTab === "pending" && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <label className="text-xs font-medium text-gray-700 flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            Expected Delivery
                          </label>
                          <Input
                            type="date"
                            disabled={!selectedOrders.includes(order.id)}
                            value={deliveryDates[order.id] || ""}
                            onChange={(e) => handleDeliveryDateChange(order.id, e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                      )}

                      {activeTab === "history" && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600">Delivered on:</p>
                          <Badge className="mt-1 bg-green-500 text-white text-xs">
                            {order.expectedDeliveryDate}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="px-4 sm:px-6 py-3 bg-gray-50 text-sm text-gray-600 rounded-b-lg border-t border-gray-200">
              Showing {displayOrders.length} of{" "}
              {activeTab === "pending" ? pendingOrders.length : historyOrders.length} orders
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}