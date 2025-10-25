"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Package, Trash2 } from "lucide-react"

export default function OrderForm({ onSubmit, onCancel, user }) {
  const [formData, setFormData] = useState({
    firmName: user.role === "master" ? "" : user.firm,
    partyPONumber: "",
    partyPODate: "",
    gstNumber: "",
    partyName: "",
    address: "",
    typeOfTransporting: "",
    partyPOCopy: null,
    freeReplacement: "",
    referenceNo: "",
    paymentToBeTaken: "",
    orderReceivedForm: "",
    contactPersonName: "",
    contactPersonWhatsApp: "",
    leadTimeCollection: "",
    typeOfApplication: "",
    retentionPayment: "",
    retentionPercentage: "",
    leadTimeRetention: "",
    specificConcern: "",
    customerCategory: "",
    agent: "",
    typeOfPI: "",
    totalPOValue: "",
    marketingSalesPerson: "",
    tcRequired: "",
    products: [],
  })

  const [showProductForm, setShowProductForm] = useState(false)
  const [currentProduct, setCurrentProduct] = useState({
    productName: "",
    quantity: "",
    rate: "",
    totalPOBasicValue: "",
    uom: "",
    aluminaPercentage: "",
    ironPercentage: "",
    advance: "",
    basic: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProductChange = (field, value) => {
    setCurrentProduct((prev) => ({ ...prev, [field]: value }))
  }

  const addProduct = () => {
    if (currentProduct.productName && currentProduct.quantity) {
      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, { ...currentProduct, id: Date.now() }],
      }))
      setCurrentProduct({
        productName: "",
        quantity: "",
        rate: "",
        totalPOBasicValue: "",
        uom: "",
        aluminaPercentage: "",
        ironPercentage: "",
        advance: "",
        basic: "",
      })
      setShowProductForm(false)
    }
  }

  const removeProduct = (productId) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
          <p className="text-gray-600 mt-1">Fill in the details to create a new order</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-white/50">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pl-11">
              <div className="space-y-2">
                <Label htmlFor="firmName" className="text-sm font-medium text-gray-700">
                  Firm Name *
                </Label>
                <Select
                  value={formData.firmName}
                  onValueChange={(value) => handleInputChange("firmName", value)}
                  disabled={user.role !== "master"}
                >
                  <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select Firm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AAA">AAA</SelectItem>
                    <SelectItem value="BBB">BBB</SelectItem>
                    <SelectItem value="CCC">CCC</SelectItem>
                    <SelectItem value="DDD">DDD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partyPONumber" className="text-sm font-medium text-gray-700">
                  Party PO Number *
                </Label>
                <Input
                  id="partyPONumber"
                  value={formData.partyPONumber}
                  onChange={(e) => handleInputChange("partyPONumber", e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter PO number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partyPODate" className="text-sm font-medium text-gray-700">
                  Party PO Date *
                </Label>
                <Input
                  id="partyPODate"
                  type="date"
                  value={formData.partyPODate}
                  onChange={(e) => handleInputChange("partyPODate", e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstNumber" className="text-sm font-medium text-gray-700">
                  GST Number *
                </Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter GST number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partyName" className="text-sm font-medium text-gray-700">
                  Party Name *
                </Label>
                <Input
                  id="partyName"
                  value={formData.partyName}
                  onChange={(e) => handleInputChange("partyName", e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter party name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalPOValue" className="text-sm font-medium text-gray-700">
                  Total PO Value With Tax *
                </Label>
                <Input
                  id="totalPOValue"
                  type="number"
                  value={formData.totalPOValue}
                  onChange={(e) => handleInputChange("totalPOValue", e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter total value"
                  required
                />
              </div>
            </div>

            <div className="pl-11">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter complete address"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contact & Transport Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pl-11">
              <div className="space-y-2">
                <Label htmlFor="contactPersonName" className="text-sm font-medium text-gray-700">
                  Contact Person Name
                </Label>
                <Input
                  id="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPersonWhatsApp" className="text-sm font-medium text-gray-700">
                  Contact Person WhatsApp
                </Label>
                <Input
                  id="contactPersonWhatsApp"
                  value={formData.contactPersonWhatsApp}
                  onChange={(e) => handleInputChange("contactPersonWhatsApp", e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter WhatsApp number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeOfTransporting" className="text-sm font-medium text-gray-700">
                  Type of Transporting
                </Label>
                <Select
                  value={formData.typeOfTransporting}
                  onValueChange={(value) => handleInputChange("typeOfTransporting", value)}
                >
                  <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FOR">FOR</SelectItem>
                    <SelectItem value="Ex Factory">Ex Factory</SelectItem>
                    <SelectItem value="Ex Factory But paid by Us">Ex Factory But paid by Us</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              </div>
              <Button
                type="button"
                onClick={() => setShowProductForm(true)}
                className="bg-purple-600 hover:bg-purple-700 shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            {/* Product List */}
            <div className="pl-11">
              {formData.products.length > 0 ? (
                <div className="space-y-3">
                  {formData.products.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.productName}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Qty: {product.quantity}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Rate: ₹{product.rate}
                            </Badge>
                            {product.uom && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                              >
                                UOM: {product.uom}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No products added yet</p>
                  <p className="text-gray-400 text-sm mt-1">Click "Add Product" to get started</p>
                </div>
              )}
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl border-0">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold text-gray-900">Add Product</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setShowProductForm(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Product Name *</Label>
                        <Input
                          value={currentProduct.productName}
                          onChange={(e) => handleProductChange("productName", e.target.value)}
                          className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Quantity *</Label>
                        <Input
                          type="number"
                          value={currentProduct.quantity}
                          onChange={(e) => handleProductChange("quantity", e.target.value)}
                          className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Enter quantity"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Rate</Label>
                        <Input
                          type="number"
                          value={currentProduct.rate}
                          onChange={(e) => handleProductChange("rate", e.target.value)}
                          className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Enter rate"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">UOM</Label>
                        <Input
                          value={currentProduct.uom}
                          onChange={(e) => handleProductChange("uom", e.target.value)}
                          className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Unit of measurement"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Alumina %</Label>
                        <Input
                          type="number"
                          value={currentProduct.aluminaPercentage}
                          onChange={(e) => handleProductChange("aluminaPercentage", e.target.value)}
                          className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Alumina percentage"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Iron %</Label>
                        <Input
                          type="number"
                          value={currentProduct.ironPercentage}
                          onChange={(e) => handleProductChange("ironPercentage", e.target.value)}
                          className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Iron percentage"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowProductForm(false)}
                        className="flex-1 h-11"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={addProduct}
                        className="flex-1 h-11 bg-purple-600 hover:bg-purple-700"
                      >
                        Add Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 bg-white border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg">
              Create Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
