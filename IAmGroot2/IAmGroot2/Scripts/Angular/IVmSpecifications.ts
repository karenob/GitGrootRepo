﻿/// <amd-module name="Scripts/Angular/IVMSpecifications" />

export interface IVMSpecifications {
    result: boolean;
    stateMachines: IStateMachine[];
}

export interface IStateMachine {
    executionArn: string,
    requestorEmail: string,
    approverEmail: string,
    //VMspec: IVMSpec,
    VMspec: any,
    instanceID: string,
    machineName: string,
    startDate: string
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
