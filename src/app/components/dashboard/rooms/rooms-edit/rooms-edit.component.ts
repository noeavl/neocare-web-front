import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/input/input.component';
import { CardComponent } from '../../../shared/card/card.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RoomsService } from '../../../../services/rooms.service';
import { SectionHeaderComponent } from '../../section-header/section-header.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-rooms-edit',
  imports: [
    CommonModule,
    InputComponent,
    CardComponent,
    ButtonComponent,
    ToastModule,
    SectionHeaderComponent,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './rooms-edit.component.html',
  styleUrl: './rooms-edit.component.css',
  providers: [MessageService]
})
export class RoomsEditComponent {
  id: number
  dataLoad = false
  fieldErrors: { [key: string]: string } = {};
  constructor(private roomsService: RoomsService, private messageService: MessageService, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
  }

  showAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, key: 'br', life: 3000 });
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    number: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
  })

  get name() {
    return this.form.get('name')
  }
  get number() {
    return this.form.get('number')
  }

  ngOnInit() {
    this.getRoom()
  }

  sumbit() {
    if (this.form.valid) {
      const formData = {
        name: this.form.controls['name'].value,
        number: this.form.controls['number'].value
      }

      this.roomsService.update(this.id, formData).subscribe({
        next: (response) => {
          this.showAlert('success', 'Success', response.message)
          this.fieldErrors = {};
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 0) {
              this.showAlert('error', 'Error', 'Fail to connect to the server');
            } else if (error.status === 404) {
              this.showAlert('error', 'Error', '404 Not found');
            } else if (error.status === 422) {
              this.handleError(error.error.errors);
              this.showAlert('warn', 'Error', 'Please check the form');
            } else if (error.status === 401) {
              this.showAlert('error', 'Error', error.error.message);
            } else {
              this.showAlert('error', 'Error', error.error.message);
            }
          }
        }
      })
    }
  }

  getRoom() {
    this.roomsService.show(this.id).subscribe({
      next: (response) => {
        this.form.controls['name'].setValue(response.room.name)
        this.form.controls['number'].setValue(response.room.number)
        this.dataLoad = true
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.showAlert('error', 'Error', 'Fail to connect to the server');
          } else if (error.status === 404) {
            this.showAlert('error', 'Error', '404 Not found');
          } else if (error.status === 401) {
            this.showAlert('error', 'Error', error.error.message);
          } else {
            this.showAlert('error', 'Error', error.error.message);
          }
        }
      }
    })
  }
  handleError(error: any) {
    this.fieldErrors = {};
    if (error) {
      for (const key in error) {
        if (error.hasOwnProperty(key)) {
          this.fieldErrors[key] = error[key];
        }
      }
    }
  }
}
