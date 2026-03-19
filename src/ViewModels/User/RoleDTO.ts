import type { UserRole } from '@/ViewModels/User/UserRole.ts';

export interface AddRoleToUserRequestDTO{
  RoleType:UserRole;
}
//Not Used
export interface AddRoleToUserResponseDTO{

}
//Not Used
export interface GetRoleFromUserRequestDTO{}

export interface GetRoleFromUserResponseDTO
{
  roleTypes:UserRole[];

}











