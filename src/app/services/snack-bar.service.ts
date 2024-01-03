import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) {
  }

  open(message: string, mSeconds?: number) {
    this.snackBar.open(message, 'Close', {duration: mSeconds ? mSeconds : 3000});
  }

}
