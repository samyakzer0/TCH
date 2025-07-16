#!/bin/bash

# Script to replace $ with ₹ in all price-related occurrences
# Run this in your project root directory

echo "Replacing $ with ₹ in price displays..."

# Replace in main components
sed -i 's/\$\([^{]*\.toFixed(2)\)/₹\1/g' components/OrderingSystem.tsx
sed -i 's/\$\([^{]*\.toFixed(2)\)/₹\1/g' components/AdminDashboard.tsx
sed -i 's/\$\([^{]*\.toFixed(2)\)/₹\1/g' components/OrderStatusTracker.tsx
sed -i 's/\$\([^{]*\.toFixed(2)\)/₹\1/g' components/DigitalReceipt.tsx

# Replace in API and services
sed -i 's/Total: \$\([^{]*\.toFixed(2)\)/Total: ₹\1/g' app/api/notifications/route.ts
sed -i 's/Total: <strong>\$\([^{]*\.toFixed(2)\)/Total: <strong>₹\1/g' lib/emailService.ts
sed -i 's/Total: \$\([^{]*\.toFixed(2)\)/Total: ₹\1/g' lib/emailService.ts

# Replace in static/demo files
sed -i 's/\$ /₹ /g' components/ProductsSection.tsx
sed -i 's/\$ /₹ /g' Koffee-Lane-Homepage-Clone.html
sed -i 's/\$\([0-9]*\.[0-9]*\)/₹\1/g' app/menu/page.tsx

echo "Currency conversion complete! All $ signs have been replaced with ₹"
echo "Note: Please verify the changes and test the application"
