
"use strict";
var Reg = [];
var Number_of_reg = 32;

class Register {
  
  constructor() {
    for(var i = 0; i < Number_of_reg; i++) {
      Reg.push(0);
    }
    this.initializePC();
    this.initializeSP();
  }

  initializeSP() {
    this.updateRegister("$sp", 0x10100000);
  }

  updateRegister(regNo , value) {
    if(typeof(regNo) == "string") {
      regNo = this.getRegisterNumberFromString(regNo);
    }

    if(regNo === 0){  // we can't change $0 , it's hardwired to produce 0
      return ;
    }
    if(regNo > 0 && regNo < Reg.length) {
      Reg[regNo] = value;
    }
  } 
  
  getRegValue(regNo) {
    if(typeof(regNo) == "string") {
      regNo = this.getRegisterNumberFromString(regNo);
    }

    if(regNo >= 0 && regNo < Reg.length) {
      return Reg[regNo];
    }
    return -1; // error (-1 can be valid return value also)
  }
  
  setRegValue(regNo , value) {
     if(regNo >= 0 && regNo < Reg.length){
       Reg[regNo] = value;
     }
  }
  
  getPC() {
     return Reg[34];
  }

  updatePcRelative(relativeShift) {
    Reg[34]+=relativeShift;
  }

  updatePcAbsolute(newPCAddress) {
    Reg[34]=newPCAddress;
  }

  initializePC(startAddr) {
    if(startAddr === undefined) {
      this.updatePcAbsolute(0x4000000);
    } else {
      this.updatePcAbsolute(startAddr);
    }
  }

  incrementPCToNextInstruction() {
    this.updatePcRelative(4);
  }

  getHI() {
    return Reg[32];
  }

  updateHI(newValue) {
    Reg[32] = newValue;
  }

  getLO() {
    return Reg[33];
  }

  updateLO(newValue) {
    Reg[33] = newValue;
  }
  
  getRegisterNumberFromString(str) {
    str = str.toLowerCase();
    if(str=="$0" || str=="$zero") {
      return 0;
    } else if(str=="$1" || str=="$at") {
      return 1;
    } else if(str=="$2" || str=="$v0") {
      return 2;
    } else if(str=="$3" || str=="$v1") {
      return 3;
    } else if(str=="$4" || str=="$a0") {
      return 4;
    } else if(str=="$5" || str=="$a1") {
      return 5;
    } else if(str=="$6" || str=="$a2") {
      return 6;
    } else if(str=="$7" || str=="$a3") {
      return 7;
    } else if(str=="$8" || str=="$t0") {
      return 8;
    } else if(str=="$9" || str=="$t1") {
      return 9;
    } else if(str=="$10" || str=="$t2") {
      return 10;
    } else if(str=="$11" || str=="$t3") {
      return 11;
    } else if(str=="$12" || str=="$t4") {
      return 12;  
    } else if(str=="$13" || str=="$t5") {
      return 13;
    } else if(str=="$14" || str=="$t6") {
      return 14;
    } else if(str=="$15" || str=="$t7") {
      return 15;
    } else if(str=="$16" || str=="$s0") {
      return 16;
    } else if(str=="$17" || str=="$s1") {  
      return 17;
    } else if(str=="$18" || str=="$s2") {
      return 18;
    } else if(str=="$19" || str=="$s3") {
      return 19;
    } else if(str=="$20" || str=="$s4") {
      return 20;
    } else if(str=="$21" || str=="$s5") {
      return 21;
    } else if(str=="$22" || str=="$s6") {
      return 22;
    } else if(str=="$23" || str=="$s7") {
      return 23;
    } else if(str=="$24" || str=="$t8") {
      return 24;
    } else if(str=="$25" || str=="$t9") {
      return 25;
    } else if(str=="$26" || str=="$k0") {
      return 26;
    } else if(str=="$27" || str=="$k1") {
      return 27;
    } else if(str=="$28" || str=="$gp") {
      return 28;
    } else if(str=="$29" || str=="$sp") {
      return 29;
    } else if(str=="$30" || str=="$fp") {
      return 30;
    } else if(str=="$31" || str=="$ra") {  
      return 31;
    } else if(str=="$hi") {
      return 32;
    } else if(str=="$lo") {
      return 33 ;
    }
    return -1; // error
  }
}
