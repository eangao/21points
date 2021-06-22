import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBloodPressure } from '../blood-pressure.model';
import { BloodPressureService } from '../service/blood-pressure.service';
import { BloodPressureDeleteDialogComponent } from '../delete/blood-pressure-delete-dialog.component';

@Component({
  selector: 'jhi-blood-pressure',
  templateUrl: './blood-pressure.component.html',
})
export class BloodPressureComponent implements OnInit {
  bloodPressures?: IBloodPressure[];
  isLoading = false;

  constructor(protected bloodPressureService: BloodPressureService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.bloodPressureService.query().subscribe(
      (res: HttpResponse<IBloodPressure[]>) => {
        this.isLoading = false;
        this.bloodPressures = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBloodPressure): number {
    return item.id!;
  }

  delete(bloodPressure: IBloodPressure): void {
    const modalRef = this.modalService.open(BloodPressureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bloodPressure = bloodPressure;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
