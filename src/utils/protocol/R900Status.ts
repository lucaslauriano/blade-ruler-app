/* Generated from Java with JSweet 2.2.0-SNAPSHOT - http://www.jsweet.org */
export class R900Status {
    static InterfaceMode: number = 0;

    static Operation: number = 0;

    static Battery: number = 0;

    static mStop: boolean = false;

    static mStopped: boolean = true;

    static mMacVer: number[] = null;

    static mMacVer_Flag: boolean = false;

    static mConnect: boolean = false;

    public static mSingleTag: boolean = false;

    static mUseMask: boolean = false;

    static mTimeOut: number = 0;

    static mQuerySelected: boolean = false;

    public static getInterfaceMode(): number {
        return R900Status.InterfaceMode;
    }

    public static setInterfaceMode(mode: number) {
        if (mode > 0) R900Status.InterfaceMode = mode;
    }

    public static getOperationMode(): number {
        return R900Status.Operation;
    }

    public static setOperationMode(value: number) {
        if (value > 0) R900Status.Operation = value;
    }

    public static getBatteryLevel(): number {
        return R900Status.Battery;
    }

    public static setBatteryLevel(value: number) {
        if (value > 0) R900Status.Battery = value;
    }

    public static getStop(): boolean {
        return R900Status.mStop;
    }

    public static setStop(value: boolean) {
        R900Status.mStop = value;
    }

    public static getStopped(): boolean {
        return R900Status.mStopped;
    }

    public static setStopped(value: boolean) {
        R900Status.mStopped = value;
    }

    public static getMacVer(): number[] {
        return R900Status.mMacVer;
    }

    public static setMacVer(value: number[]) {
        if (value != null) R900Status.mMacVer = value;
    }

    public static getMacVerFlag(): boolean {
        return R900Status.mMacVer_Flag;
    }

    public static setMacVerFlag(value: boolean) {
        R900Status.mMacVer_Flag = value;
    }

    public static getConnect(): boolean {
        return R900Status.mConnect;
    }

    public static setConnect(value: boolean) {
        R900Status.mConnect = value;
    }

    public static getSingleTag(): boolean {
        return R900Status.mSingleTag;
    }

    public static setSingleTag(value: boolean) {
        R900Status.mSingleTag = value;
    }

    public static getUseMask(): boolean {
        return R900Status.mUseMask;
    }

    public static setUseMask(value: boolean) {
        R900Status.mUseMask = value;
    }

    public static getTimeOut(): number {
        return R900Status.mTimeOut;
    }

    public static setTimeOut(value: number) {
        R900Status.mTimeOut = value;
    }

    public static getQuerySelected(): boolean {
        return R900Status.mQuerySelected;
    }

    public static setQuerySelected(value: boolean) {
        R900Status.mQuerySelected = value;
    }
}

