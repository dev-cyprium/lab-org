import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Mikroorganizam } from '../../../core/models';
import { MikroorganizmiService } from '../../../core/services/mikroorganizmi.service';

@Component({
  selector: 'app-mikroorganizam-detail',
  templateUrl: './mikroorganizam-detail.component.html',
  styleUrl: './mikroorganizam-detail.component.scss',
})
export class MikroorganizamDetailComponent implements OnInit {
  mikroorganizam?: Mikroorganizam;
  ucitavanje = true;

  constructor(private route: ActivatedRoute, private servis: MikroorganizmiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.servis.ucitajJedan(id).subscribe((m) => {
      this.mikroorganizam = m;
      this.ucitavanje = false;
    });
  }
}
