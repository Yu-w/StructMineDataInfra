import sys
import os

numbers = '0123456789'

vocab = {}
fi = open(sys.argv[1], 'r')
cnt = 0
for line in fi:
	if cnt % 100000 == 0:
		print cnt
	cnt += 1

	u = line.split('\t')[0]
	v = line.split('\t')[1]
	try:
		if u[0] == 'C' and u[1] in numbers:
			vocab[u] = 1
		if v[0] == 'C' and v[1] in numbers:
			vocab[v] = 1
	except:
		continue
fi.close()

fo = open(sys.argv[2], 'w')
for word in vocab.keys():
	fo.write(word + '\n')
fo.close()

