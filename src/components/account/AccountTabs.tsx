'use client';

import { useState } from 'react';
import { User, Package, MapPin, CreditCard, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AccountTabsProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function ProfileTab({ user, onUpdate }: any) {
  return <div>Profile Tab</div>;
}

export function CompanyTab() {
  return <div>Company Tab</div>;
}

export function PreferencesTab() {
  return <div>Preferences Tab</div>;
}

export function AccountTabs({ user }: AccountTabsProps) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="profile">
          <User className="h-4 w-4 mr-2" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="orders">
          <Package className="h-4 w-4 mr-2" />
          Orders
        </TabsTrigger>
        <TabsTrigger value="addresses">
          <MapPin className="h-4 w-4 mr-2" />
          Addresses
        </TabsTrigger>
        <TabsTrigger value="payment">
          <CreditCard className="h-4 w-4 mr-2" />
          Payment
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-lg">{user.name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-lg">{user.email}</p>
              </div>
              <Button>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="orders" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View your past orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No orders found.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="addresses" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Saved Addresses</CardTitle>
            <CardDescription>Manage your delivery addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No addresses saved.</p>
            <Button className="mt-4">Add Address</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payment" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment options</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No payment methods saved.</p>
            <Button className="mt-4">Add Payment Method</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}