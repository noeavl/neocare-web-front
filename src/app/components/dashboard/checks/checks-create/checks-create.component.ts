import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { CheckService } from '../../../../services/check.service';
import { CardComponent } from '../../../shared/card/card.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { MatSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputComponent } from '../../../shared/input/input.component';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-checks-create',
  imports: [
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    MatSpinner,
    NgIf,
    SectionHeaderComponent,
    ToastModule,
    InputComponent
  ],
  templateUrl: './checks-create.component.html',
  styleUrls: ['./checks-create.component.css'],
  providers: [MessageService]
})
export class ChecksCreateComponent implements OnInit {
  incubatorData: any
  dataLoaded: boolean = false
  form = new FormGroup({
    nurse_id: new FormControl(''),
    baby_incubator_id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(5)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.minLength(5)]),
  })
  role: string = ''

  constructor(
    private checksService: CheckService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.incubatorData = history.state?.['incubator'];
    console.log('Incubator Data:', this.incubatorData);
  
    if (this.incubatorData) {
      this.dataLoaded = true;
      console.log('Nurse ID:', this.incubatorData.nurse_id);
      console.log('Baby Incubator ID:', this.incubatorData.baby_incubator_id); // This is the key field!
      console.log('Incubator ID:', this.incubatorData.id);
  
      this.form.patchValue({
        nurse_id: this.incubatorData.nurse_id.toString(),
        baby_incubator_id: this.incubatorData.baby_incubator_id.toString() // Use baby_incubator_id instead of id
      });
  
      console.log('Form Values:', this.form.value);
    } else {
      this.showAlert('error', 'Error', 'No incubator data provided');
    }
  }

  onSubmit() {
    this.checksService.create(this.form.value).subscribe(
      (response) => {
        console.log(response)
        this.dataLoaded = true
        this.showAlert('success', 'Success', response.msg)
        setTimeout(() => {
          this.form.reset()
        }, 3000)
      },
      (error) => {
        console.log(error)
        this.dataLoaded = true
        this.showAlert('error', 'Error', error.error.msg || 'No baby and nurse assigned')
      }
    )
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, key: 'br', life: 3000 })
  }
}