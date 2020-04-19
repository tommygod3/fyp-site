import { GeoJson } from './geojson';

export class Tile {
    cloudCover: number;
    datetime: Date;
    location: GeoJson;
    path: string;
    size: number;
}