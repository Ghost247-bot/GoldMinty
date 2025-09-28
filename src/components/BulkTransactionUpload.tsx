import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Papa from 'papaparse';

interface BulkTransactionUploadProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUserId: string;
  onSuccess: () => void;
  currentUser: any;
}

interface TransactionRow {
  transaction_type: string;
  metal_type: string;
  amount: number;
  price_per_oz: number;
  transaction_date: string;
  status: string;
  notes?: string;
  isValid: boolean;
  errors: string[];
}

export function BulkTransactionUpload({ isOpen, onClose, selectedUserId, onSuccess, currentUser }: BulkTransactionUploadProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState<TransactionRow[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const validateTransactionRow = (row: any): TransactionRow => {
    const errors: string[] = [];
    
    // Validate transaction type
    const validTransactionTypes = ['buy', 'sell', 'transfer', 'dividend'];
    if (!row.transaction_type || !validTransactionTypes.includes(row.transaction_type.toLowerCase())) {
      errors.push('Invalid transaction type. Must be: buy, sell, transfer, or dividend');
    }

    // Validate metal type
    const validMetalTypes = ['gold', 'silver', 'platinum'];
    if (!row.metal_type || !validMetalTypes.includes(row.metal_type.toLowerCase())) {
      errors.push('Invalid metal type. Must be: gold, silver, or platinum');
    }

    // Validate amount
    const amount = parseFloat(row.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push('Amount must be a positive number');
    }

    // Validate price per oz
    const pricePerOz = parseFloat(row.price_per_oz);
    if (isNaN(pricePerOz) || pricePerOz <= 0) {
      errors.push('Price per oz must be a positive number');
    }

    // Validate date
    const transactionDate = new Date(row.transaction_date);
    if (isNaN(transactionDate.getTime())) {
      errors.push('Invalid transaction date format. Use YYYY-MM-DD or YYYY-MM-DD HH:mm:ss');
    }

    // Validate status
    const validStatuses = ['completed', 'pending', 'cancelled'];
    const status = row.status || 'completed';
    if (!validStatuses.includes(status.toLowerCase())) {
      errors.push('Invalid status. Must be: completed, pending, or cancelled');
    }

    return {
      transaction_type: row.transaction_type?.toLowerCase() || '',
      metal_type: row.metal_type?.toLowerCase() || '',
      amount,
      price_per_oz: pricePerOz,
      transaction_date: transactionDate.toISOString(),
      status: status.toLowerCase(),
      notes: row.notes || '',
      isValid: errors.length === 0,
      errors
    };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file.",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
      parseCSVFile(selectedFile);
    }
  };

  const parseCSVFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validatedData: TransactionRow[] = results.data.map((row: any) => 
          validateTransactionRow(row)
        );
        setParsedData(validatedData);
        setShowPreview(true);
      },
      error: (error) => {
        toast({
          title: "CSV Parse Error",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleBulkUpload = async () => {
    if (!selectedUserId || !currentUser?.id || parsedData.length === 0) return;

    const validTransactions = parsedData.filter(row => row.isValid);
    
    if (validTransactions.length === 0) {
      toast({
        title: "No Valid Transactions",
        description: "Please fix validation errors before uploading.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const transactionsToInsert = validTransactions.map(row => ({
        user_id: selectedUserId,
        transaction_type: row.transaction_type,
        metal_type: row.metal_type,
        amount: row.amount,
        price_per_oz: row.price_per_oz,
        transaction_date: row.transaction_date,
        status: row.status,
        notes: row.notes,
        created_by: currentUser.id
      }));

      // Insert in batches of 100 to avoid timeout issues
      const batchSize = 100;
      const batches = [];
      for (let i = 0; i < transactionsToInsert.length; i += batchSize) {
        batches.push(transactionsToInsert.slice(i, i + batchSize));
      }

      for (let i = 0; i < batches.length; i++) {
        const { error } = await supabase
          .from('user_transactions')
          .insert(batches[i]);

        if (error) throw error;

        setUploadProgress(((i + 1) / batches.length) * 100);
      }

      toast({
        title: "Success",
        description: `Successfully uploaded ${validTransactions.length} transactions.`
      });

      onSuccess();
      onClose();
      
    } catch (error) {
      console.error('Bulk upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload transactions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadTemplate = () => {
    const template = `transaction_type,metal_type,amount,price_per_oz,transaction_date,status,notes
buy,gold,1.0000,2450.00,2024-10-15 10:00:00,completed,Sample buy transaction
sell,silver,50.0000,32.50,2024-10-14 14:30:00,completed,Sample sell transaction
buy,platinum,0.5000,1050.00,2024-10-13 09:15:00,pending,Sample pending transaction`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedData.filter(row => row.isValid).length;
  const invalidCount = parsedData.length - validCount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Transaction Upload</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!showPreview && (
            <div className="space-y-4">
              <div>
                <Label>Upload CSV File</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Template
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload a CSV file with transaction data. Required columns: transaction_type, metal_type, amount, price_per_oz, transaction_date, status
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">CSV Format Requirements:</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>transaction_type:</strong> buy, sell, transfer, dividend</li>
                  <li>• <strong>metal_type:</strong> gold, silver, platinum</li>
                  <li>• <strong>amount:</strong> Positive number (ounces)</li>
                  <li>• <strong>price_per_oz:</strong> Positive number (dollars)</li>
                  <li>• <strong>transaction_date:</strong> YYYY-MM-DD or YYYY-MM-DD HH:mm:ss</li>
                  <li>• <strong>status:</strong> completed, pending, cancelled (optional, defaults to completed)</li>
                  <li>• <strong>notes:</strong> Optional text field</li>
                </ul>
              </div>
            </div>
          )}

          {showPreview && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">{validCount} valid transactions</span>
                  </div>
                  {invalidCount > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-600">{invalidCount} invalid transactions</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowPreview(false);
                    setFile(null);
                    setParsedData([]);
                  }}
                >
                  Upload Different File
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uploading transactions...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="max-h-96 overflow-y-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Metal</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Price/oz</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((row, index) => (
                      <TableRow key={index} className={!row.isValid ? "bg-red-50" : ""}>
                        <TableCell>
                          {row.isValid ? (
                            <Badge variant="default">Valid</Badge>
                          ) : (
                            <Badge variant="destructive">Invalid</Badge>
                          )}
                        </TableCell>
                        <TableCell className="capitalize">{row.transaction_type}</TableCell>
                        <TableCell className="capitalize">{row.metal_type}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell>${row.price_per_oz}</TableCell>
                        <TableCell>
                          {new Date(row.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {row.errors.length > 0 && (
                            <div className="text-sm text-red-600">
                              {row.errors.join('; ')}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose} disabled={isUploading}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleBulkUpload} 
                  disabled={validCount === 0 || isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {validCount} Transactions
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}