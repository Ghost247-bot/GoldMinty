import Papa from 'papaparse';

export interface CSVProduct {
  Image: string;
  URL: string;
  Description: string;
  Price: string;
}

export const parseGoldProductsCSV = async (csvPath: string): Promise<any[]> => {
  try {
    const response = await fetch(csvPath);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('CSV Parse Results:', results);
          console.log('Headers:', results.meta.fields);
          
          const products = results.data.map((row: any, index: number) => {
            console.log('Processing row:', row);
            
            // Get the actual column names from the CSV
            const columns = Object.keys(row);
            const imageCol = columns.find(col => col.toLowerCase().includes('image')) || columns[0];
            const urlCol = columns.find(col => col.toLowerCase().includes('url')) || columns[1]; 
            const descCol = columns.find(col => col.toLowerCase().includes('description')) || columns[2];
            
            // Find price column - look for € symbol or price-like data
            const priceCol = columns.find(col => {
              const value = row[col];
              return value && (value.includes('€') || value.includes('$') || /^\d+[.,]\d+/.test(value));
            }) || columns[4]; // Default to 5th column based on CSV structure
            
            console.log('Price column:', priceCol, 'Value:', row[priceCol]);
            
            // Extract price number from string like "€ 2,134.34"
            const priceStr = row[priceCol] || '0';
            const priceNumber = parseFloat(
              priceStr.replace(/[€$,\s"]/g, '').replace(/[^\d.]/g, '') || '0'
            );
            
            console.log('Extracted price:', priceNumber);
            
            // Extract weight from description
            const description = row[descCol] || '';
            const weightMatch = description.match(/(\d+\s*(gram|ounce|oz))/i);
            const weight = weightMatch ? weightMatch[0] : '1 oz';
            
            // Extract mint from description
            const mintMatch = description.match(/(PAMP Suisse|Credit Suisse|Royal Canadian Mint|US Mint|Perth Mint|C\. Hafner|Argor-Heraeus|Heraeus)/i);
            const mint = mintMatch ? mintMatch[0] : 'Unknown Mint';
            
            const product = {
              id: `csv-gold-${index + 1}`,
              name: description,
              price: priceNumber * 1.1, // Convert EUR to USD roughly
              originalPrice: undefined,
              image: row[imageCol] || "/api/placeholder/300/300",
              metal: "gold" as const,
              weight: weight,
              purity: description.toLowerCase().includes('999') ? '99.9% fine' : '24 karat',
              mint: mint,
              inStock: true,
              rating: 4.5 + Math.random() * 0.4,
              reviews: Math.floor(Math.random() * 500) + 100,
              description: description
            };
            
            console.log('Created product:', product);
            return product;
          });
          
          console.log('Final products:', products);
          resolve(products);
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
};