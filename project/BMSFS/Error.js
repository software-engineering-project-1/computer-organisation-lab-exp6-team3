"use strict";


function Error(msg, type) {
    /* Error status codes
     * @param msg: Error message
     * @param type: Error type
     */

    var NO_ERROR = 0,
        ASSEMBLE_TIME_ERROR = 1,
        RUN_TIME_ERROR = 2,
        RUN_TIME_WARNING = 3;

    // Handle default arguments
    if(typeof(msg) === 'undefined') msg = '';
    if(typeof(type) === 'undefined') type = NO_ERROR;

    // Private variables
    var errorMsg=msg, errorType=type;

    this.isOk = function() {
        /* Check for no errors */
        return (errorType == NO_ERROR || errorType == RUN_TIME_WARNING);
    }

    this.isWarning = function() {
        /* Check for warnings */
        return (errorType == RUN_TIME_WARNING);
    }

    this.printErrorMsg = function() {
        /* Print error message on console */
        console.log(errorMsg);
    }

    this.getErrorMsg = function() {
        /* Return the error message */
        return errorMsg;
    }

    this.getErrorType = function() {
        /* Return error type */
        return errorType;
    }

    this.getErrorTypeString = function() {
        /* Return the error type as string */
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
