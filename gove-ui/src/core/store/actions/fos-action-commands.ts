/**
 * Action commands
 *  */
import { IFOSActions } from "../../interfaces/store/IFOSActions";

/*
* Action commands for global state
* **/
export const FOSActionCommands: IFOSActions = {

   login : {
      userInfo : {
        type: '[Auth] Log In Successful'
      }
   },
  ccRequest:{
     myRequest:{
       setRequester:{
         type: '[My Request] Set Requester'
       },
       setStatus:{
         type: '[My Request] Set Status'
       },
       setSearchParams:{
         type: '[My Request] Set Search Params'
       },
       setSubmittedDate:{
         type: '[My Request] Set Submitted Date'
       },
       setRecords:{
         type: '[My Request] Set Records'
       },
       clear:{
         type: '[My Request] Clear'
       },
       setColumns:{
         type: '[My Request] Set Columns'
       },
       setPayload:{
         type: '[My Request] Set Payload'
       }
     },
    ccRequestInfo:{
       setBasicInfo:{
         type:'[CC Request] Set Basic Info'
       },
      setInterestedParties:{
         type:'[CC Request] Set Interested Parties'
      },
      setFscgAccounts:{
         type:'[CC Request] Set FSCG Accounts'
      },
      setQuestions:{
         type:'[CC Request] Set Questions'
      },
      setComment:{
         type:'[CC Request] Set Comments'
      }
    },
    ccRequestView:{
       setPrevConflictChecks:{
         type:'[CC Request View] Set Prev Conflicts Checks'
       },
      setSubsequentConflictChecks:{
         type:'[CC Request View] Set Subsequent Conflicts Checks'
      },
      setInterestedParty:{
         type:'[CC Request View] Set Interested Parties'
      }
    }
  },
  config: {
    myRequest: {
      tableSetting: {
        type: '[Config My Request] Set Table Settings'
      },
      searchSetting: {
        type: '[Config My Request] Set Search Settings'
      },
      tableDataSetting: {
        type: '[Config My Request] Set Table Data Settings'
      }
    },
    userSettings: {
      root: {
        type: '[Config User Settings] Set the User Settings'
      },
      myRequest: {
        tableSettings: {
          type: '[Config User My Request Table Settings] Set the My Request Table Settings'
        }
      }
    },
    request:{
      tabViewSetting: {
        type: '[Config My Request] Set Tab View Settings'
      }
    },
    interestedParty:{
      type:'[Request Interested Party] Set Interested Party Settings'
    }
  }
}
