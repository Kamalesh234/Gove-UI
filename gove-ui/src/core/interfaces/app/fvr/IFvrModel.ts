export interface IFvrDetail {
  fvrProspectDetail?: IFvrLeadProspectDetail;
  fvrHirerDetail?: IFVrHirer;
  fvrNeighbourHood?: IFvrNeighbourHood;
  fvrDocuments?: IFvrDocument[];
}

export interface IFvrLeadProspectDetail {
  leadId?: number;
  prospectId?: number;
  leadNumber?: string;
  leadDate?: Date;
  prospectName?: string;
  leadType?: number;
  leadTypeName?: string;
  prospectAddress?: string;
  mobileNumber?: string;
  vehicleNumber?: string;
  locationId?: number;
  locationName?: string;
  assetDescription?: string;
}

export interface IFVrHirer {
  prospectId?: number;
  fieldVerificationId?: number;
  visitedBy?: string;
  dateVisited?: Date;
  timeStamp?: string;
  personType?: number;
  houseAccessibility?: number;
  localityId?: number;
  localityName?: string;
  houseType?: number;
  flooringType?: number;
  roofingType?: number;
  livingType?: number;
  entryPermittedType?: number;
  houseArea?: string;
  landMark?: string;
  recommendation?: number;
  earlyVisitedType?: number;
  politicalAffiliation?: number;
  remarks?: string;
  houseImagePath?: string;
  furnitures?: string[];
  verifierId:string;
  verifierName:string;
}

export interface IFvrNeighbourHood {
  prospectId?: number;
  leadid?: number;
  fieldVerificationId?: number;
  visitedBy?: string;
  dateVisited?: Date;
  personType?: number;
  hirerStayType?: number;
  houseStatusType?: number;
  residenceId?: number;
  noOfYears?: number;
  neighbourName?: string;
  neighbourHoodAddress?: string;
  mobileNumber?: string;
  comments?: string;
}

export interface IFvrAssetDetail {
  fieldVerificationId?: number;
  prospectName?:string;
  taxType?: number;
  taxExpiryDate?: Date;
  permitStatus?: number;
  permitType?: number;
  permitExpiryDate?: Date;
  insuranceExpiryDate?: Date;
  fieldExecutiveComment?: string;
  registrationDate?: Date;
  inspectedValueAmount?: number;
  frontTyreStatus?: number;
  rearTyreStatus?: number;
  frontTyreStatusDescription?: string;
  rearTyreStatusDescription?: string;
  vehicleColour?: string;
  vehicleCondition?: number;
  vehicleConditionDescription?: string;
  vehicleInspectionDate?: Date;
  vehicleBody?: number;
  vehicleBodyDescription?: string;
  vehicleBodySize?: string;
  vehicleOwnerName?: string;
  vehicleEngineCondition?: string;
  visitDate?: Date;
  duplicateKey?: number;
  assetDocuments?: string[];
  verifierCode:string;
  verifierName?: string;
  verifierId?: number;
  verificationPlace?: string;
  vehicleRegistrationNumber:string;
}

export interface IFvrDocument {
  fieldVerificationId: number;
  documentTypeId?: number;
  documentDescription?: string;
  documentPath?: string;
}

export interface IFvrAsset{
  fvrAssetDetail:IFvrAssetDetail;
  fvrDocuments:IFvrDocument[];
}
