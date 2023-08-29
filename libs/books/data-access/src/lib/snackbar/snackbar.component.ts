import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { addToReadingList, removeFromReadingList } from '../+state/reading-list.actions';
import { Book, ReadingListItem } from '@tmo/shared/models';

enum Action {
    ADD = "ADD",
    REMOVE = "REMOVE"
}


@Component({
    selector: 'snackbar',
    templateUrl: 'snackbar.component.html',
    styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent {
    constructor(
        public snackBarRef: MatSnackBarRef<SnackbarComponent>,
        @Inject(MAT_SNACK_BAR_DATA) public data: any,
        private readonly store: Store,
    ) { }

    undoAction(action: string) {
        action === Action.ADD ? this.store.dispatch(addToReadingList({ book: this.data.item })) : this.store.dispatch(removeFromReadingList({ item: {...this.data.item, bookId: this.data.item.id}}));
    }
}
