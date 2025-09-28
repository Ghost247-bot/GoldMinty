import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: any;
  setFormData: (data: any) => void;
  isEditing: boolean;
}

export function TransactionDialog({ isOpen, onClose, onSave, formData, setFormData, isEditing }: TransactionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Transaction' : 'Create Transaction'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Transaction Type</Label>
              <Select 
                value={formData.transactionType} 
                onValueChange={(value) => setFormData({...formData, transactionType: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="dividend">Dividend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Metal Type</Label>
              <Select 
                value={formData.metalType} 
                onValueChange={(value) => setFormData({...formData, metalType: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Amount (oz)</Label>
              <Input 
                type="number" 
                step="0.0001" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.0000" 
              />
            </div>
            <div>
              <Label>Price per oz ($)</Label>
              <Input 
                type="number" 
                step="0.01" 
                value={formData.pricePerOz}
                onChange={(e) => setFormData({...formData, pricePerOz: e.target.value})}
                placeholder="0.00" 
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Transaction Date</Label>
              <Input 
                type="datetime-local" 
                value={formData.transactionDate}
                onChange={(e) => setFormData({...formData, transactionDate: e.target.value})}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Notes (Optional)</Label>
            <Textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Optional notes about this transaction..." 
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              {isEditing ? 'Update Transaction' : 'Create Transaction'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AIInsightDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: any;
  setFormData: (data: any) => void;
}

export function AIInsightDialog({ isOpen, onClose, onSave, formData, setFormData }: AIInsightDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create AI Insight</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Insight Type</Label>
              <Select 
                value={formData.insightType} 
                onValueChange={(value) => setFormData({...formData, insightType: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy_signal">Buy Signal</SelectItem>
                  <SelectItem value="sell_signal">Sell Signal</SelectItem>
                  <SelectItem value="hold_recommendation">Hold Recommendation</SelectItem>
                  <SelectItem value="rebalance_alert">Rebalance Alert</SelectItem>
                  <SelectItem value="market_sentiment">Market Sentiment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Metal Focus</Label>
              <Select 
                value={formData.metalFocus} 
                onValueChange={(value) => setFormData({...formData, metalFocus: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="all">All Metals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Confidence Score (%)</Label>
              <Input 
                type="number" 
                min="0" 
                max="100"
                value={formData.confidenceScore}
                onChange={(e) => setFormData({...formData, confidenceScore: e.target.value})}
                placeholder="75" 
              />
            </div>
            <div>
              <Label>Priority (1-10)</Label>
              <Input 
                type="number" 
                min="1" 
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                placeholder="1" 
              />
            </div>
            <div>
              <Label>Expires At (Optional)</Label>
              <Input 
                type="datetime-local" 
                value={formData.expiresAt}
                onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label>Recommendation</Label>
            <Textarea 
              value={formData.recommendation}
              onChange={(e) => setFormData({...formData, recommendation: e.target.value})}
              placeholder="Enter the AI recommendation..." 
              rows={3}
            />
          </div>

          <div>
            <Label>Reasoning</Label>
            <Textarea 
              value={formData.reasoning}
              onChange={(e) => setFormData({...formData, reasoning: e.target.value})}
              placeholder="Explain the reasoning behind this insight..." 
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
            />
            <Label>Active</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Create Insight
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}