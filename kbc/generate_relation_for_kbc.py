import sys
import os

data = {}

fi = open(sys.argv[1], 'r')
for line in fi:
	rel = line.strip().split('\t')[2]
	data[rel] = 1
fi.close()

fo = open(sys.argv[2], 'w')
for rel in data.keys():
	fo.write(rel + '\n')
fo.close()

