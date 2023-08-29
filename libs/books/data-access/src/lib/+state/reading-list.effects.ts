import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';

enum Action {
  ADD = "ADD",
  REMOVE = "REMOVE"
}


@Injectable()
export class ReadingListEffects implements OnInitEffects {
  
  config: MatSnackBarConfig = {
    panelClass: 'snack',
    duration: 10000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom'
  };

  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => {
            this._snackBar.openFromComponent(SnackbarComponent, {
              data: {message: 'Book added successfully!', action: Action.REMOVE, item: book},
              ...this.config
            });
            return ReadingListActions.confirmedAddToReadingList({ book })
          }),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() => {
            this._snackBar.openFromComponent(SnackbarComponent, {
              data: {message: 'Book removed successfully!', action: Action.ADD, item: item},
              ...this.config
            });
            return ReadingListActions.confirmedRemoveFromReadingList({ item })
          }
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient, private _snackBar: MatSnackBar) { }
}
