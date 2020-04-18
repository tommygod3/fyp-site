import { ThrowStmt } from '@angular/compiler';

export class GeoJson {
    type: string;
    orientation?: string;
    coordinates: [
        [[number, number]]
    ];

    constructor(bounds: google.maps.LatLngBounds) {
        this.type = "Polygon";
        this.orientation = "counterclockwise";
        let nw: [number, number] = [bounds.getSouthWest().lng(), bounds.getNorthEast().lat()];
        let ne: [number, number] = [bounds.getNorthEast().lng(), bounds.getNorthEast().lat()];
        let se: [number, number] = [bounds.getNorthEast().lng(), bounds.getSouthWest().lat()];
        let sw: [number, number] = [bounds.getSouthWest().lng(), bounds.getSouthWest().lat()];
        this.coordinates = [[nw]]
        this.coordinates[0].push(sw);
        this.coordinates[0].push(se);
        this.coordinates[0].push(ne);
        this.coordinates[0].push(nw);
    }
}