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
        transformHeader: (header: string) => {
          // Clean up header names
          if (header.includes('Image')) return 'Image';
          if (header.includes('URL')) return 'URL';
          if (header.includes('Description')) return 'Description';
          if (header.includes('�')) return 'Price';
          return header;
        },
        complete: (results) => {
          const products = results.data.map((row: any, index: number) => {
            // Extract price number from string like "€ 2,134.34"
            const priceStr = row.Price || '0';
            const priceNumber = parseFloat(
              priceStr.replace(/[€,\s]/g, '').replace(/[^\d.]/g, '') || '0'
            );
            
            // Extract weight from description
            const description = row.Description || '';
            const weightMatch = description.match(/(\d+\s*(gram|ounce|oz))/i);
            const weight = weightMatch ? weightMatch[0] : '1 oz';
            
            // Extract mint from description
            const mintMatch = description.match(/(PAMP Suisse|Credit Suisse|Royal Canadian Mint|US Mint|Perth Mint)/i);
            const mint = mintMatch ? mintMatch[0] : 'Unknown Mint';
            
            return {
              id: `csv-gold-${index + 1}`,
              name: description,
              price: priceNumber * 1.1, // Convert EUR to USD roughly
              originalPrice: undefined,
              image: row.Image || "/api/placeholder/300/300",
              metal: "gold" as const,
              weight: weight,
              purity: description.toLowerCase().includes('999') ? '99.9% fine' : '24 karat',
              mint: mint,
              inStock: true,
              rating: 4.5 + Math.random() * 0.4, // Random rating between 4.5-4.9
              reviews: Math.floor(Math.random() * 500) + 100,
              description: description
            };
          });
          
          resolve(products);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
};