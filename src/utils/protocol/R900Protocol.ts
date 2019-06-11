export class R900Protocol {

	public static _NULL_1: Uint8Array = new Uint8Array([0x0d, 0x0a]);
	public static $_NULL_1(): number[] { if (this.NULL_1 == null) this.NULL_1 = [13, 10]; return this.NULL_1; };

	public static _NULL_2: Uint8Array = new Uint8Array([0x0d]);
	public static $_NULL_2(): number[] { if (this.NULL_2 == null) this.NULL_2 = [13]; return this.NULL_2; };

	public static NULL_1: number[];

	public static NULL_2: number[];

	public static OPEN_INTERFACE_1: number[]; public static OPEN_INTERFACE_1_$LI$(): number[] { if (this.OPEN_INTERFACE_1 == null) this.OPEN_INTERFACE_1 = [13, 10, 13, 10, 13, 10, 13, 10]; return this.OPEN_INTERFACE_1; };

	public static OPEN_INTERFACE_2: number[]; public static OPEN_INTERFACE_2_$LI$(): number[] { if (this.OPEN_INTERFACE_2 == null) this.OPEN_INTERFACE_2 = [13, 13, 13, 13, 13, 13, 13, 13]; return this.OPEN_INTERFACE_2; };

	public static BYE: number[]; public static BYE_$LI$(): number[] { if (this.BYE == null) this.BYE = [('b').charCodeAt(0), ('y').charCodeAt(0), ('e').charCodeAt(0), 13, 10]; return this.BYE; };

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

	public static tagErrorCodeToString(code: number): String {
		switch (code) {
			case 0x00:
				return "general error";
			case 0x03:
				return "specified memory location does not exist or the PC value is not supported by the tag";
			case 0x04:
				return "specified memory location is locked and/or permalocked and is not writeable";
			case 0x0B:
				return "tag has insufficient power to perform the memory write";
			case 0x0F:
				return "tag does not support error-specific codes";
		}
		return "Unknown error";
	}

	public static moduleErrorCodeToString(code: number): String {
		switch (code) {
			case 0x01:
				return "Read after write verify failed.";
			case 0x02:
				return "Problem transmitting tag command.";
			case 0x03:
				return "CRC error on tag response to a write.";
			case 0x04:
				return "CRC error on the read packet when verifying the write.";
			case 0x05:
				return "Maximum retry's on the write exceeded.";
			case 0x06:
				return "Failed waiting for read data from tag, possible timeout.";
			case 0x07:
				return "Failure requesting a new tag handle.";
			case 0x0A:
				return "Error waiting for tag response, possible timeout.";
			case 0x0B:
				return "CRC error on tag response to a kill.";
			case 0x0C:
				return "Problem transmitting 2nd half of tag kill.";
			case 0x0D:
				return "Tag responded with an invalid handle on first kill command.";
			case 0x0F:
				return "Bad Access Password.";
		}
		return "Internal Use";
	}

	public static setType(type: number) {
		if (type == 1)
			this.N_TYPE = 1;
		else
			this.N_TYPE = 2;
	}

	public static getTypeSize() {
		if (this.N_TYPE == 1)
			return 2;
		return 1;
	}

	public static getDelimeter() {
		if (this.N_TYPE == 1)
			return "\r\n";
		return "\r";
	}

	public static getType() {
		if (this.N_TYPE == 1)
			return this.NULL_1;
		return this.NULL_2;
	}

	public static makeProtocol(cmd: string, option: string, param2: number[]): number[] {
        console.log('cmd', cmd)
        console.log('option', option)
        console.log('param2',param2)

        let protocol: {
			str: string,
			toString: Function
		} = {
			str: "", toString: function () { return this.str; }
		};
        (sb => { sb.str = sb.str.concat(<any>cmd); return sb; })(protocol);
        (sb => { sb.str = sb.str.concat(<any>","); return sb; })(protocol);
		
		if (option != null) (sb => { sb.str = sb.str.concat(<any>option); return sb; })(protocol);
		if (param2 != null && param2.length > 0) {
			for (let i: number = 0; i < param2.length; ++i) {
				{
                (sb => { sb.str = sb.str.concat(<any>','); return sb; })(protocol);
					if (param2[i] !== this.SKIP_PARAM) (sb => { sb.str = sb.str.concat(<any>param2[i]); return sb; })(protocol);
				};
			}
		}
		return this.string2bytes(protocol.str);
	}

	public static string2bytes(str: string): number[] {
        console.log('str',str)
		let charProtocol: string[] = (str).split('');
        console.log('charProtocol',charProtocol)
		let byteProtocol: number[] = (s => { let a = []; while (s-- > 0) a.push(0); return a; })(charProtocol.length + this.getTypeSize());
        console.log('dbyteProtocol', byteProtocol)
		let index: number = 0;
		for (let i: number = 0; i < charProtocol.length; ++i, ++index) { byteProtocol[index] = (<number>((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(charProtocol[i]) & 255) | 0); }
		for (let i: number = 0; i < this.getTypeSize(); ++i, ++index) { byteProtocol[index] = this.getType()[i]; }
        console.log('byteProtocol', byteProtocol)
		return byteProtocol;
	}

}