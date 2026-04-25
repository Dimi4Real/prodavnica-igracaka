import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
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

  openFaq() {
 
    alert('FAQ: 1. Kako da naručim? -> Dodajte u korpu i rezervišite. 2. Dostava je 2-3 dana. 3. Plaćanje pouzećem ili karticom.');
    
}
}
