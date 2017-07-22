import sys
import os
import json

fi = open(sys.argv[1], 'r')
fo = open(sys.argv[2], 'w')
data = {}
cnt = 0
for line in fi:
	if cnt % 100000 == 0:
		print cnt
	cnt += 1

	dic = json.loads(line)
	ems = dic['entityMentions']
	sid2cui = {}
	for em in ems:
		cui = em['label']
		sid = em['start']
		sid2cui[sid] = cui
	rms = dic['relationMentions']
	for rm in rms:
		sid1 = rm['em1Start']
		sid2 = rm['em2Start']
		rel = rm['label']
		cui1 = sid2cui[sid1]
		cui2 = sid2cui[sid2]
		if rel == 'None':
			continue
		data[(cui1, cui2, rel)] = 1
for trip in data.keys():
	fo.write(trip[0] + '\t' + trip[1] + '\t' + trip[2] + '\n')
fi.close()
fo.close()

