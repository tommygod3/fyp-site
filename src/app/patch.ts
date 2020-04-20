import { GeoJson } from './geojson';

export class Patch {
    datetime: Date;
    location: GeoJson;
    path: string;
    labels: string[];
}