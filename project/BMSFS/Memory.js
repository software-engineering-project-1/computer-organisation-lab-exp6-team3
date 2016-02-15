"use strict";

function Memory() {
    /* Function to maintain memory */

    var startAddressOfStack,
        currentStackAddress,        // stack is full uptill this point.
        startAddressOfDynamicData,
        currentDynamicDataAddress;  // dynamic data is filled to the memory address before this address .
                                    // is we have to allocate memory then we can allocate memory starting
                                    // from this address.

    var dynamicData = [];           // dynamic data grows upWard

    var localSymbolTable = {};      // contains level(variable) names and their start address ( string to integer ).

    startAddressOfStack = Register.getRegValue("$sp"); // it should be 0x7FFFFFFC
    currentStackAddress = startAddressOfStack;

    startAddressOfDynamicData = 0x10000000 ;
    currentDynamicDataAddress = startAddressOfDynamicData;

    var dynamicDataSize = 4*(startAddressOfStack - startAddressOfDynamicData + 1);

    for(var i=0; i < dynamicDataSize ; i++){
        dynamicData.push(0);
    }

    this.setBeginingAddressOfWord = function(VariableName) {
        if(currentDynamicDataAddress %4 !== 0) {
            currentDynamicDataAddress= (currentDynamicDataAddress/4 + 1 ) * 4 ;
        }
        localSymbolTable[VariableName] = currentDynamicDataAddress;
    }

    this.setBeginingAddressOfHalfWord = function(VariableName) {
        if(currentDynamicDataAddress %2 !== 0) {
            currentDynamicDataAddress= (currentDynamicDataAddress/2 +1 ) *2 ;
        }
        localSymbolTable[VariableName] = currentDynamicDataAddress;
    }

    this.setBeginingAddressOfByte = function(VariableName) {
        localSymbolTable[VariableName] = currentDynamicDataAddress;
    }


  /*********************  NEW IMPLEMENTATION **********************************
   * In this implementation , every element of array dynamicData contains a byte ,
   * and these bytes are stored in Little-Indian fashion .
   */

    this.addWordInDynamicMemory = function(value) {
        while(currentDynamicDataAddress %4 !== 0  && currentDynamicDataAddress < currentStackAddress) {
        // automatic alignment on word boundry
            dynamicData[currentDynamicDataAddress++] = 0;
        }
        if(currentDynamicDataAddress + 4 < currentStackAddress) {
            this.storeWord(currentDynamicDataAddress, value);
            currentDynamicDataAddress += 4;
        }
    }

    this.addHalfWordInDynamicMemory = function(value) {
        while(currentDynamicDataAddress %2 !== 0  && currentDynamicDataAddress < currentStackAddress) {
        // automatic alignment on word boundry
            dynamicData[currentDynamicDataAddress++] = 0;
        }
        if(currentDynamicDataAddress + 4 < currentStackAddress) {
            this.storeHalfWord(currentDynamicDataAddress, value);
            currentDynamicDataAddress += 2;
        }
    }

    this.addByteInDynamicMemory = function(value) {
        if(currentDynamicDataAddress  < currentStackAddress){
            this.storeByte(currentDynamicDataAddress, value);
            currentDynamicDataAddress += 1;
        }
    }

    this.readWord = function(addr, disp /*should be multiple of 4*/) {
        if(typeof(addr) == "number" && disp === undefined) {
            var ret = 0;
            if(addr >= startAddressOfDynamicData && addr < startAddressOfStack) {
                if(addr%4 === 0) {
                    var ind = addr - startAddressOfDynamicData;
                    for(var i=0;i < 4; i++) {
                        var singleByte = dynamicData[ind+i] & 0xFF;
                        ret= ret|(singleByte << (8*i));
                    }
                } else {
                    // addr is not aligned on word boundry
                }
            } else {
            // ERROR ( addr out of range -> seg fault )
            }
            return ret;
        } else if (typeof(addr) == "string" && disp === undefined) { // addr is as a variable name
            return readWord(addr, 0);
        } else if (typeof(addr) == "string" && typeof(disp) == "number") { // addr is as a variable name
            var startAddress = localSymbolTable[addr];
            var new_addr = startAddress + disp ;
            return readWord(new_addr);
        } else {
        // Invalid case
        }
    }

    this.readHalfWord = function(addr, disp /*should be multiple of 2*/) {
        if (typeof(addr) == "number" && disp === undefined) {
            var ret = 0;
            if(addr >= startAddressOfDynamicData && addr < startAddressOfStack) {
                if(addr%2 === 0) {
                    var ind = addr - startAddressOfDynamicData ;
                    for(var i = 0; i < 2;i++) {
                        var singleByte = dynamicData[ind+i] & 0xFF ;
                        ret = ret|(singleByte << (8*i)) ;
                    }
                } else {
                    // addr is not aligned on half word boundry
                }
            } else {
                // ERROR ( addr out of range -> seg fault )
            }

            return (ret << 16 >> 16 ) ; // returning HW as signed integer
        } else if (typeof(addr) == "string" && disp === undefined) { // addr is as a variable name
            return readHalfWord(addr,0);
        } else if (typeof(addr) == "string" && typeof(disp) == "number") { // addr is as a variable name
            var startAddress = localSymbolTable[addr];
            var new_addr = startAddress + disp ;
            return readHalfWord(new_addr);
        } else {
        // Invalid case
        }
    }

    this.readByte = function(addr, disp) {
        if(typeof(addr) == "number" && disp === undefined) {
            var ret = 0;
            if(addr >= startAddressOfDynamicData && addr < startAddressOfStack) {
                var ind = addr - startAddressOfDynamicData ;
                ret = dynamicData[ind] & 0xFF ;
            } else {
            // ERROR ( addr out of range -> seg fault )
            }
            return (ret << 24 >> 24) ; // returning signed Byte as integer
        } else if (typeof(addr) == "string" && disp === undefined) { // addr is as a variable name
            return readByte(addr, 0);
        } else if (typeof(addr) == "string" && typeof(disp) == "number") { // addr is as a variable name
            var startAddress = localSymbolTable[addr];
            var new_addr = startAddress + disp ;
            return readByte(new_addr);
        } else {
        // Invalid case
        }
    }

    this.storeWord = function(addr, value, disp /*should be multiple of 4*/) {
        if(typeof(addr) == "number" && disp === undefined) {
            if(addr >= startAddressOfDynamicData && addr < startAddressOfStack) {
                if(addr % 4 === 0) {
                    var ind = addr - startAddressOfDynamicData ;
                    for(var i=0;i < 4;i++) {
                       dynamicData[ind+i] = (value>>(8*i)) & 0xFF ;
                    }
                } else {
                // addr is not aligned on word boundry
                }
            } else {
            // ERROR ( addr out of range -> seg fault )
            }
        } else if (typeof(addr) == "string" && disp === undefined) {  // addr is as a variable name
            storeWord(addr, value, 0);
        } else if(typeof(addr) == "string" && typeof(disp) == "number") { // addr is as a variable name
            var startAddress = localSymbolTable[addr];
            var new_addr = startAddress + disp;
            storeWord(new_addr, value);
        } else {
        // Invalid case
        }
    }

    this.storeHalfWord = function(addr , value, disp /*should be a multiple of 2*/) {
        if(typeof(addr) == "number" && disp === undefined) {
            if(addr >= startAddressOfDynamicData && addr < startAddressOfStack) {
                if(addr % 2 === 0) {
                    var ind = addr - startAddressOfDynamicData ;
                    for(var i = 0; i < 2; i++) {
                        dynamicData[ind+i] = (value>>(8*i)) & 0xFF;
                    }
                } else {
                // addr is not aligned on Half word boundry
                }
            } else {
            // ERROR ( addr out of range -> seg fault )
            }
        } else if (typeof(addr) == "string" && disp === undefined) {   // addr is as a variable name
            storeHalfWord(addr, value, 0) ;
        } else if (typeof(addr) == "string" && typeof(disp) == "number") { // addr is as a variable name
            var startAddress = localSymbolTable[addr];
            var new_addr = startAddress + disp;
            storeHalfWord(new_addr, value);
        } else {
        // Invalid case
        }
    }

    this.storeByte = function(addr , value, disp) {
        if(typeof(addr) == "number" && disp === undefined) {
            if(addr >= startAddressOfDynamicData && addr < startAddressOfStack) {
                var ind = addr - startAddressOfDynamicData ;
                dynamicData[ind] = value & 0xFF;
            } else {
            // ERROR ( addr out of range -> seg fault )
            }
        } else if (typeof(addr) == "string" && disp === undefined) { // addr is as a variable name
            storeByte(addr, value, 0);
        } else if (typeof(addr) == "string" && typeof(disp) == "number") { // addr is as a variable name
            var startAddress = localSymbolTable[addr];
            var new_addr = startAddress + disp ;
            storeByte(new_addr,value);
        } else {
        // Invalid case
        }
    }
}
