import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function BulkProductUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<any>(null);

  const handleBulkUpload = async () => {
    setIsUploading(true);
    setUploadResults(null);

    try {
      // Read the CSV file from the public directory
      const response = await fetch('/data/gold-products.csv');
      const csvData = await response.text();

      // Call the bulk upload function
      const { data, error } = await supabase.functions.invoke('bulk-upload-products', {
        body: { csvData }
      });

      if (error) throw error;

      setUploadResults(data);
      
      toast({
        title: "Upload Complete!",
        description: `Successfully uploaded ${data.summary.success} products to Stripe`,
      });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading products to Stripe",
        variant: "destructive",
      });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload Gold Products to Stripe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          This will upload all gold products from your CSV data to Stripe's product catalog.
          Each product will be created with pricing and metadata.
        </p>

        <Button 
          onClick={handleBulkUpload} 
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Uploading Products...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload All Products to Stripe
            </>
          )}
        </Button>

        {uploadResults && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {uploadResults.summary.success}
                  </div>
                  <div className="text-sm text-green-700">Successful</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {uploadResults.summary.errors}
                  </div>
                  <div className="text-sm text-red-700">Errors</div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">
                    {uploadResults.summary.skipped}
                  </div>
                  <div className="text-sm text-yellow-700">Skipped</div>
                </div>
              </div>

              {uploadResults.results.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {uploadResults.results.errors.map((error: any, index: number) => (
                      <div key={index} className="text-sm bg-red-50 p-2 rounded">
                        <span className="font-medium">{error.name}:</span> {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadResults.results.success.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-green-600 mb-2">
                    Successfully Created ({uploadResults.results.success.length}):
                  </h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {uploadResults.results.success.slice(0, 5).map((product: any, index: number) => (
                      <div key={index} className="text-sm bg-green-50 p-2 rounded">
                        {product.name} - ${(product.amount / 100).toFixed(2)}
                      </div>
                    ))}
                    {uploadResults.results.success.length > 5 && (
                      <div className="text-sm text-muted-foreground text-center">
                        ... and {uploadResults.results.success.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}