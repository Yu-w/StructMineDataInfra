import sys
import os
import json
import random

max_length = 8

name2cui_file = sys.argv[1]
name2go_file = sys.argv[2]
text_file = sys.argv[3]
output_file = sys.argv[4]
vocab_file = sys.argv[5]
name2stop_file = sys.argv[6]

name2cui = {}
name2flag = {}
name2stop = {}

fi = open(name2cui_file, 'r')
for line in fi:
	lst = line.strip().split('\t')
	name = lst[0].lower()
	cui = lst[1]

	name2flag[name] = 1
	name2cui[name] = cui
fi.close()

print len(name2cui)

fi = open(name2go_file, 'r')
for line in fi:
	lst = line.strip().split()
	name = lst[0]
	cui = lst[1]

	name2flag[name] = 2
	name2cui[name] = cui
fi.close()

print len(name2cui)

fi = open(name2stop_file, 'r')
for line in fi:
	name = line.strip()
	name2stop[name] = 1
	name2flag[name] = 0
	name2flag[name.upper()] = 0
fi.close()

print len(name2stop)

fi = open(text_file, 'r')
fo = open(output_file, 'w')
vocab = {}
cnt = 0
while True:
	title = fi.readline()
	line = fi.readline()
	if not title:
		break
	if not line:
		break

	if cnt % 1000 == 0:
		print cnt
	cnt += 1
	#if cnt == 100000:
	#	break

	docid = int(title.split('\t')[0])
	senid = int(title.split('\t')[1])

	ent_lst = []

	word_lst = line.strip().split(' ')
	slen = len(word_lst)
	begin = 0
	end = slen

	idcnt = 0
	while True:
		if end <= 0:
			break

		begin = max(0, end - max_length)

		for p in range(begin, end):
			s = word_lst[p]
			for i in range(p + 1, end):
				s = s + ' ' + word_lst[i]

			if name2flag.get(s, 0) == 2:
				cui = name2cui[s]
				ent_lst.append((cui, p, end, s, 0, idcnt))
				idcnt += 1
				end = p
				break
			if name2flag.get(s.lower(), 0) == 1:
				cui = name2cui[s.lower()]
				ent_lst.append((cui, p, end, s, 0, idcnt))
				idcnt += 1
				end = p
				break
			if p == end - 1:
				end = p
				break

	ent_lst = sorted(ent_lst, key=lambda x:(x[2] - x[1]), reverse=True)
	for ent in ent_lst:
		line = line.replace(' ' + ent[3] + ' ', ' ' + ent[0] + ' ')
		if ent[0] not in vocab:
			vocab[ent[0]] = {}
		vocab[ent[0]][ent[3].lower()] = 1
	fo.write(line)

fi.close()
fo.close()

fo = open(vocab_file, 'w')
for cui, dic in vocab.items():
	fo.write(cui)
	for name in dic.keys():
		fo.write('\t' + name)
	fo.write('\n')
fo.close()


