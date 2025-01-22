import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../../../../data/services/shared/encryption.service';

/**
 * Component for Access Denied Component.
 */
@Component({
  selector: 'hl-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
})
export class AccessDeniedComponent implements OnInit {
  constructor(
    private router: Router,
    private encryptionService: EncryptionService
  ) {}
  public email: string = '';
  public loggedInUser: any = {};
  ngOnInit(): void {
    if (localStorage.getItem('userDetails')) {
      const encryptedUserData = localStorage.getItem('userDetails');
      if (encryptedUserData) {
        // Decrypt data
        const decryptedUserData =
          this.encryptionService.decrypt(encryptedUserData);
        this.loggedInUser = decryptedUserData || '';
        this.email = this.loggedInUser.userName;
      }
    }
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
