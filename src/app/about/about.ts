import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  imports: [
    MatCardModule,
    MatIcon
  ],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
   constructor(private dialog: MatDialog) {}

}
