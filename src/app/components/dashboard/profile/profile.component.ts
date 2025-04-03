import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData: any;
  isLoading = true;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.profileData = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoading = false;
      }
    });
  }

  getFullName(): string {
    if (!this.profileData?.person) return '';
    return `${this.profileData.person.name} ${this.profileData.person.last_name_1} ${this.profileData.person.last_name_2 || ''}`.trim();
  }
}