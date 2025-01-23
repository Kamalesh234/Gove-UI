import { Injectable } from "@angular/core";
import { IUserAuth } from "../../core/interfaces/user-auth";
import { Mapper } from "../contracts";

/*
* Injectable of a mapper for user.
*/
@Injectable({
    providedIn: 'root'
})

/*
* Mapper to change the data of UserAuth.
*/
export class UserMapper implements Mapper<IUserAuth, IUserAuth> {
    map = (user: IUserAuth): IUserAuth =>
        Object.assign({
            ...user
        });
    mapArray = (users: IUserAuth[]): IUserAuth[] =>
        users.map(user => this.map(user));
}
