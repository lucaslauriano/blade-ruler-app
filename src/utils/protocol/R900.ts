export class R900Protocol {
    public static NULL_1: number[]; public static NULL_1_$LI$(): number[] { if (R900Protocol.NULL_1 == null) R900Protocol.NULL_1 = [13, 10]; return R900Protocol.NULL_1; };

    public static NULL_2: number[]; public static NULL_2_$LI$(): number[] { if (R900Protocol.NULL_2 == null) R900Protocol.NULL_2 = [13]; return R900Protocol.NULL_2; };

    public static OPEN_INTERFACE_1: number[]; public static OPEN_INTERFACE_1_$LI$(): number[] { if (R900Protocol.OPEN_INTERFACE_1 == null) R900Protocol.OPEN_INTERFACE_1 = [13, 10, 13, 10, 13, 10, 13, 10]; return R900Protocol.OPEN_INTERFACE_1; };

    public static OPEN_INTERFACE_2: number[]; public static OPEN_INTERFACE_2_$LI$(): number[] { if (R900Protocol.OPEN_INTERFACE_2 == null) R900Protocol.OPEN_INTERFACE_2 = [13, 13, 13, 13, 13, 13, 13, 13]; return R900Protocol.OPEN_INTERFACE_2; };

    public static BYE: number[]; public static BYE_$LI$(): number[] { if (R900Protocol.BYE == null) R900Protocol.BYE = [('b').charCodeAt(0), ('y').charCodeAt(0), ('e').charCodeAt(0), 13, 10]; return R900Protocol.BYE; };

    public static SKIP_PARAM: number = -1;

    public static N_TYPE: number = 1;

    public static CMD_INVENT: string = "I";

    public static CMD_STOP: string = "s";

    public static CMD_GET_VERSION: string = "ver";

    public static CMD_SET_DEF_PARAM: string = "Default";

    public static CMD_INVENT_PARAM: string = "Iparam";

    public static CMD_GET_PARAM: string = "g";

    public static CMD_SEL_MASK: string = "M";

    public static CMD_SET_TX_POWER: string = "Txp";

    public static CMD_GET_MAX_POWER: string = "Maxp";

    public static CMD_SET_TX_CYCLE: string = "Txc";

    public static CMD_CHANGE_CH_STATE: string = "Chs";

    public static CMD_SET_COUNTRY: string = "Cc";

    public static CMD_GET_COUNTRY_CAP: string = "ccap";

    public static CMD_READ_TAG_MEM: string = "R";

    public static CMD_WRITE_TAG_MEM: string = "W";

    public static CMD_KILL_TAG: string = "Kill";

    public static CMD_LOCK_TAG_MEM: string = "Lock";

    public static CMD_SET_LOCK_TAG_MEM: string = "lockperm";

    public static CMD_PAUSE_TX: string = "Pause";

    public static CMD_HEART_BEAT: string = "Online";

    public static CMD_STATUS_REPORT: string = "alert";

    public static CMD_INVENT_REPORT_FORMAT: string = "Ireport";

    public static CMD_SYSTEM_TIME: string = "Time";

    public static CMD_DISLINK: string = "bye";

    public static CMD_UPLOAD_TAG_DATA: string = "Br.upl";

    public static CMD_CLEAR_TAG_DATA: string = "Br.clrlist";

    public static CMD_ALERT_READER_STATUS: string = "Br.alert";

    public static CMD_GET_STATUS_WORD: string = "Br.sta";

    public static CMD_SET_BUZZER_VOL: string = "Br.vol";

    public static CMD_BEEP: string = "Br.beep";

    public static CMD_SET_AUTO_POWER_OFF_DELAY: string = "Br.autooff";

    public static CMD_GET_BATT_LEVEL: string = "Br.batt";

    public static CMD_REPORT_BATT_STATE: string = "Br.reportbatt";

    public static CMD_TURN_READER_OFF: string = "Br.off";

    public static CMD_READER_PROPRIETARY: string = "Br.bt.config";

    public static tagErrorCodeToString(code: number): string {
        switch ((code)) {
            case 0:
                return "general error";
            case 3:
                return "specified memory location does not exist or the PC value is not supported by the tag";
            case 4:
                return "specified memory location is locked and/or permalocked and is not writeable";
            case 11:
                return "tag has insufficient power to perform the memory write";
            case 15:
                return "tag does not support error-specific codes";
        }
        return "Unknown error";
    }

    public static moduleErrorCodeToString(code: number): string {
        switch ((code)) {
            case 1:
                return "Read after write verify failed.";
            case 2:
                return "Problem transmitting tag command.";
            case 3:
                return "CRC error on tag response to a write.";
            case 4:
                return "CRC error on the read packet when verifying the write.";
            case 5:
                return "Maximum retry\'s on the write exceeded.";
            case 6:
                return "Failed waiting for read data from tag, possible timeout.";
            case 7:
                return "Failure requesting a new tag handle.";
            case 10:
                return "Error waiting for tag response, possible timeout.";
            case 11:
                return "CRC error on tag response to a kill.";
            case 12:
                return "Problem transmitting 2nd half of tag kill.";
            case 13:
                return "Tag responded with an invalid handle on first kill command.";
            case 15:
                return "Bad Access Password.";
        }
        return "Internal Use";
    }

    public static setType(type: number) {
        if (type === 1) R900Protocol.N_TYPE = 1; else R900Protocol.N_TYPE = 2;
    }

    public static getTypeSize(): number {
        if (R900Protocol.N_TYPE === 1) return 2;
        return 1;
    }

    public static getDelimeter(): string {
        if (R900Protocol.N_TYPE === 1) return "\r\n";
        return "\r";
    }

    public static getType(): number[] {
        if (R900Protocol.N_TYPE === 1) return R900Protocol.NULL_1_$LI$();
        return R900Protocol.NULL_2_$LI$();
    }

    public static makeProtocol$java_lang_String$int_A(cmd: string, param: number[]): number[] {

        let protocol: { str: string, toString: Function } = {
            str: "", toString: function () {
                return this.str;
            }
        };

            /* append */(sb => { sb.str = sb.str.concat(<any>cmd); return sb; })(protocol);

        if (param != null && param.length > 0) {
            for (let i: number = 0; i < param.length; ++i) {
                {
                    /* append */(sb => { sb.str = sb.str.concat(<any>','); return sb; })(protocol);
                    if (param[i] !== R900Protocol.SKIP_PARAM) /* append */(sb => { sb.str = sb.str.concat(<any>param[i]); return sb; })(protocol);
                };
            }
        }
        return R900Protocol.string2bytes(/* toString */protocol.str);
    }

    public static makeProtocol$java_lang_String(cmd: string): number[] {
        let protocol: { str: string, toString: Function } = { str: "", toString: function () { return this.str; } };
            /* append */(sb => { sb.str = sb.str.concat(<any>cmd); return sb; })(protocol);
        return R900Protocol.string2bytes(/* toString */protocol.str);
    }

    public static makeProtocol$java_lang_String$int_A$java_lang_String$java_lang_String(cmd: string, param: number[], param1: string, param2: string): number[] {
        let protocol: { str: string, toString: Function } = { str: "", toString: function () { return this.str; } };
            /* append */(sb => { sb.str = sb.str.concat(<any>cmd); return sb; })(protocol);
        if (param != null && param.length > 0) {
            for (let i: number = 0; i < param.length; ++i) {
                {
                    /* append */(sb => { sb.str = sb.str.concat(<any>','); return sb; })(protocol);
                    if (param[i] !== R900Protocol.SKIP_PARAM) /* append */(sb => { sb.str = sb.str.concat(<any>param[i]); return sb; })(protocol);
                };
            }
        }
            /* append */(sb => { sb.str = sb.str.concat(<any>","); return sb; })(protocol);
        if (param1 != null) /* append */(sb => { sb.str = sb.str.concat(<any>param1); return sb; })(protocol);
            /* append */(sb => { sb.str = sb.str.concat(<any>","); return sb; })(protocol);
        if (param1 != null) /* append */(sb => { sb.str = sb.str.concat(<any>param2); return sb; })(protocol);
        return R900Protocol.string2bytes(/* toString */protocol.str);
    }

    public static makeProtocol(cmd?: any, param?: any, param1?: any, param2?: any): any {
        if (((typeof cmd === 'string') || cmd === null) && ((param != null && param instanceof <any>Array && (param.length == 0 || param[0] == null || (typeof param[0] === 'number'))) || param === null) && ((typeof param1 === 'string') || param1 === null) && ((typeof param2 === 'string') || param2 === null)) {
            return <any>R900Protocol.makeProtocol$java_lang_String$int_A$java_lang_String$java_lang_String(cmd, param, param1, param2);
        } else if (((typeof cmd === 'string') || cmd === null) && ((param != null && param instanceof <any>Array && (param.length == 0 || param[0] == null || (typeof param[0] === 'number'))) || param === null) && ((param1 != null && param1 instanceof <any>Array && (param1.length == 0 || param1[0] == null || (typeof param1[0] === 'string'))) || param1 === null) && ((param2 != null && param2 instanceof <any>Array && (param2.length == 0 || param2[0] == null || (typeof param2[0] === 'number'))) || param2 === null)) {
            return <any>R900Protocol.makeProtocol$java_lang_String$int_A$java_lang_String_A$int_A(cmd, param, param1, param2);
        } else if (((typeof cmd === 'string') || cmd === null) && ((param != null && param instanceof <any>Array && (param.length == 0 || param[0] == null || (typeof param[0] === 'number'))) || param === null) && ((typeof param1 === 'string') || param1 === null) && ((param2 != null && param2 instanceof <any>Array && (param2.length == 0 || param2[0] == null || (typeof param2[0] === 'number'))) || param2 === null)) {
            return <any>R900Protocol.makeProtocol$java_lang_String$int_A$java_lang_String$int_A(cmd, param, param1, param2);
        } else if (((typeof cmd === 'string') || cmd === null) && ((typeof param === 'string') || param === null) && ((param1 != null && param1 instanceof <any>Array && (param1.length == 0 || param1[0] == null || (typeof param1[0] === 'number'))) || param1 === null) && param2 === undefined) {
            return <any>R900Protocol.makeProtocol$java_lang_String$java_lang_String$int_A(cmd, param, param1);
        } else if (((typeof cmd === 'string') || cmd === null) && ((param != null && param instanceof <any>Array && (param.length == 0 || param[0] == null || (typeof param[0] === 'number'))) || param === null) && param1 === undefined && param2 === undefined) {
            return <any>R900Protocol.makeProtocol$java_lang_String$int_A(cmd, param);
        } else if (((typeof cmd === 'string') || cmd === null) && ((param != null && param instanceof <any>Array && (param.length == 0 || param[0] == null || (typeof param[0] === 'string'))) || param === null) && param1 === undefined && param2 === undefined) {
            return <any>R900Protocol.makeProtocol$java_lang_String$java_lang_String_A(cmd, param);
        } else if (((typeof cmd === 'string') || cmd === null) && param === undefined && param1 === undefined && param2 === undefined) {
            return <any>R900Protocol.makeProtocol$java_lang_String(cmd);
        } else throw new Error('invalid overload');
    }

    public static makeProtocol$java_lang_String$java_lang_String_A(cmd: string, options: string[]): number[] {
        let protocol: { str: string, toString: Function } = { str: "", toString: function () { return this.str; } };
            /* append */(sb => { sb.str = sb.str.concat(<any>cmd); return sb; })(protocol);
        if (options != null && options.length > 0) {
            for (let i: number = 0; i < options.length; ++i) {
                {
                    /* append */(sb => { sb.str = sb.str.concat(<any>","); return sb; })(protocol);
                    if (options[i] != null) /* append */(sb => { sb.str = sb.str.concat(<any>options[i]); return sb; })(protocol);
                };
            }
        }
        return R900Protocol.string2bytes(/* toString */protocol.str);
    }

    public static makeProtocol$java_lang_String$int_A$java_lang_String_A$int_A(cmd: string, param: number[], options: string[], param2: number[]): number[] {
        let protocol: { str: string, toString: Function } = { str: "", toString: function () { return this.str; } };
            /* append */(sb => { sb.str = sb.str.concat(<any>cmd); return sb; })(protocol);
        if (param != null && param.length > 0) {
            for (let i: number = 0; i < param.length; ++i) {
                {
                    /* append */(sb => { sb.str = sb.str.concat(<any>','); return sb; })(protocol);
                    if (param[i] !== R900Protocol.SKIP_PARAM) /* append */(sb => { sb.str = sb.str.concat(<any>param[i]); return sb; })(protocol);
                };
            }
        }
        if (options != null) {
            for (let i: number = 0; i < options.length; ++i) {
                {
                    /* append */(sb => { sb.str = sb.str.concat(<any>","); return sb; })(protocol);
                    if (options[i] != null) /* append */(sb => { sb.str = sb.str.concat(<any>options[i]); return sb; })(protocol);
                };
            }
        }
        if (param2 != null && param2.length > 0) {
            for (let i: number = 0; i < param2.length; ++i) {
                {
                    /* append */(sb => { sb.str = sb.str.concat(<any>','); return sb; })(protocol);
                    if (param2[i] !== R900Protocol.SKIP_PARAM) /* append */(sb => { sb.str = sb.str.concat(<any>param2[i]); return sb; })(protocol);
                };
            }
        }
        return R900Protocol.string2bytes(/* toString */protocol.str);
    }

    public static makeProtocol$java_lang_String$int_A$java_lang_String$int_A(cmd: string, param: number[], option: string, param2: number[]): number[] {
        let protocol: { str: string, toString: Function } = { str: "", toString: function () { return this.str; } };
            /* append */(sb => { sb.str = sb.str.concat(<any>cmd); return sb; })(protocol);
        if (param != null && param.length > 0) {
            for (let i: number = 0; i < param.length; ++i) {
                {
                    /* append */(sb => { sb.str = sb.str.concat(<any>','); return sb; })(protocol);
                    if (param[i] !== R900Protocol.SKIP_PARAM) /* append */(sb => { sb.str = sb.str.concat(<any>param[i]); return sb; })(protocol);
                };
            }
        }
            /* append */(sb => { sb.str = sb.str.concat(<any>","); return sb; })(protocol);
        if (option != null) /* append */(sb => { sb.str = sb.str.concat(<any>option); return sb; })(protocol);
        if (param2 != null && param2.length > 0) {
            for (let i: number = 0; i < param2.length; ++i) {
                {
                    /* append */(sb => { sb.str = sb.str.concat(<any>','); return sb; })(protocol);
                    if (param2[i] !== R900Protocol.SKIP_PARAM) /* append */(sb => { sb.str = sb.str.concat(<any>param2[i]); return sb; })(protocol);
                };
            }
        }
        return R900Protocol.string2bytes(/* toString */protocol.str);
    }

    public static makeProtocol$java_lang_String$java_lang_String$int_A(cmd: string, option: string, param2: number[]): number[] {
        let protocol: { str: string, toString: Function } = { str: "", toString: function () { return this.str; } };
            /* append */(sb => { sb.str = sb.str.concat(<any>cmd); return sb; })(protocol);
            /* append */(sb => { sb.str = sb.str.concat(<any>","); return sb; })(protocol);
        if (option != null) /* append */(sb => { sb.str = sb.str.concat(<any>option); return sb; })(protocol);
        if (param2 != null && param2.length > 0) {
            for (let i: number = 0; i < param2.length; ++i) {
                {
                    /* append */(sb => { sb.str = sb.str.concat(<any>','); return sb; })(protocol);
                    if (param2[i] !== R900Protocol.SKIP_PARAM) /* append */(sb => { sb.str = sb.str.concat(<any>param2[i]); return sb; })(protocol);
                };
            }
        }
        return R900Protocol.string2bytes(/* toString */protocol.str);
    }

    public static string2bytes(str: string): number[] {
        let charProtocol: string[] = /* toCharArray */(str).split('');
        let byteProtocol: number[] = (s => { let a = []; while (s-- > 0) a.push(0); return a; })(charProtocol.length + R900Protocol.getTypeSize());
        let index: number = 0;
        for (let i: number = 0; i < charProtocol.length; ++i, ++index) { byteProtocol[index] = (<number>((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(charProtocol[i]) & 255) | 0); }
        for (let i: number = 0; i < R900Protocol.getTypeSize(); ++i, ++index) { byteProtocol[index] = R900Protocol.getType()[i]; }
        return byteProtocol;
    }
}

