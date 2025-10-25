"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, X, Calendar, Building, FileText, User, IndianRupee, Package } from "lucide-react"
import { useState } from "react"

export default function OrderTable({ orders, showTabs = false, onSendToDispatch }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Filter by tab if tabs are shown
  const tabFilteredOrders = showTabs
    ? filteredOrders.filter((order) => {
        if (activeTab === "pending") {
          return !order.materialReceived
        } else {
          return order.materialReceived
        }
      })
    : filteredOrders

  const getStatusColor = (order) => {
    if (order.materialReceived) return "bg-green-100 text-green-800 border-green-200"
    if (order.invoiceCompleted) return "bg-blue-100 text-blue-800 border-blue-200"
    if (order.expectedDeliveryDate) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusText = (order) => {
    if (order.materialReceived) return "Completed"
    if (order.invoiceCompleted) return "Invoiced"
    if (order.logisticCompleted) return "In Transit"
    if (order.dispatchPlanned) return "Dispatched"
    if (order.expectedDeliveryDate) return "Processing"
    return "Pending"
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const closeDetailModal = () => {
    setIsDetailOpen(false)
    setSelectedOrder(null)
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-500 text-center max-w-md">
          Get started by creating your first order. Orders will appear here once they're added to the system.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {/* Order Detail Modal */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDetailModal}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Serial Number</label>
                  <p className="text-sm text-gray-900 font-medium">{selectedOrder.serialNo}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Firm</label>
                  <Badge
                    variant="outline"
                    className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 rounded-full"
                  >
                    {selectedOrder.firmName}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">PO Number</label>
                  <p className="text-sm text-gray-900">{selectedOrder.partyPONumber}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">PO Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedOrder.partyPODate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Party Information */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Party Information
                </h3>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Party Name</label>
                    <p className="text-sm text-gray-900">{selectedOrder.partyName}</p>
                  </div>
                  {selectedOrder.partyAddress && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900">{selectedOrder.partyAddress}</p>
                    </div>
                  )}
                  {selectedOrder.partyContact && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500">Contact</label>
                      <p className="text-sm text-gray-900">{selectedOrder.partyContact}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Financial Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">PO Value</label>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{Number.parseFloat(selectedOrder.totalPOValue || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {selectedOrder.advanceAmount && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-500">Advance Amount</label>
                      <p className="text-sm text-gray-900">
                        ₹{Number.parseFloat(selectedOrder.advanceAmount).toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Information */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Current Status</span>
                    <Badge className={`text-xs font-medium border rounded-full ${getStatusColor(selectedOrder)}`}>
                      {getStatusText(selectedOrder)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedOrder.dispatchPlanned ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className={selectedOrder.dispatchPlanned ? 'text-green-700' : 'text-gray-500'}>
                        Dispatch Planned
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedOrder.logisticCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className={selectedOrder.logisticCompleted ? 'text-green-700' : 'text-gray-500'}>
                        Logistics Completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedOrder.invoiceCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className={selectedOrder.invoiceCompleted ? 'text-green-700' : 'text-gray-500'}>
                        Invoice Completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedOrder.materialReceived ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className={selectedOrder.materialReceived ? 'text-green-700' : 'text-gray-500'}>
                        Material Received
                      </span>
                    </div>
                  </div>

                  {selectedOrder.expectedDeliveryDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Expected Delivery: </span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedOrder.notes && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Additional Notes
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button variant="outline" onClick={closeDetailModal}>
                Close
              </Button>
              {onSendToDispatch && !selectedOrder.dispatchPlanned && (
                <Button
                  onClick={() => {
                    onSendToDispatch(selectedOrder)
                    closeDetailModal()
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Send to Dispatch
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs - matching the image style */}
      {showTabs && (
        <div className="flex bg-gray-100 p-1 rounded-t-lg">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-3 px-6 text-sm font-medium rounded-lg transition-all ${
              activeTab === "pending" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className={`bg-white p-4 ${showTabs ? "" : "rounded-t-lg"} border-b border-gray-200`}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-900 py-4 px-6">Serial No</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6">Firm</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6">PO Number</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6">PO Date</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6">Party Name</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6">PO Value</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tabFilteredOrders.map((order, index) => (
                <TableRow key={order.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                  <TableCell className="font-medium text-gray-900 py-4 px-6">{order.serialNo}</TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge
                      variant="outline"
                      className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 rounded-full"
                    >
                      {order.firmName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 font-medium py-4 px-6">{order.partyPONumber}</TableCell>
                  <TableCell className="text-sm text-gray-600 py-4 px-6">
                    {new Date(order.partyPODate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 py-4 px-6">
                    <div className="max-w-[150px] truncate" title={order.partyName}>
                      {order.partyName}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-gray-900 py-4 px-6">
                    ₹{Number.parseFloat(order.totalPOValue || 0).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge className={`text-xs font-medium border rounded-full ${getStatusColor(order)}`}>
                      {getStatusText(order)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Button>
                      {onSendToDispatch && !order.dispatchPlanned && (
                        <Button
                          size="sm"
                          onClick={() => onSendToDispatch(order)}
                          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        >
                          Send to Dispatch
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Results count */}
      <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 rounded-b-lg">
        Showing {tabFilteredOrders.length} of {orders.length} orders
      </div>
    </div>
  )
}