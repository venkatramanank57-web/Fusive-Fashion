// config/brands.js

export const BRANDS = {
  'laugury-prime': {
    name: 'Laugury Prime',
    bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    overlayColor: 'bg-black/40',
    primaryColor: 'border-black',
    hoverColor: 'hover:bg-black hover:text-white',
    textColor: 'text-black',
    // Add fallback color for background
    fallbackColor: 'bg-gray-900'
  },
  'barn-clothi': {
    name: 'Barn Clothi',
    bgImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
    overlayColor: 'bg-amber-900/50',
    primaryColor: 'border-amber-900',
    hoverColor: 'hover:bg-amber-900 hover:text-white',
    textColor: 'text-amber-900',
    fallbackColor: 'bg-amber-950'
  },
  // ... other brands with similar structure
};

// Collection to brand mapping with exact matches
export const COLLECTION_BRAND_MAP = {
  '/collections/clothing': 'laugury-prime',
  '/collections/denim': 'barn-clothi',
  '/collections/printed': 'wun-side',
  '/collections/solids': 'bage-ain',
  '/collections/bodycon': 'thi-sto'
};

// Path segments to brand mapping for better matching
export const PATH_BRAND_MAP = {
  'laugury': 'laugury-prime',
  'barn': 'barn-clothi',
  'wun': 'wun-side',
  'bage': 'bage-ain',
  'thi': 'thi-sto',
  'slect': 'slect'
};

// Helper function to get brand from URL
export const getBrandFromPath = (pathname) => {
  // Normalize pathname
  const path = pathname.toLowerCase().trim();
  
  // 1. Check exact collection matches
  for (const [collectionPath, brandKey] of Object.entries(COLLECTION_BRAND_MAP)) {
    if (path.startsWith(collectionPath)) {
      return BRANDS[brandKey] || BRANDS['laugury-prime'];
    }
  }
  
  // 2. Check for brand name in path segments
  const pathSegments = path.split('/').filter(segment => segment.length > 0);
  
  for (const segment of pathSegments) {
    for (const [brandKey, brandData] of Object.entries(BRANDS)) {
      // Check for brand key or name in segment
      const brandNameLower = brandData.name.toLowerCase();
      if (segment.includes(brandKey.replace('-', ' ')) || 
          segment.includes(brandNameLower) ||
          PATH_BRAND_MAP[segment]) {
        return brandData;
      }
    }
  }
  
  // 3. Default brand
  return BRANDS['laugury-prime'];
};

// Optional: Utility function for safe brand access
export const getBrand = (brandKey) => {
  return BRANDS[brandKey] || BRANDS['laugury-prime'];
};