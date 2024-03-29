import { IErrorHelper } from "./interfaces/IErrorHelper";

export class ErrorHelper implements IErrorHelper {
    getStackTrace(): Error {
        try {
            throw new Error(); 
        } catch (e : any) {
            return e;
        }
    }
}