import IFOSPageState from "../interfaces/store/IFOSPageState";
import IFOSStoreCcMyRequest from "../interfaces/store/IFOSStoreCcMyRequest";
import {IFOSMyRequestSearch} from "../interfaces/IFOSMyRequest";
import {
  IFOSViewRequestPage
} from "../interfaces/app/request/IFOSModels";

/*
* Functions to return the pages with initial values
* **/
export const getPages = (): IFOSPageState[] => {
  return [
    {
      key:'myRequest',
      value:{
          records:[[]],
          columns:[],
          status:[],
          searchParam:{
            searchKey:'',
            searchText:''
          },
        requester:[],
        submittedDate:{
            startDate:'',
            endDate:''
        },
        payload:{} as IFOSMyRequestSearch
      } as IFOSStoreCcMyRequest
    },{
      key:"viewRequest",
      value:{
        prevConflictCheck:[],
        subsequentConflictCheck:[],
        interestedParties:[]
      } as IFOSViewRequestPage
    }
  ];
}
