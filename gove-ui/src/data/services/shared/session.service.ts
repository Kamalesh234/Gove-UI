import { Injectable } from '@angular/core';
import { IUserAuth } from '../../../core/interfaces/user-auth';
import { USER_CONFIGS } from '../../constants/users';

@Injectable({
  providedIn: 'root',
})
/**
 * Service provider to deal with sessionStorage information.
 */
export class SessionService {
  /**
   * Get the user from the session storage
   *
   * @returns A UserAuth object containing the user information.
   */
  getUser(): IUserAuth {
    var user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Save user information on session storage.
   *
   * @param user User object containing the user data.
   */
  setUser(user: IUserAuth): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Remove the user from the session storage.
   */
  removeUser(): void {
    sessionStorage.removeItem('user');
  }

  /**
   * Get a user configurations and change its information.
   * TODO: Change it to other way in the future, like using IndexedDB for better maintainability.
   *
   * @param item Item of the user Configurations to check on the USER_CONFIGS
   */
  updateUserConf(item: string, data: any): void {
    const user = this.getUser();

    if (user && !user.config) user.config = {};

    if (user && user.config) {
      if (item === USER_CONFIGS.REQUESTS.TABLE_ORDER)
        user.config = {
          ...user.config,
          columns: data,
        };
    }

    if (user) this.setUser(user);
  }

  /**
   * Recover the user configuration based on the item.
   * TODO: Change it to other way in the future, like using IndexedDB for better maintainability.
   *
   * @param item Item of the user Configurations to check on the USER_CONFIGS
   *
   * @returns Any kind of data related to user Configurations
   */
  getUserConf(item: string): any {
    const user = this.getUser();
    if (user && user.config) {
      if (item === USER_CONFIGS.REQUESTS.TABLE_ORDER)
        return user.config.columns;
    }
    return null;
  }
}
