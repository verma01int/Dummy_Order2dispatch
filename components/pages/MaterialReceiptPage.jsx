"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Search } from "lucide-react"

export default function MaterialReceiptPage({ user, orders, updateOrders }) {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    materialReceivedDate: "",
    grnNumber: "",
  })

  // Filter orders based on user role and full kitting completed
  const getFilteredOrders = () => {
    let filtered = orders.filter((order) => order.fullKittingCompleted)
    if (user.role !== "master") {
      filtered = filtered.filter((order) => order.firmName === user.firm)
    }
    return filtered
  }

  const filteredOrders = getFilteredOrders()
  const pendingOrders = filteredOrders.filter((order) => !order.materialReceived)
  const historyOrders = filteredOrders.filter((order) => order.materialReceived)

  // Apply search filter
  const searchFilteredOrders = (ordersList) => {
    return ordersList.filter((order) =>
      Object.values(order).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  const displayOrders =
    activeTab === "pending" ? searchFilteredOrders(pendingOrders) : searchFilteredOrders(historyOrders)

  const handleMaterial = (order) => {
    setSelectedOrder(order)
    setFormData({
      materialReceivedDate: "",
      grnNumber: "",
    })
  }

  const handleSubmit = () => {
    if (!selectedOrder) return

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          materialReceived: true,
          materialReceiptDate: new Date().toISOString().split("T")[0],
          ...formData,
        }
      }
      return order
    })

    updateOrders(updatedOrders)
    setSelectedOrder(null)
    setFormData({
      materialReceivedDate: "",
      grnNumber: "",
    })
  }

  const handleCancel = () => {
    setSelectedOrder(null)
    setFormData({
      materialReceivedDate: "",
      grnNumber: "",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Material Receipt</h1>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Material Receipt Management</CardTitle>
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
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">DS-Number</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Serial No</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">LGST-SrN</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Firm Name</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Party Name</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Type of Transporting</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Bill No</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Bilty No</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Bilty Image</TableHead>
                      {activeTab === "history" && (
                        <>
                          <TableHead className="font-semibold text-gray-900 py-4 px-6">
                            Material Received Date
                          </TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4 px-6">GRN Number</TableHead>
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
                              onClick={() => handleMaterial(order)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Material
                            </Button>
                          </TableCell>
                        )}
                        <TableCell className="font-medium py-4 px-6">{order.dsNumber}</TableCell>
                        <TableCell className="py-4 px-6">{order.serialNo}</TableCell>
                        <TableCell className="font-medium py-4 px-6">{order.lgstNumber}</TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200">
                            {order.firmName}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">{order.partyName}</TableCell>
                        <TableCell className="py-4 px-6">{order.typeOfTransporting}</TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge className="bg-green-500 text-white rounded-full">{order.billNo}</Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge className="bg-purple-500 text-white rounded-full">{order.biltyNo}</Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          {order.biltyImage && <Badge className="bg-blue-500 text-white rounded-full">Uploaded</Badge>}
                        </TableCell>
                        {activeTab === "history" && (
                          <>
                            <TableCell className="py-4 px-6">
                              <Badge className="bg-green-500 text-white rounded-full">
                                {order.materialReceivedDate}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <Badge className="bg-orange-500 text-white rounded-full">{order.grnNumber}</Badge>
                            </TableCell>
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

      {/* Material Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Material Receipt</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pre-filled fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>DS-Number</Label>
                    <Input value={selectedOrder.dsNumber} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Serial No</Label>
                    <Input value={selectedOrder.serialNo} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>LGST-SrN</Label>
                    <Input value={selectedOrder.lgstNumber} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Firm Name</Label>
                    <Input value={selectedOrder.firmName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Party Name</Label>
                    <Input value={selectedOrder.partyName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input value={selectedOrder.products?.[0]?.productName || "N/A"} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Bill No</Label>
                    <Input value={selectedOrder.billNo} disabled />
                  </div>
                </div>

                {/* Editable fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Material Received Date</Label>
                    <Input
                      type="date"
                      value={formData.materialReceivedDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, materialReceivedDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GRN Number</Label>
                    <Input
                      value={formData.grnNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, grnNumber: e.target.value }))}
                      placeholder="Enter GRN number"
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
