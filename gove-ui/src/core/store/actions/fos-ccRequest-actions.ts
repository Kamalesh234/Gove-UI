import {createAction, props} from "@ngrx/store";
import {FOSActionCommands} from "./fos-action-commands";
import {
  IFOSCommentHistory, IFOSConflictCheck, IFOSFscgAccount,
  IFOSInterestedPartyData, IFOSInterestedPartyPageView,
  IFOSQuestionAnswer, IFOSRequestBasicInfo
} from "../../interfaces/app/request/IFOSModels";

/**
 * Action for storing the basic info
 */
export const actionCcRequestSetBasicInfo = createAction(
  FOSActionCommands.ccRequest.ccRequestInfo.setBasicInfo.type,
  props<{basicInfo:IFOSRequestBasicInfo}>()
)

/**
 * Action for storing the interested parties
 */
export const actionCcRequestSetInterestedParties=createAction(
  FOSActionCommands.ccRequest.ccRequestInfo.setInterestedParties.type,
  props<{interestedParties:IFOSInterestedPartyData[]}>()
)


/**
 * Action for storing FSCG Accounts
 */
export const actionCcRequestSetFscgAccounts=createAction(
  FOSActionCommands.ccRequest.ccRequestInfo.setFscgAccounts.type,
  props<{fscgAccounts:IFOSFscgAccount[]}>()
)


/**
 * Action for storing the Questions and Answers
 */
export const actionCcRequestSetQuestionAnswers = createAction(
  FOSActionCommands.ccRequest.ccRequestInfo.setQuestions.type,
  props<{questionAns:IFOSQuestionAnswer[]}>()
)

/**
 * Action for storing Comments
 */
export const actionCcRequestSetComment=createAction(
  FOSActionCommands.ccRequest.ccRequestInfo.setComment.type,
  props<{comments:IFOSCommentHistory}>()
)


/**
 * Acton for storing the prev conflicts checks
 */
export const actionCcRequestViewSetPrevConflictChecks= createAction(
  FOSActionCommands.ccRequest.ccRequestView.setPrevConflictChecks.type,
  props<{prevConflictChecks:IFOSConflictCheck[]}>()
)

/**
 * Action for storing the subsequent conflict checks
 */
export const actionCcRequestViewSetSubsequentConflictChecks= createAction(
  FOSActionCommands.ccRequest.ccRequestView.setSubsequentConflictChecks.type,
  props<{subsequentConflictChecks:IFOSConflictCheck[]}>()
)

/**
 * Action for storing the interested parties
 */
export const actionCcRequestViewSetInterestedParties = createAction(
  FOSActionCommands.ccRequest.ccRequestView.setInterestedParty.type,
  props<{interestedParties:IFOSInterestedPartyPageView[]}>()
)
