import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromBooks from './+state/books.reducer';
import { BooksEffects } from './+state/books.effects';
import * as fromReadingList from './+state/reading-list.reducer';
import { ReadingListEffects } from './+state/reading-list.effects';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromBooks.BOOKS_FEATURE_KEY, fromBooks.reducer),
    StoreModule.forFeature(
      fromReadingList.READING_LIST_FEATURE_KEY,
      fromReadingList.reducer
    ),
    EffectsModule.forFeature([BooksEffects, ReadingListEffects])
  ],
  declarations: [SnackbarComponent]  
})
export class BooksDataAccessModule {}
