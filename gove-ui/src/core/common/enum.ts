export enum Statuses {
  allAutoStatuses = "17,18",
  allActiveStatuses = "1,2,3,4,5,6,10,11,12,17,18",
  legalReviewOrPendingLegalResolution = "5,11",
  underCAReview = "3",
}

/*
* Filter types
* **/
export enum FOSFilterTypes{
  Dropdown=1,
  MultiSelectDropdown,
  Text,
  Radio,
  CheckBox,
  MultiSelectCheckBox,
}

/*
* Table Actions
* **/
export enum FOSTableActions{
  Delete=1,
  ShowEmailDialog,
  ShowReportDialog,
  Email,
  Save
}

/**
 * Page Modes
 */
export enum FOSPageViewMode{
  Edit  ,
  Read
}
