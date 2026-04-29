import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Podloga } from '../../../core/models';
import { PodlogeService } from '../../../core/services/podloge.service';

@Component({
  selector: 'app-podloga-detail',
  templateUrl: './podloga-detail.component.html',
  styleUrl: './podloga-detail.component.scss',
})
export class PodlogaDetailComponent implements OnInit {
  podloga?: Podloga;
  ucitavanje = true;

  constructor(private route: ActivatedRoute, private servis: PodlogeService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.servis.ucitajJedan(id).subscribe((p) => {
      this.podloga = p;
      this.ucitavanje = false;
    });
  }
}
