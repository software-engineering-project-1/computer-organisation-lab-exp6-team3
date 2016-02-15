"use strict";

function MyLibrary() {

    this.removeBeginningAndEndingSpace = function(s) {
        /* Strip white spaces from the given string */
        return s.trim();
    }

    this.hexStringToDecInt = function(s) {
        /* Convert hex string to integer */
        return parseInt(s);
    }

    this.fromStringToInt = function(s) {
        /* Convert number represented as string to integer */
        // Remove empty white spaces
        s = this.removeBeginningAndEndingSpace(s);
        if(s[0] == '#') {
            // # is ignored if string contains # in the starting
            s = s.slice(1);
        }
        if(s.startsWith("0x") || s.startsWith("-0x")) {
            /* If string starts with 0x => Hexadecimal number */
            return this.hexStringToDecInt(s);
        } else {
            /* Number represented as string */
            return parseInt(s);
        }
    }

    this.isValidNumber = function(s){
        /* Function to check if a string can potentially be a number */
        s = this.removeBeginningAndEndingSpace(s);
        if(s.startsWith("#")){
            s = s.slice(1);
        }

        return isNaN(parseInt(s)) === false;
    }
}
