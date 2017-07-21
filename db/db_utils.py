import json
import sys
from pg import DB
import marshal
import multiprocessing
from collections import defaultdict
import ast

tmp_utils = None

class data_utils(object):
	"""docstring for db_utils"""
	def __init__(self, arg):
		#super(db_utils, self).__init__()
		self.arg = arg
		self.db = DB(dbname='structnet', user='structnet', passwd='structnet', host='localhost')
		print "Conncted!"

	def load_pmids(self):
		f = open(self.arg['corpus_map'],'rb')
		self.pmid_dict = marshal.load(f)
		f.close()
		print "PMID loaded!"

	def insert_entity(self):
		cnt = 0
		# 527.8M lines
		with open(self.arg['data_file'], 'r') as IN:
			for line in IN:
				#try:
				if cnt % 5000 == 0:
					print "process ", cnt, " lines"
				cnt += 1
				tmp=json.loads(line)
				for e in tmp['entityMentions']:
					aid = str(tmp['articleId'])

					assert(len(self.pmid_dict[aid])<9)
					self.db.insert(self.arg['table_name'], entity_name=e['text'], sent_id=tmp['sentId'],
						article_id=tmp['articleId'], pmid=self.pmid_dict[aid][0], 
						article_title=self.pmid_dict[aid][1], sent=tmp['sentText'])
				#except:
					#print cnt

	def insert_relation(self):
		cnt = 0
		#527.8M lines
		with open(self.arg['data_file'], 'r') as IN:
			for line in IN:
				#try:
				if cnt % 5000 == 0:
					print "process ", cnt, " lines"
				cnt += 1
				tmp=json.loads(line)
				type_dict = {}
				for e in tmp['entityMentions']:
					mesh = []
					umls = []
					go = []
					sub_type = defaultdict(list)
					for l in e['label']:
						if 'MeSH' in l:
							mesh.append(l.replace('MeSH:::', ''))
						elif 'GO' in l:
							go.append(l.replace('GO:::', ''))
						else:
							umls.append(l)
					if len(go) > 0:
						sub_type['go'] = True
					else:
						sub_type['go'] = False
					if len(mesh) > 0:
						sub_type['mesh'] = mesh[0].split('::')
					sub_type['umls'] = umls
					type_dict[e['start']] = sub_type
				for r in tmp['relationMentions']:
					self.db.insert(self.arg['table_name'], entity_a=r['em1Text'], entity_b=r['em2Text'],
						relation_type=r['label'], a_is_gene=type_dict[r['em1Start']]['go'],
						b_is_gene=type_dict[r['em2Start']]['go'], type_a_umls=type_dict[r['em1Start']]['umls'],
						type_b_umls=type_dict[r['em2Start']]['umls'], type_a_mesh=type_dict[r['em1Start']]['mesh'],
						type_b_mesh=type_dict[r['em2Start']]['mesh'])
				#break

	def query_links(self, type_a, type_b, relation_type, identifier='MeSH'):
		#type_a={'mesh':0, 'name':"Chemicals_and_Drugs"}
		type_a = ast.literal_eval(type_a)
		type_b = ast.literal_eval(type_b)
		print type_a
		print type_b
		print relation_type
		query_string = "SELECT R.entity_a,R.entity_b,(array_agg(DISTINCT E1.article_id))[1:3] AS a_id,(array_agg(DISTINCT E2.article_id))[1:3] AS b_id FROM " "(SELECT "+"DISTINCT entity_a,entity_b "+"FROM "+self.arg['table_name']+" WHERE type_a_mesh["+type_a['mesh']+ \
		"]='"+type_a['name']+"' AND type_b_mesh["+type_b['mesh']+"]='"+ type_b['name']+"' AND relation_type='"+relation_type + "' LIMIT 10) R" +\
		" INNER JOIN entity_table E1 ON E1.entity_name = R.entity_a" + \
		" INNER JOIN entity_table E2 ON E2.entity_name = R.entity_b GROUP BY R.entity_a,R.entity_b"
		print query_string
		q = self.db.query(query_string)
		print q.dictresult()
		return q.dictresult()

def worker(lines):
	for line in lines:
		tmp=json.loads(line)
		for e in tmp['entityMentions']:
			aid = str(tmp['articleId'])
			assert(len(tmp_utils.pmid_dict[aid])<9)
			tmp_utils.db.insert(tmp_utils.arg['table_name'], entity_name=e['text'], sent_id=tmp['sentId'],
				article_id=tmp['articleId'], pmid=tmp_utils.pmid_dict[aid][0], 
				article_title=tmp_utils.pmid_dict[aid][1], sent=tmp['sentText'])
	print "done"

#class db_utils(object)
if __name__ == '__main__':
	# sys.argv[1] = "./data/sample_data.json"
	# sys.argv[2] = "entity_table"
	# sys.argv[2] = "relation_table"
	# sys.argv[3] = "./data/final_pmid_dict.m"

	print(sys.argv)
	# tmp_utils = data_utils({'data_file': sys.argv[1], 'table_name': sys.argv[2], 'corpus_map': sys.argv[3]})
	# tmp_utils.load_pmids()
	# tmp_utils.insert_entity()
	# tmp_utils.insert_relation()
	
	sys.argv[1] = "relation_table"
	sys.argv[2] = "{'mesh':'1', 'name':'Chemicals_and_Drugs'}"
	sys.argv[3] = "{'mesh':'1', 'name':'Chemicals_and_Drugs'}"
	sys.argv[4] = "isa"
	tmp_utils = data_utils({'table_name': sys.argv[1]})
	tmp_utils.query_links(type_a=sys.argv[2], type_b=sys.argv[3], relation_type=sys.argv[4])
	
	# '''
	# lines = open(sys.argv[1]).readlines()
	# print "lines", len(lines)
	# numthreads = 20
	# numlines = 10000
	# pool = multiprocessing.Pool(processes=numthreads)
	# result_list = pool.map(worker, (lines[line:line+numlines] for line in xrange(0,len(lines),numlines) ))
	# '''

	'''
	[{}, {}, {}]
	in each dict:
		a_id: the articleID of document that contains the entity a
		b_id: the articleID of document that contains the entity b
		entity_a: entity name
		entity_b: entity name 
	'''

