
"use strict";

class MyLibrary {

    constructor() {}

    removeBeginningAndEndingSpace(s) {
        return s.trim();
    }

    hexStringToDecInt(s) {
        return parseInt(s);
    }

    fromStringToInt(s) {
        s = this.removeBeginningAndEndingSpace(s);
        if(s[0] == '#') {
            s = s.slice(1);
        }
        if(s.startsWith("0x") || s.startsWith("-0x")) {
            /* If string starts with 0x => Hexadecimal number */
            return this.hexStringToDecInt(s);
        } else {
            return parseInt(s);
        }
    }

    isValidNumber(s){
        s = this.removeBeginningAndEndingSpace(s);

        if(s.startsWith("#")){
            s = s.slice(1);
        }

        return isNaN(parseInt(s)) === false;
    }
}
