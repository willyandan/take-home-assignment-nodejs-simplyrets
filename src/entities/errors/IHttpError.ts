export interface IHttpError{
    code:number;
    message:string;
    toJson():{code:number, message:string}
}

export function isIHttpError(error:any): error is IHttpError {
    return error.code !== undefined && error.message !== undefined && error.toJson !== undefined
}