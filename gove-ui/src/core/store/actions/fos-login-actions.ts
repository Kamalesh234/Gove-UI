import { createAction, props } from "@ngrx/store";
import { IUserAuth } from "../../interfaces/user-auth";
import { FOSActionCommands } from "./fos-action-commands";

/*
* Create action for logging in to the system
* */
export const loginApiActions = createAction(
  FOSActionCommands.login.userInfo.type,
  props<{ user: IUserAuth }>()
);
