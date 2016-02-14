"""
@Author : Mohit Jain
@Email  : develop13mohit@gmail.com
"""


// TODO : Handle the imports
// package mipsparser_new;
// import java.io.BufferedReader;
// import java.io.IOException;
// import java.io.InputStreamReader;
// import mipsparser_new.BMSFS.*;
// import mipsparser_new.BMSFS.Error;
// import java.io.FileReader;
// import java.util.*;


class MIPSProgram {
	var filename;
	var sourceList = [];
	var commentRemovedSource = [];
	var sourceOfDataSection = []; 
	var sourceOfTextSection = [];
	var DataSectionLineNo = [];      // For Generating Error msg
	var TextSectionLineNo = [];      // For Generating Error msg
	var Reg = new Register();
	var Mem = new Memory();
	var AllInstructions = []; 
	var CodeSection = [];
	var assembleTimeError = new Error();

	function MIPSProgram(source) {
		var CodeSection = [];
		var assembleTimeError = new Error();
		var AllInstructions = [];
		var Reg = new Register();
		var Mem = new Memory();
		
		readSource(source);
		removeComment();
		
		splitDataAndTextSection();

		var err = new Error()
		err = processDataSection();
		if (!err.isOk()){
			err.printErrorMsg();
			assembleTimeError = err ;
			return ;
		}
                
		err = processTextSection();

		if (!err.isOk()){
			err.printErrorMsg();
			assembleTimeError = err ;
			return ; 
		}
	}

    function getAssembleTimeError() {
        return assembleTimeError ; 
    }

	function getsourceOfTextSection() {
            var sourceLinesToDisplay = [];

            for(i=0; i<AllInstructions.length; i++) {
                sourceLinesToDisplay.push(AllInstructions[i].getSourceString());
            }

            return sourceLinesToDisplay ;
        }

	function runCurrentInstruction() {
		var err = new Error();
        var currentPC = Reg.getPC();
		var startPC = Instruction.startAddressOfInst;
		var index = (currentPC-startPC)/4;
		
		if (index < AllInstructions.length) {
			var instr = new Instruction();
			instr = AllInstructions[index];
			err  = instr.runSingleInstruction();
		}
		return err;
	}

	function RunAllInstructions() { 
		
		var PClimit = Register.getPC()+AllInstructions.length*4;		
		var startPC = Instruction.startAddressOfInst;	
		var currentPC;
		
		while(true){
			currentPC = Reg.getPC();

			if (currentPC < PClimit) {
				var index = (currentPC-startPC)/4;
				var instr = new Instruction();
				Instruction instr = AllInstructions[index];
				var err = new Error();
				err = instr.runSingleInstruction();
				if(!err.isOk()){
					err.printErrorMsg();
					break ; 
			}		
		}
	}


	/**
	 * Produces specified line of MIPS source program .
	 * @param lineNo
	 *            Line number of MIPS source program to get. Line 1 is first
	 *            line.
	 * @return Returns specified line of MIPS source. If outside the line range,
	 *         it returns null. Line 1 is first line.
	 **/
	function getSourceLine(lineNo) {
		if ((lineNo >= 1) && (lineNo <= sourceList.length)) {
			return sourceList[lineNo - 1];
		}
		else {
			return null;
		}
	}

	/**
	 * Reads MIPS source code from file into structure.
	 * @param file  String containing name of MIPS source code file.
	 **/

	function readSource(source) {
		this.sourceList = [];
        var tempSource = source.split("\n");
		try {
            for(i=0; i<tempSource.length; i++){
                sourceList.push(tempSource[i]);
            }
		} catch (err) {
			console.log(err);
		}
		return;
	}
	
	function removeComment(){
		var commentRemovedSource = [];
		for(i=0; i<sourceList.length; i++){
			var s=removeCommentFromAString(sourceList[i]);
			s=MyLibrary.removeBeginningAndEndingSpace(s);
			if (!s==="") {
				commentRemovedSource.push(s);
			}
		}
	}


	function removeCommentFromAString(str) {
		var ind=str.indexOf("//");
		if(ind==-1)return str;
		return str.substring(0, ind);
	}
	
	function splitDataAndTextSection(){
		var sourceOfDataSection = [];
		var sourceOfTextSection = [];
		var DataSectionLineNo = [];
		var TextSectionLineNo  = []; 
		
		var DATA=0;
		var TEXT=1;
		int flag=DATA;
		for(i=0; i<commentRemovedSource.length; i++) {
			var str = commentRemovedSource[i];
			str = str.toLowerCase();
			if (str.startsWith(".text")) {
				flag=TEXT;
			}
			else if (str.startsWith(".data")) {
				flag=DATA;
			}
			else {
				if (flag==DATA){
					sourceOfDataSection.push(str);
					DataSectionLineNo.push(i+1);
				}
				else {
					sourceOfTextSection.push(str);
					TextSectionLineNo.push(i+1);
				}
			}
		}
	}
	
	function printDataAndTextSections(){
		console.log("PRINTING TEXT SECTION");
		for(i=0; i<sourceOfTextSection.length; i++) {
			console.log(sourceOfTextSection[i]);
		}
	}

	function doesStartWithLevel(str){
		for(i=0; i<str.length; i++){
			if (MyLibrary.isSpaceChar(str.charAt(i))){
				return false;
			}
			else if(str.charAt(i)===':'){
				return true;
			}
		}
		return false;
	}
	
	function getLevelName(str){
		var ind=-1;
		for(i=0; i<str.length; i++){
			if (MyLibrary.isSpaceChar(str.charAt(i))) {
				break;
			}
			else if (str.charAt(i)===':') {
				ind=i;
				break;
			}
		}
		if(ind==-1)return "";
		return str.substring(0, ind);
	}
	
	function processDataSection(){
		var err = new Error();
		for (i=0; i<sourceOfDataSection.length; i++) {
			var str = sourceOfDataSection[i];
			if(doesStartWithLevel(str)) {
				var levelName=getLevelName(str);
				Mem.setBeginingAddressOfWord(levelName);
				err = processDirectives(str.substring(levelName.length()+1) ,  DataSectionLineNo[i]);
			}else {
				err = processDirectives(str , DataSectionLineNo[i]);
			}
			if(!err.isOk()){
				break;
			}
		}
		return err;
	}
	
	
	function processSpaceDirective(str, sourceLineNo){
		var err = new Error();
		str = MyLibrary.removeBeginningAndEndingSpace(str);
		if (!MyLibrary.isValidNumber(str)) {
			err = new Error("Invalid Numaric Constant in Line Number "+sourceLineNo , Error.ASSEMBLE_TIME_ERROR);
			return err;
		}
		
		var numBytes=MyLibrary.fromStringToInt(str);
		if (numBytes > (Memory.currentStackAddress - Memory.currentDynamicDataAddress)) {
			err = new Error("Segmentation Fault ! Unable To Allocate "+numBytes+" Bytes !" , Error.ASSEMBLE_TIME_ERROR);
			return err ; 
		}
		for(i=0; i<numBytes; i++){
			Mem.addByteInDynamicMemory(0);
		}
		return err;
	}

	function processWordDirective(str, sourceLineNo){
		var err = new Error();
		str = MyLibrary.removeBeginningAndEndingSpace(str);
		if (str.indexOf(':')!=-1) { // value : saperated 
			var A = str.split("[ ]*:[ ]*");
			if (A.length!= 2) { // error
				err = new Error("Syntax Error @ line "+sourceLineNo , Error.ASSEMBLE_TIME_ERROR);
				return err ; 
			}
			if (!MyLibrary.isValidNumber(A[0]) || !MyLibrary.isValidNumber(A[0])) {
				err = new Error("Invalid Numaric Constant in Line Number "+sourceLineNo , Error.ASSEMBLE_TIME_ERROR);
				return err;
			}
			
			var value=MyLibrary.fromStringToInt(A[0]);
			var noOfWords=MyLibrary.fromStringToInt(A[1]);
			
			if (noOfWords*4 > (Memory.currentStackAddress - Memory.currentDynamicDataAddress)) {
				err = new Error("Segmentation Fault ! Unable To Allocate "+noOfWords+" Words !" , Error.ASSEMBLE_TIME_ERROR);
				return err ; 
			}
			
			for (i=0; i<noOfWords; i++) {
				Mem.addWordInDynamicMemory(value);
			}
			
		}
		else if (str.indexOf(',')!=-1) { // values are comma saperated 
			var A=str.split("[ ]*,[ ]*");
			var noOfWords = A.length;
			if (noOfWords*4 > (Memory.currentStackAddress - Memory.currentDynamicDataAddress)) {
				err = new Error("Segmentation Fault ! Unable To Allocate "+noOfWords+" Words !" , Error.ASSEMBLE_TIME_ERROR);
				return err ; 
			}
			
			for (i=0; i<A.length; i++) {
				if (!MyLibrary.isValidNumber(A[i])) {
					err = new Error("Invalid Numaric Constant in Line Number "+sourceLineNo , Error.ASSEMBLE_TIME_ERROR);
					return err;
				}
				Mem.addWordInDynamicMemory(MyLibrary.fromStringToInt(A[i]));
			}
		}
		else { // only one value
			if (!MyLibrary.isValidNumber(str)) {
				err = new Error("Invalid Numaric Constant in Line Number "+sourceLineNo , Error.ASSEMBLE_TIME_ERROR);
				return err;
			}
			Mem.addWordInDynamicMemory(MyLibrary.fromStringToInt(str));
		}
		return err ; 
	}
	
	function isValidString(str){
		var len = str.length;
		if (len < 2) {
			return false ; 
		}
		if (str.charAt(0)!='"' || str.charAt(len-1)!='"') {
			return false ; 
		}
		for (i=1; i<len; i++) {
			if (str.charAt(i) == '\\') {
				if (i==len-2) {
					return false;
				}
				i++;
			}
		}
		return true;
	}
	
	function storeAllChars(str) {
		var err = new Error();
		var len=str.length;
		for (i=1; i<len-1; i++) {
			if(str.charAt(i) == '\\'){
				i++;
				if(str.charAt(i)=='b'){
					Memory.addByteInDynamicMemory('\b');
				}else if(str.charAt(i) == 't'){
					Memory.addByteInDynamicMemory('\t');
				}else if(str.charAt(i) == 'n'){
					Memory.addByteInDynamicMemory('\n');
				}else if(str.charAt(i) == 'f'){
					Memory.addByteInDynamicMemory('\f');
				}else if(str.charAt(i) == 'r'){
					Memory.addByteInDynamicMemory('\r');
				}else if(str.charAt(i) == '"'){
					Memory.addByteInDynamicMemory('"');
				}else if(str.charAt(i) == '\''){
					Memory.addByteInDynamicMemory('\'');
				}else if(str.charAt(i) == '\\'){
					Memory.addByteInDynamicMemory('\\');
				}
			}else{
				Memory.addByteInDynamicMemory(str.charAt(i));
			}
		}
		return err ; 

	}
	
	function processAsciiDirective(str, sourceLineNo){
		var err = new Error();
		str = MyLibrary.removeBeginningAndEndingSpace(str);
		if(!isValidString(str)){
			err = new Error("Invalid String Constant in line no "+sourceLineNo+" !" , Error.ASSEMBLE_TIME_ERROR);
			return err;
		}
		err = storeAllChars(str);
		return err ; 
	}
	
	function processAsciizDirective(str, sourceLineNo){
		var err = new Error();
		str = MyLibrary.removeBeginningAndEndingSpace(str);
		if(!isValidString(str)){
			err = new Error("Invalid String Constant in line no "+sourceLineNo+" !" , Error.ASSEMBLE_TIME_ERROR);
			return err;
		}
		err=storeAllChars(str);
		Memory.addByteInDynamicMemory('\n');
		return err ; 
	}
	
	
	function processDirectives(str, sourceLineNo) {
		str=MyLibrary.removeBeginningAndEndingSpace(str);
//		System.out.println("PROCESSING DIRECTIVE --> "+str);
		var err = new Error();
		if(str.equals("")){
			return err;
		}
		if(str.startsWith(".space")){
			str=str.substring(6);
			err = processSpaceDirective(str , sourceLineNo);
		}else if(str.startsWith(".word")){
			str=str.substring(5);
			err = processWordDirective(str , sourceLineNo);
		}else if(str.startsWith(".asciiz")){
			str=str.substring(7);
			err = processAsciizDirective(str , sourceLineNo);
		}else if(str.startsWith(".ascii")){
			str=str.substring(6);
			err = processAsciiDirective(str , sourceLineNo);
		}else{
			err = new Error("Directive in line no "+sourceLineNo+" is not supported !" , Error.ASSEMBLE_TIME_ERROR);
		}
		return err ; 
	}
	
	function processTextSection(){
		var err = new Error() ; 
		var startAddress=Instruction.startAddressOfInst;
		var currentAddr=startAddress;
		for(i=0;i<sourceOfTextSection.length;i++){
            var str = sourceOfTextSection[i];
            str=MyLibrary.removeBeginningAndEndingSpace(str);
            if(str.equals("")){
                continue;
            }
			if(doesStartWithLevel(str)){
				var levelName=getLevelName(str);
				Instruction.addressOfLevels.put(levelName, currentAddr);
				str=str.substring(levelName.length+1);
				str=MyLibrary.removeBeginningAndEndingSpace(str);
			}
			if(!str.equals("")){
				var instr = new Instruction();
				CodeSection.push(str); 
				err = instr.parsInstruction(str, TextSectionLineNo[i]);
				if(!err.isOk()){
					return err ; 
				}
				AllInstructions.push(instr);
				currentAddr+=4;
			}
		}	
		err = FillAllLevelNamesWithTheirAddress();
		return err ; 
	}

	function FillAllLevelNamesWithTheirAddress() {
		var err = new Error() ; 
		for(i=0; i<AllInstructions.length; i++){
			var inst=AllInstructions[i];
			err = inst.fillLevelNameWithAddress();
			if(!err.isOk()){
				return err ; 
			}
			AllInstructions[i] = inst;
		}
		return err ; 
	}
}