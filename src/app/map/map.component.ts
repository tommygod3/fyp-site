import { Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {

 }

 ngAfterViewInit(): void {
  const mapProperties = {
    center: new google.maps.LatLng(52.9119, -1.1848),
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
 }

  @ViewChild('map', {static: false}) mapElement: any;
  map: google.maps.Map;

}
