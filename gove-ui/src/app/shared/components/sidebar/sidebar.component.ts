import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../data/services/shared/user.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UtilsService } from '../../../../data/services/shared/utils.service';
import { EncryptionService } from '../../../../data/services/shared/encryption.service';
import { MenuItem } from '../../../../core/interfaces/commons';
import { LoaderService } from '../../../../data/services/shared/loader.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  public panelOpenState: boolean = false;
  public sideBarList: MenuItem[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private utilService: UtilsService,
    private encryptionService: EncryptionService,
    private loaderService:LoaderService
  ) {}

  ngOnInit(): void {
    this.getSideBarList();
  }

  getSideBarList() {
    this.loaderService.showLoader();
    if (localStorage.getItem('userDetails')) {
      const encryptedUserData = localStorage.getItem('userDetails');
      if (encryptedUserData) {
        const decryptedUserData =
          this.encryptionService.decrypt(encryptedUserData);
        let userDetail = decryptedUserData || '';
        let userId = userDetail?.userId;
        forkJoin([
          this.userService.getSideBarData(userId),
          this.userService.getSideBarMaster(),
        ]).subscribe((res) => {
          this.loaderService.hideLoader();
          const userMenus = res[0]?.message?.userMenus;
          const sideBarMasterList = res[1]?.NAV_ITEMS;
          for (let index = 0; index < userMenus.length; index++) {
            const sideBarList = userMenus[index].menus;
            const filteredSideBars = sideBarList.map((t1: any) => ({
              ...sideBarMasterList.find((t2: any) => t2.Program_Code === t1),
            }));
            let menuItem = {
              title: filteredSideBars[0].Module_Name,
              children:[]
            } as MenuItem;
            for (let i = 0; i < filteredSideBars.length; i++) {
              menuItem.children?.push({
                title: filteredSideBars[i].Program_Name,
                url: filteredSideBars[i].Program_Url,
                menuModule:filteredSideBars[0].Module_Name
              } as MenuItem);
            }
            this.sideBarList.push(menuItem);
          }
        });
      }
    }
  }

  goToMenuItemDetail(moduleName: any, menuUrl: any) {
    let menu = menuUrl.toLowerCase();
    let module = moduleName.toLowerCase().replace(' ','-');
    this.router.navigate(['/dashboard', module, menu]);
  }
}
