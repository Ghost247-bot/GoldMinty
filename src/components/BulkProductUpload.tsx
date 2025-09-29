import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, CheckCircle, XCircle, Clock, Database, FileText, FolderOpen } from 'lucide-react';

export default function BulkProductUpload() {
  const [isUploadingStripe, setIsUploadingStripe] = useState(false);
  const [isUploadingDB, setIsUploadingDB] = useState(false);
  const [stripeResults, setStripeResults] = useState<any>(null);
  const [dbResults, setDbResults] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string>('gold-products.csv');
  const [uploadMode, setUploadMode] = useState<'predefined' | 'local'>('predefined');
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localFileContent, setLocalFileContent] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const csvFiles = [
    { value: 'gold-products.csv', label: 'Original Gold Products' },
    { value: 'gold-2.csv', label: 'New Gold Products (gold-2.csv)' },
    { value: 'gold-3.csv', label: 'Gold Products Set 3 (gold-3.csv)' },
    { value: 'gold-4.csv', label: 'Gold Products Set 4 (gold-4.csv)' },
    { value: 'silver.csv', label: 'Silver Products' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setLocalFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setLocalFileContent(content);
    };
    reader.readAsText(file);
  };

  const getCSVData = async (): Promise<string> => {
    if (uploadMode === 'local') {
      if (!localFileContent) {
        throw new Error('No local file content available');
      }
      return localFileContent;
    } else {
      // Read the selected predefined CSV file
      const response = await fetch(`/data/${selectedFile}`);
      return await response.text();
    }
  };

  const handleStripeUpload = async () => {
    setIsUploadingStripe(true);
    setStripeResults(null);

    try {
      const csvData = await getCSVData();

      // Call the bulk upload function
      const { data, error } = await supabase.functions.invoke('bulk-upload-products', {
        body: { csvData }
      });

      if (error) throw error;

      setStripeResults(data);
      
      toast({
        title: "Stripe Upload Complete!",
        description: `Successfully uploaded ${data.summary.success} products to Stripe`,
      });

    } catch (error) {
      toast({
        title: "Stripe Upload Failed",
        description: "There was an error uploading products to Stripe",
        variant: "destructive",
      });
      console.error('Stripe upload error:', error);
    } finally {
      setIsUploadingStripe(false);
    }
  };

  const handleDatabaseUpload = async () => {
    setIsUploadingDB(true);
    setDbResults(null);

    try {
      const csvData = await getCSVData();

      // Call the database import function
      const { data, error } = await supabase.functions.invoke('import-products-to-db', {
        body: { csvData }
      });

      if (error) throw error;

      setDbResults(data);
      
      toast({
        title: "Database Import Complete!",
        description: `Successfully imported ${data.summary.success} products to database`,
      });

    } catch (error) {
      toast({
        title: "Database Import Failed",
        description: "There was an error importing products to database",
        variant: "destructive",
      });
      console.error('Database import error:', error);
    } finally {
      setIsUploadingDB(false);
    }
  };

  const renderResults = (results: any, title: string) => {
    if (!results) return null;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {results.summary.success}
              </div>
              <div className="text-sm text-green-700">Successful</div>
            </div>
            
            <div className="p-3 bg-red-50 rounded-lg">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {results.summary.errors}
              </div>
              <div className="text-sm text-red-700">Errors</div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {results.summary.skipped}
              </div>
              <div className="text-sm text-yellow-700">Skipped</div>
            </div>
          </div>

          {results.results.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {results.results.errors.map((error: any, index: number) => (
                  <div key={index} className="text-sm bg-red-50 p-2 rounded">
                    <span className="font-medium">{error.name}:</span> {error.error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.results.success.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-green-600 mb-2">
                Successfully Created ({results.results.success.length}):
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {results.results.success.slice(0, 5).map((product: any, index: number) => (
                  <div key={index} className="text-sm bg-green-50 p-2 rounded">
                    {product.name} - ${(product.amount ? product.amount / 100 : product.price)?.toFixed(2)}
                  </div>
                ))}
                {results.results.success.length > 5 && (
                  <div className="text-sm text-muted-foreground text-center">
                    ... and {results.results.success.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload Gold Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Upload all gold products from your CSV data to either Stripe's product catalog or your Supabase database.
          </p>
          
          {/* Upload Mode Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Choose Upload Method:</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="uploadMode"
                    value="predefined"
                    checked={uploadMode === 'predefined'}
                    onChange={(e) => setUploadMode(e.target.value as 'predefined' | 'local')}
                    className="text-primary"
                  />
                  <FolderOpen className="h-4 w-4" />
                  <span className="text-sm">Use Predefined Files</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="uploadMode"
                    value="local"
                    checked={uploadMode === 'local'}
                    onChange={(e) => setUploadMode(e.target.value as 'predefined' | 'local')}
                    className="text-primary"
                  />
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Upload Local File</span>
                </label>
              </div>
            </div>

            {uploadMode === 'predefined' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select CSV File:</label>
                <Select value={selectedFile} onValueChange={setSelectedFile}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {csvFiles.map((file) => (
                      <SelectItem key={file.value} value={file.value}>
                        {file.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload CSV File:</label>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose CSV File
                  </Button>
                  {localFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{localFile.name}</span>
                      <span>({(localFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>
                {!localFile && (
                  <p className="text-xs text-muted-foreground">
                    Please select a CSV file to upload
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="database" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="database">Database Import</TabsTrigger>
            <TabsTrigger value="stripe">Stripe Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This will import all product data into your Supabase database for display and management.
                  </p>
                  <Button 
                    onClick={handleDatabaseUpload} 
                    disabled={isUploadingDB || (!localFile && uploadMode === 'local')}
                    className="w-full"
                  >
                    {isUploadingDB ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Importing to Database...
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-4 w-4" />
                        Import to Database
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            {renderResults(dbResults, "Database Import Results")}
          </TabsContent>
          
          <TabsContent value="stripe" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This will create products and prices in your Stripe account for payment processing.
                  </p>
                  <Button 
                    onClick={handleStripeUpload} 
                    disabled={isUploadingStripe || (!localFile && uploadMode === 'local')}
                    className="w-full"
                  >
                    {isUploadingStripe ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Uploading to Stripe...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload to Stripe
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            {renderResults(stripeResults, "Stripe Upload Results")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}