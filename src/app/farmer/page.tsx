import React from 'react';
import { CheckCircle, MapPin, Calendar, User, Award, Clock, Truck, Package, DollarSign, Shield, Link, Info } from 'lucide-react';

export default function ProduceTracePage() {
  // Sample data - in a real app, this would come from props or API
  const produceData = {
    productName: "Organic Roma Tomatoes",
    batchId: "TOM-2024-0892",
    harvestDate: "2024-09-15",
    farmLocation: "Sunny Valley Farm, Salinas, CA",
    farmerName: "Maria Rodriguez",
    certification: "USDA Organic Certified #ORG-2024-1847"
  };

  const timelineData = [
    {
      stage: "Harvested",
      timestamp: "2024-09-15 06:30 AM",
      handledBy: "Maria Rodriguez",
      notes: "Fresh harvest, quality grade A+"
    },
    {
      stage: "Transported",
      timestamp: "2024-09-15 02:00 PM",
      handledBy: "GreenLogistics Co.",
      notes: "Temperature controlled transport, 2°C"
    },
    {
      stage: "Received",
      timestamp: "2024-09-16 08:15 AM",
      handledBy: "FreshMart Warehouse",
      notes: "Quality inspection passed"
    },
    {
      stage: "Price Update",
      timestamp: "2024-09-16 10:30 AM",
      handledBy: "FreshMart Systems",
      notes: "Fair trade price: $4.99/lb"
    }
  ];

  return (
    <div className="min-h-screen px-4 py-4 bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 text-white bg-green-600 rounded-t-lg">
          <h1 className="mb-2 text-xl font-bold">Trace Your Produce Journey</h1>
          <p className="text-sm text-green-100">Transparent • Trusted • Traceable</p>
        </div>

        {/* QR Code Section */}
        <div className="p-4 text-center border-b border-gray-200">
          <div className="inline-block p-2 bg-gray-100 rounded">
            <div className="flex items-center justify-center w-16 h-16 font-mono text-xs text-white bg-black">
              QR CODE
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-600">Scan to verify authenticity</p>
        </div>

        {/* Product Details */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Product Details</h2>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Package className="flex-shrink-0 w-4 h-4 mt-1 text-green-600" />
              <div>
                <p className="font-medium text-gray-800">{produceData.productName}</p>
                <p className="text-sm text-gray-600">Batch: {produceData.batchId}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="flex-shrink-0 w-4 h-4 mt-1 text-green-600" />
              <div>
                <p className="text-sm text-gray-800">Harvested: {produceData.harvestDate}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="flex-shrink-0 w-4 h-4 mt-1 text-green-600" />
              <div>
                <p className="text-sm text-gray-800">{produceData.farmLocation}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="flex-shrink-0 w-4 h-4 mt-1 text-green-600" />
              <div>
                <p className="text-sm text-gray-800">Farmer: {produceData.farmerName}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Award className="flex-shrink-0 w-4 h-4 mt-1 text-green-600" />
              <div>
                <p className="text-sm text-gray-800">{produceData.certification}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Supply Chain Timeline</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 font-medium text-left text-gray-700">Stage</th>
                  <th className="py-2 font-medium text-left text-gray-700">Time</th>
                  <th className="py-2 font-medium text-left text-gray-700">Handler</th>
                  <th className="py-2 font-medium text-left text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {timelineData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2">
                      <div className="flex items-center space-x-1">
                        {item.stage === 'Harvested' && <Calendar className="w-3 h-3 text-green-600" />}
                        {item.stage === 'Transported' && <Truck className="w-3 h-3 text-blue-600" />}
                        {item.stage === 'Received' && <Package className="w-3 h-3 text-purple-600" />}
                        {item.stage === 'Price Update' && <DollarSign className="w-3 h-3 text-orange-600" />}
                        <span className="font-medium">{item.stage}</span>
                      </div>
                    </td>
                    <td className="py-2 text-gray-600">{item.timestamp}</td>
                    <td className="py-2 text-gray-600">{item.handledBy}</td>
                    <td className="py-2 text-gray-600">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">Blockchain Verification</h2>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Shield className="flex-shrink-0 w-4 h-4 mt-1 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Immutable Ledger</p>
                <p className="text-xs text-gray-600">All data securely recorded on blockchain, ensuring transparency and preventing tampering.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Link className="flex-shrink-0 w-4 h-4 mt-1 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Secure Certificates</p>
                <p className="text-xs text-gray-600">Quality certificates and documents linked securely using IPFS distributed storage.</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-green-50">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Verified Authentic</span>
              </div>
              <p className="mt-1 text-xs text-green-700">This produce record has been cryptographically verified.</p>
            </div>
          </div>
        </div>

        {/* User Guide */}
        <div className="p-4">
          <h2 className="mb-3 text-lg font-semibold text-gray-800">How This Helps You</h2>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Info className="flex-shrink-0 w-4 h-4 mt-1 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Instant Access</p>
                <p className="text-xs text-gray-600">Simply scan the QR code to get complete produce history in seconds.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <DollarSign className="flex-shrink-0 w-4 h-4 mt-1 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Fair Pricing</p>
                <p className="text-xs text-gray-600">Transparent pricing ensures farmers get fair compensation and you pay honest prices.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="flex-shrink-0 w-4 h-4 mt-1 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Informed Decisions</p>
                <p className="text-xs text-gray-600">Make confident purchases with complete knowledge of your food's journey from farm to table.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">Powered by blockchain technology for maximum trust and transparency</p>
          </div>
        </div>
      </div>
    </div>
  );
}