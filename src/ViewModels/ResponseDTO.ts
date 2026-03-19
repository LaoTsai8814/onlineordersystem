export interface ResponseDTO<T>
{
  isSuccess:boolean;
  errorMessage:string;
  data:T
}