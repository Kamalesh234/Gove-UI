import { IPrimeNgColumnsState } from './commons';

/**
 * Represents a UserAuth information
 */
export interface IUserAuth {
  userId: number;
  accessToken: string;
  loginName: string;
  fullName: string;
  isAuthenticated: boolean;
  sessionExpireDate:number
}

/**
 * Represents the information from JWT that comes from oicd user
 */
export interface IUserJWT {
  sub: number;
  email: string;
  preferred_username: string;
  name: string;
  updated_at: number;
  given_name: string;
  family_name: string;
  nonce: string;
  sid: string;
  s_hash: string;
  aud: string;
  exp: number;
  iat: number;
  iss: string;
}

/**
 * Represents the user configuration
 */
export interface IUserConfig {
  columns?: IPrimeNgColumnsState[];
}

/**
 * Represents the security profile
 */
export interface ISecurityProfile {
  permissions: string[];
  policy: IPolicy;
  role: IRole;
  pages: string[];
}

/**
 * Represents the policies from a security profile
 */
export interface IPolicy {
  lob?: ILobby[];
  office?: IOffice[];
}

/**
 * Represents the lobbies from a security profile
 */
export interface ILobby {
  id: string;
  value: string;
}

/**
 * Represents the offices from a security profile
 */
export interface IOffice {
  id: string;
  value: string;
}

/**
 * Represents the role from a security profile
 */
export interface IRole {
  staffId: number;
  LoginId: string;
  FullName: string;
  ApplicationId: string;
  ApplicationName: string;
  Active: boolean;
  Roles: IRoles[];
}

/**
 * Represents the roles from a IROLE interface.
 */
export interface IRoles {
  RoleId: string;
  RoleName: string;
  Delegated: boolean;
  DelegatorId: number;
  Policies: IRolePolicy[];
}

/**
 * Represents the Policies from a Role interface;
 */
export interface IRolePolicy {
  Id: number;
  Name: string;
  Value: string;
}