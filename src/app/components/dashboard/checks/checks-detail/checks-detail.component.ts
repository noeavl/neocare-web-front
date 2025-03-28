import { Component, OnInit } from '@angular/core';
import { CheckService } from '../../../../services/check.service';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from "../../../shared/card/card.component";
import { SectionHeaderComponent } from "../../section-header/section-header.component";

@Component({
  selector: 'app-checks-detail',
  imports: [CardComponent, SectionHeaderComponent],
  templateUrl: './checks-detail.component.html',
  styleUrl: './checks-detail.component.css'
})
export class ChecksDetailComponent implements OnInit {

  constructor(
    private checkService: CheckService,
    private route: ActivatedRoute
  ) { }

  check_id!: number
  title!: string
  description!: string
  nurse!: string
  baby!: string
  incubator!: number
  date!: string

  ngOnInit(): void {
    this.check_id = this.route.snapshot.params['id'];

    this.checkService.get(this.check_id).subscribe(
      (response) => {
        this.title = response.data.title
        this.description = response.data.description
        this.nurse = response.data.nurse
        this.baby = response.data.baby
        this.incubator = response.data.incubator
        this.date = response.data.created_at
      }, 
      (error) => {
        console.log(error)
      }
    )
  }
}
