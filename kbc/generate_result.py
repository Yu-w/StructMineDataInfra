import sys
import os
import json

cui2name = {}
fi = open(sys.argv[1], 'r')
for line in fi:
	lst = line.strip().split('\t')
	cui = lst[0]
	cui2name[cui] = []
	for k in range(1, len(lst)):
		cui2name[cui].append(lst[k])
fi.close()

print len(cui2name)

fi = open(sys.argv[2], 'r')
fo = open(sys.argv[3], 'w')
cnt = 0
for line in fi:
	if cnt % 10000 == 0:
		print cnt
	cnt += 1
	lst = line.strip().split()
	cui1 = lst[0]
	cui2 = lst[1]
	rel = lst[2]
	scr = float(lst[3])
	names1 = cui2name.get(cui1, [])
	names2 = cui2name.get(cui2, [])
	for name1 in names1:
		for name2 in names2:
			dic = {}
			dic['em1Text'] = name1
			dic['em2Text'] = name2
			dic['em1Label'] = cui1
			dic['em2Label'] = cui2
			dic['label'] = rel
			dic['score'] = scr
			fo.write(json.dumps(dic) + '\n')
fi.close()
fo.close()

