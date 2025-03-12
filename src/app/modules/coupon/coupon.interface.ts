export interface TCoupon {  
    plan: "BASIC" | "PREMIUM";
    couponName: string;
    code: string;
    activeFrom: Date;
    activeTo: Date;
    limitNumber: number;
    used: number;   
  }
  