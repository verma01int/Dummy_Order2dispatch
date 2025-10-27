"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import OrderForm from "../forms/OrderForm"
import OrderTable from "../tables/OrderTable"
import { Plus, FileText, TrendingUp, CheckCircle } from "lucide-react"

export default function OrderPage({ user, orders, updateOrders }) {
  const [showForm, setShowForm] = useState(false)

  const handleAddOrder = (newOrder) => {
    // Generate serial number based on firm
    const firmOrders = orders.filter((order) => order.firmName === newOrder.firmName)
    let serialPrefix = ""

    switch (newOrder.firmName) {
      case "AAA":
        serialPrefix = "AAA"
        break
      case "BBB":
        serialPrefix = "BBB"
        break
      case "CCC":
        serialPrefix = "CCC"
        break
      case "DDD":
        serialPrefix = "DDD"
        break
      default:
        serialPrefix = "ORD"
    }

    const serialNumber = `${serialPrefix}-${String(firmOrders.length + 1).padStart(3, "0")}`

    const orderWithSerial = {
      ...newOrder,
      serialNo: serialNumber,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    updateOrders([...orders, orderWithSerial])
    setShowForm(false)
  }

  const handleSendToDispatch = (order) => {
    // Generate DS Number for dispatch
    const firmOrders = orders.filter((o) => o.firmName === order.firmName && o.dsNumber)
    const dsNumber = `DS-${order.firmName === "CCC" ? "REF" : order.firmName}-${String(firmOrders.length + 1).padStart(3, "0")}`

    const updatedOrders = orders.map((o) => {
      if (o.id === order.id) {
        return {
          ...o,
          // Set all required fields to move directly to dispatch planning
          expectedDeliveryDate: new Date().toISOString().split("T")[0],
          soChecked: true,
          soCheckedDate: new Date().toISOString().split("T")[0],
          deliveryChecked: true,
          deliveryCheckDate: new Date().toISOString().split("T")[0],
          inStockOrNot: "In Stock",
          dispatchPlanned: true,
          dispatchPlanDate: new Date().toISOString().split("T")[0],
          dsNumber,
          dateOfDispatch: new Date().toISOString().split("T")[0],
        }
      }
      return o
    })

    updateOrders(updatedOrders)
  }

  // Filter orders based on user role
  const getFilteredOrders = () => {
    if (user.role === "master") {
      return orders
    } else {
      return orders.filter((order) => order.firmName === user.firm)
    }
  }

  const filteredOrders = getFilteredOrders()
  const totalValue = filteredOrders.reduce((sum, order) => sum + Number.parseFloat(order.totalPOValue || 0), 0)

  return (
    <div className="space-y-8">
      {/* Desktop Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 hidden lg:flex">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders Management</h1>
          <p className="text-gray-600">Manage your orders and track their progress through the workflow</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="bg-white border-gray-300 hover:bg-gray-50">
            <FileText className="mr-2 h-4 w-4" />
            Export Orders
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add New Order
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage & track orders</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">{filteredOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Value</p>
                <p className="text-2xl font-bold text-green-900">₹{totalValue.toLocaleString("en-IN")}</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Quick Dispatch</p>
                <p className="text-sm text-purple-600 mt-1">Send orders directly to dispatch</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-2xl">
            <OrderForm onSubmit={handleAddOrder} onCancel={() => setShowForm(false)} user={user} />
          </div>
        </div>
      )}

      {/* Orders Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-semibold text-gray-900">All Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <OrderTable orders={filteredOrders} showTabs={true} onSendToDispatch={handleSendToDispatch} />
        </CardContent>
      </Card>
    </div>
  )
}
