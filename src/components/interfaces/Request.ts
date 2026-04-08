interface Request{
    id:string,
    type:"PERMISSION" | "LEAVE",
    status:"SUBMITTED" |"CANCELLED01" | "ACCEPTED" | "REJECTED" | "CANCELLED02" |"ARRIVED"  ,
    submitted:{time:Date,name:string,rollNo:string} | null,
    cancelled01:{time:Date,name:string,rollNo:string} | null,
    accepted:{time:Date,name:string,eid:string} | null,
    rejected:{time:Date,name:string,eid:string} | null,
    cancelled02:{time:Date,name:string,rollNo:string} | null,
    // gateout:{time:Date,name:string,eid:string} | null,
    // gatein:{time:Date,name:string,eid:string} | null,
    arrived:{time:Date,name:string,eid:string} | null,
    name:string,
    rollNo:string,
    hostelId:"BH1"|"GH1",
    phoneNo:string,
    parentPhoneNo:string,
    reason:string,
    isActive:boolean
}

export interface Permission extends Request{
    date:Date,
    fromTime:Date,
    toTime:Date
}

export interface Leave extends Request{
    fromDate:Date,
    toDate:Date
}


export {}