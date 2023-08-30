import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { confirmedRemoveFromReadingList, getReadingList, removeFromReadingList } from '@tmo/books/data-access';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { take } from 'rxjs/operators';
enum Action {
  ADD = "ADD",
  REMOVE = "REMOVE"
}

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);
  
  config: MatSnackBarConfig = {
    panelClass: 'snack',
    duration: 2000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom'
  };


  constructor(private readonly store: Store, private _snackBar: MatSnackBar) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    this.store.select(confirmedRemoveFromReadingList).pipe(take(1)).subscribe(book => {
      
      book && this._snackBar.openFromComponent(SnackbarComponent, {
        data: {message: 'Book removed successfully!', action: Action.ADD, item: item},
        ...this.config
      });
    });
  }
}
