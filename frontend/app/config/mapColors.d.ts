export interface MapColorConfig {
  fillColor: string;
  fillOpacity: number;
  weight: number;
  opacity: number;
  color: string;
  dashArray: string;
}

export interface MapColors {
  default: MapColorConfig;
  hover: Omit<MapColorConfig, 'opacity' | 'color' | 'dashArray'>;
  visited: MapColorConfig;
  visitedHover: Omit<MapColorConfig, 'opacity' | 'color' | 'dashArray'>;
  wishlist: MapColorConfig;
  wishlistHover: Omit<MapColorConfig, 'opacity' | 'color' | 'dashArray'>;
}

declare const mapColors: MapColors;
export default mapColors;
