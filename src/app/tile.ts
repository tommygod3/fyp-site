import { GeoJson } from './geojson';

export class Tile {
    cloud_cover: number;
    datetime: Date;
    location: GeoJson;
    path: string;
    size: number;
}