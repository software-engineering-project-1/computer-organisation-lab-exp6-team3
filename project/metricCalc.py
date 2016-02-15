"""
@Author : Mohit Jain
@Email  : develop13mohit@gmail.com
"""
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-file',dest='in_file', type=str)

    args = parser.parse_args()
    try:
        in_file = args.in_file
    except:
        print "USAGE : $> python metricCalc.py -file <input_code>"
        return

    ctr_code = 0
    ctr_comm = 0
    with open(in_file,'r') as f:
        for line in f.readlines():
            if line == '\n':
                continue
            ctr_code += 1
            if '//' in line:
                ctr_comm += 1
    
    print "``METRICS``"
    print "~~~~~~~~~~~"
    print "FileName  :", in_file
    print "LOCode    :", ctr_code
    print "LOComment :", ctr_comm
    print "Code/Comm Ratio : ", float(ctr_code)/ctr_comm

if __name__=='__main__':
    main()
