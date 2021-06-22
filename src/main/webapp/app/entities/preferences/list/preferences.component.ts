import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPreferences } from '../preferences.model';
import { PreferencesService } from '../service/preferences.service';
import { PreferencesDeleteDialogComponent } from '../delete/preferences-delete-dialog.component';

@Component({
  selector: 'jhi-preferences',
  templateUrl: './preferences.component.html',
})
export class PreferencesComponent implements OnInit {
  preferences?: IPreferences[];
  isLoading = false;

  constructor(protected preferencesService: PreferencesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.preferencesService.query().subscribe(
      (res: HttpResponse<IPreferences[]>) => {
        this.isLoading = false;
        this.preferences = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPreferences): number {
    return item.id!;
  }

  delete(preferences: IPreferences): void {
    const modalRef = this.modalService.open(PreferencesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.preferences = preferences;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
