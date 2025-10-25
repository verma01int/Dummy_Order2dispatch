"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Search } from "lucide-react"

export default function DispatchPlanningPage({ user, orders, updateOrders }) {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    dateOfDispatch: "",
    toBeReconfirm: "",
    crmName: "",
    crmId: "",
  })

  // Filter orders based on user role and delivery checked
  const getFilteredOrders = () => {
    let filtered = orders.filter((order) => order.deliveryChecked)
    if (user.role !== "master") {
      filtered = filtered.filter((order) => order.firmName === user.firm)
    }
    return filtered
  }

  const filteredOrders = getFilteredOrders()
  const pendingOrders = filteredOrders.filter((order) => !order.dispatchPlanned)
  const historyOrders = filteredOrders.filter((order) => order.dispatchPlanned)

  // Apply search filter
  const searchFilteredOrders = (ordersList) => {
    return ordersList.filter((order) =>
      Object.values(order).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  const displayOrders =
    activeTab === "pending" ? searchFilteredOrders(pendingOrders) : searchFilteredOrders(historyOrders)

  // Generate DS Number
  const generateDSNumber = (firmName, orderCount) => {
    const prefix = firmName === "REFRASYNTH" ? "REF" : firmName
    return `DS-${prefix}-${String(orderCount + 1).padStart(3, "0")}`
  }

  const handlePlanning = (order) => {
    setSelectedOrder(order)
    setFormData({
      dateOfDispatch: "",
      toBeReconfirm: "",
      crmName: "",
      crmId: "",
    })
  }

  const handleSubmit = () => {
    if (!selectedOrder) return

    // Generate DS Number
    const firmOrders = orders.filter((order) => order.firmName === selectedOrder.firmName && order.dsNumber)
    const dsNumber = generateDSNumber(selectedOrder.firmName, firmOrders.length)

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          dispatchPlanned: true,
          dispatchPlanDate: new Date().toISOString().split("T")[0],
          dsNumber,
          ...formData,
        }
      }
      return order
    })

    updateOrders(updatedOrders)
    setSelectedOrder(null)
    setFormData({
      dateOfDispatch: "",
      toBeReconfirm: "",
      crmName: "",
      crmId: "",
    })
  }

  const handleCancel = () => {
    setSelectedOrder(null)
    setFormData({
      dateOfDispatch: "",
      toBeReconfirm: "",
      crmName: "",
      crmId: "",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dispatch Planning</h1>
        <p className="text-gray-600">Plan and schedule order dispatches</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Dispatch Planning</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-t-lg">
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex-1 py-3 px-6 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "pending" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pending ({pendingOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-3 px-6 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "history" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                History ({historyOrders.length})
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 border-b border-gray-200">
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
                      {activeTab === "pending" && (
                        <TableHead className="font-semibold text-gray-900 py-4 px-6">Action</TableHead>
                      )}
                      {activeTab === "history" && (
                        <TableHead className="font-semibold text-gray-900 py-4 px-6">DS-Number</TableHead>
                      )}
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Serial No</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Firm Name</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Party PO Number</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Party Name</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Type of Transporting</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Contact Person</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Expected Delivery Date</TableHead>
                      {activeTab === "history" && (
                        <>
                          <TableHead className="font-semibold text-gray-900 py-4 px-6">Date Of Dispatch</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4 px-6">CRM Name</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4 px-6">CRM ID</TableHead>
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
                              onClick={() => handlePlanning(order)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Planning
                            </Button>
                          </TableCell>
                        )}
                        {activeTab === "history" && (
                          <TableCell className="font-medium py-4 px-6">{order.dsNumber}</TableCell>
                        )}
                        <TableCell className="font-medium py-4 px-6">{order.serialNo}</TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200">
                            {order.firmName}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">{order.partyPONumber}</TableCell>
                        <TableCell className="py-4 px-6">{order.partyName}</TableCell>
                        <TableCell className="py-4 px-6">{order.typeOfTransporting}</TableCell>
                        <TableCell className="py-4 px-6">{order.contactPersonName}</TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge className="bg-green-500 text-white rounded-full">{order.expectedDeliveryDate}</Badge>
                        </TableCell>
                        {activeTab === "history" && (
                          <>
                            <TableCell className="py-4 px-6">
                              <Badge className="bg-purple-500 text-white rounded-full">{order.dateOfDispatch}</Badge>
                            </TableCell>
                            <TableCell className="py-4 px-6">{order.crmName}</TableCell>
                            <TableCell className="py-4 px-6">{order.crmId}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Results count */}
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 rounded-b-lg">
              Showing {displayOrders.length} of {activeTab === "pending" ? pendingOrders.length : historyOrders.length}{" "}
              orders
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planning Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dispatch Planning</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pre-filled fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Serial No</Label>
                    <Input value={selectedOrder.serialNo} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Firm Name</Label>
                    <Input value={selectedOrder.firmName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Party PO Number</Label>
                    <Input value={selectedOrder.partyPONumber} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input value={selectedOrder.products?.[0]?.productName || "N/A"} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Type of Transporting</Label>
                    <Input value={selectedOrder.typeOfTransporting} disabled />
                  </div>
                </div>

                {/* Editable fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Of Dispatch</Label>
                    <Input
                      type="date"
                      value={formData.dateOfDispatch}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dateOfDispatch: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To Be Reconfirm</Label>
                    <Input
                      value={formData.toBeReconfirm}
                      onChange={(e) => setFormData((prev) => ({ ...prev, toBeReconfirm: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CRM Name</Label>
                    <Input
                      value={formData.crmName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, crmName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CRM ID</Label>
                    <Input
                      value={formData.crmId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, crmId: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                    Submit
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
