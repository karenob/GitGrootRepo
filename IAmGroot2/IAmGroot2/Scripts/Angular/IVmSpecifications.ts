/// <amd-module name="Scripts/Angular/IVMSpecifications" />

export interface IVMSpecifications {
    result: boolean;
    stateMachines: IStateMachine[];
}

export interface IStateMachine {
    //current
    executionArn: string,
    stateMachineArn: string,
    status: string,
    startDate: string, 
    name: string
    //future
    //executionArn: string,
    //startDate: string
    //requestorEmail: string,
    //approverEmail: string,
    ////VMspec: IVMSpec,
    //VMspec: any,
    //instanceID: string, //only for Amazon
    //machineName: string, // only for Azure
    
}

export interface IVMSpec {
    serverType: string,
    memoryCpu: string,
    purpose: string,
    compliance: string,
    environment: string,
    primaryDrive: string,
    secondaryDrive: string,
    serverOS: string
}
