import { IHttpError } from "./IHttpError";

export class NotFoundError extends Error implements IHttpError {
    code = 404
    constructor(public message:string){
        super(message)
    }
    toJson(): { code: number; message: string } {
        return {
            code:this.code,
            message:`Error ${this.code}: ${this.message}`
        }
    }

}