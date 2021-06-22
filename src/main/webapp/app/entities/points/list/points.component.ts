import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPoints } from '../points.model';
import { PointsService } from '../service/points.service';
import { PointsDeleteDialogComponent } from '../delete/points-delete-dialog.component';

@Component({
  selector: 'jhi-points',
  templateUrl: './points.component.html',
})
export class PointsComponent implements OnInit {
  points?: IPoints[];
  isLoading = false;

  constructor(protected pointsService: PointsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.pointsService.query().subscribe(
      (res: HttpResponse<IPoints[]>) => {
        this.isLoading = false;
        this.points = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPoints): number {
    return item.id!;
  }

  delete(points: IPoints): void {
    const modalRef = this.modalService.open(PointsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.points = points;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
