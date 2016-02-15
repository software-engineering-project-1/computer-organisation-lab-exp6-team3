
"use strict";
var NO_ERROR = 0,
    ASSEMBLE_TIME_ERROR = 1,
    RUN_TIME_ERROR = 2,
    RUN_TIME_WARNING = 3;
class Error {
            
    constructor(msg, type) {

        if(typeof(msg) === 'undefined') msg = '';
        if(typeof(type) === 'undefined') type = NO_ERROR;
        
        this.errorMsg = msg;
        this.errorType = type;
        
    }

    isOk() {
        return (this.errorType == NO_ERROR || this.errorType == RUN_TIME_WARNING);
    }

    isWarning() {
        return (this.errorType == RUN_TIME_WARNING);
    }

    printErrorMsg() {
        console.log(this.errorMsg);
    }

    getErrorMsg() {
        return this.errorMsg;
    }

    getErrorType() {
        return this.errorType ;
    }

    getErrorTypeString() {
        var errorType = this.errorType;
        if (errorType == NO_ERROR) {
            return "NO_ERROR";
        } else if(errorType == ASSEMBLE_TIME_ERROR) {
            return "ASSEMBLE_TIME_ERROR";
        } else if(errorType == RUN_TIME_ERROR) {
            return "RUN_TIME_ERROR";
        } else if(errorType == RUN_TIME_WARNING) {
            return "RUN_TIME_WARNING";
        } else {
            return "";
        }
    }
}
