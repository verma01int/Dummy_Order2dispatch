"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Search } from "lucide-react"

export default function TestReportPage({ user, orders, updateOrders }) {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    uniqueKey: "",
    stepKey: "",
  })

  // Filter orders based on user role and logistic completed
  const getFilteredOrders = () => {
    let filtered = orders.filter((order) => order.logisticCompleted)
    if (user.role !== "master") {
      filtered = filtered.filter((order) => order.firmName === user.firm)
    }
    return filtered
  }

  const filteredOrders = getFilteredOrders()
  const pendingOrders = filteredOrders.filter((order) => !order.testReportCompleted)
  const historyOrders = filteredOrders.filter((order) => order.testReportCompleted)

  // Apply search filter
  const searchFilteredOrders = (ordersList) => {
    return ordersList.filter((order) =>
      Object.values(order).some((value) => value?.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  const displayOrders =
    activeTab === "pending" ? searchFilteredOrders(pendingOrders) : searchFilteredOrders(historyOrders)

  const handleTest = (order) => {
    setSelectedOrder(order)
    setFormData({
      uniqueKey: "",
      stepKey: "",
    })
  }

  const handleSubmit = () => {
    if (!selectedOrder) return

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          testReportCompleted: true,
          testReportDate: new Date().toISOString().split("T")[0],
          ...formData,
        }
      }
      return order
    })

    updateOrders(updatedOrders)
    setSelectedOrder(null)
    setFormData({
      uniqueKey: "",
      stepKey: "",
    })
  }

  const handleCancel = () => {
    setSelectedOrder(null)
    setFormData({
      uniqueKey: "",
      stepKey: "",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Test Report</h1>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Test Report Management</CardTitle>
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
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Party PO Number</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Party Name</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Type of Transporting</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Transporter Name</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Truck No</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Bilty No</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4 px-6">Type Of Rate</TableHead>
                      {activeTab === "history" && (
                        <>
                          <TableHead className="font-semibold text-gray-900 py-4 px-6">Unique Key</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-4 px-6">Step Key</TableHead>
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
                              onClick={() => handleTest(order)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Test
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
                        <TableCell className="py-4 px-6">{order.partyPONumber}</TableCell>
                        <TableCell className="py-4 px-6">{order.partyName}</TableCell>
                        <TableCell className="py-4 px-6">{order.typeOfTransporting}</TableCell>
                        <TableCell className="py-4 px-6">{order.transporterName}</TableCell>
                        <TableCell className="py-4 px-6">{order.truckNo}</TableCell>
                        <TableCell className="py-4 px-6">{order.biltyNo}</TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge className="bg-orange-500 text-white rounded-full">{order.typeOfRate}</Badge>
                        </TableCell>
                        {activeTab === "history" && (
                          <>
                            <TableCell className="py-4 px-6">
                              <Badge className="bg-green-500 text-white rounded-full">{order.uniqueKey}</Badge>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <Badge className="bg-purple-500 text-white rounded-full">{order.stepKey}</Badge>
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

      {/* Test Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Test Report</CardTitle>
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
                    <Label>Party PO Number</Label>
                    <Input value={selectedOrder.partyPONumber} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Party PO Date</Label>
                    <Input value={selectedOrder.partyPODate} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Party Name</Label>
                    <Input value={selectedOrder.partyName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input value={selectedOrder.products?.[0]?.productName || "N/A"} disabled />
                  </div>
                </div>

                {/* Editable fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unique Key</Label>
                    <Input
                      value={formData.uniqueKey}
                      onChange={(e) => setFormData((prev) => ({ ...prev, uniqueKey: e.target.value }))}
                      placeholder="Enter unique key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Step Key</Label>
                    <Input
                      value={formData.stepKey}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stepKey: e.target.value }))}
                      placeholder="Enter step key"
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
