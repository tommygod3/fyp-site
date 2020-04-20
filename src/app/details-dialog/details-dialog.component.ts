import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tile } from '../tile';
import { Patch } from '../patch';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.css']
})
export class DetailsDialogComponent implements OnInit {

  isTile: boolean = false;
  isPatch: boolean = false;

  constructor(public dialogRef: MatDialogRef<DetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit(): void {
    if (this.data.cloud_cover !== undefined) this.isTile = true;
    else this.isPatch = true;
  }

  showData(pathIn: string, typeIn: string) {
    this.dialogRef.close({path: pathIn, type: typeIn});
  }

  tileHasPatches(data: any): boolean {
    if (data.cloud_cover <= 15 && data.size >= 500) {
      return true;
    }
    else return false;
  }

  download(path: string) {
    window.location.href = `http://data.ceda.ac.uk${path}`;
  }

}
