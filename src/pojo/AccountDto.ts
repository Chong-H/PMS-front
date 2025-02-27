export class AccountDto {
    
    id: number | null;
    web:string | null;
    acc: string | null;
    pin: string | null;
    description: string | null; // 假设前端使用字符串表示日期
    classify: string | null;
    
    constructor(
        id: number | null = null,
        web: string | null = null,
        acc: string | null = null,
        pin: string | null = null,
        description: string | null = null,
        classify: string | null = null,
    ) {
        this.id = id;
        this.web = web;
        this.acc = acc;
        this.pin = pin;
        this.description = description;
        this.classify = classify;
    }
}