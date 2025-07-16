// components/AddressForm.jsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddressForm = ({ newAddress, handleInputChange, onSave, onCancel }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-amber-900">Add Delivery Address</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            name="name"
            value={newAddress.name}
            onChange={handleInputChange}
            placeholder="Full Name"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={newAddress.phone}
            onChange={handleInputChange}
            placeholder="Phone number"
          />
        </div>
      </div>
      <Label htmlFor="street">Street Address</Label>
      <Input
        id="street"
        name="street"
        value={newAddress.street}
        onChange={handleInputChange}
        placeholder="Street address"
      />
      <div className="grid grid-cols-3 gap-4">
        <Input
          placeholder="City"
          name="city"
          value={newAddress.city}
          onChange={handleInputChange}
        />
        <Input
          placeholder="State"
          name="state"
          value={newAddress.state}
          onChange={handleInputChange}
        />
        <Input
          placeholder="ZIP"
          name="zipCode"
          value={newAddress.zipCode}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex gap-2">
        <Button className="bg-amber-700" onClick={onSave}>
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default AddressForm;
