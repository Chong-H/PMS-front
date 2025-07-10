export class ResponseMessage<T> {
    code: number;
    message: string;
    sessionId?: string;
    data: T;
    pkeybob: string = "";

    constructor(code: number, message: string, data: T) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.pkeybob = "";
    }
}