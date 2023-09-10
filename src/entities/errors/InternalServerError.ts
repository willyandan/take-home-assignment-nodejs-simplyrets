import { IHttpError } from "./IHttpError";

export class InternalServerError extends Error implements IHttpError {
    code = 500
    message="Internal server error";
    toJson(): { code: number; message: string } {
        return {
            code:this.code,
            message:`Error ${this.code}: ${this.message}`
        }
    }

}