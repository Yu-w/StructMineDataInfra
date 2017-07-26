import json
import sys
from pg import DB
import marshal
import multiprocessing
from collections import defaultdict
import ast
import random,string

tmp_utils = None

class data_utils(object):
	"""docstring for db_utils"""
	def __init__(self, arg):
		#super(db_utils, self).__init__()
		self.arg = arg
		self.db = DB(dbname='structnet', user='structnet', passwd='structnet', host='localhost')
		self.identity = ''.join(random.choice(string.ascii_lowercase) for _ in range(8))
		print self.identity
		print "Conncted!"

	def load_pmids(self):
		f = open(self.arg['corpus_map'],'rb')
		self.pmid_dict = marshal.load(f)
		f.close()
		print "PMID loaded!"

	def insert_prediction(self):
		cnt = 0
		# 527.8M lines
		with open(self.arg['data_file'], 'r') as IN:
			for line in IN:
				#try:
				if cnt % 50000 == 0:
					print self.arg['data_file'],"process ", cnt, " lines"
				cnt+=1
				tmp=json.loads(line)
				self.db.insert(self.arg['prediction_table'], entity_a=tmp['em1Text'], entity_b=tmp['em2Text'],
				relation_type=tmp['label'], score=tmp['score'])

	def insert_query(self):
		with open(self.arg['data_file']) as IN:
			line_num=0
			for line in IN:
				print line_num
				tmp=line.split('\t')
				target_type = ast.literal_eval(tmp[0])[0]
				if '[' in tmp[3]:
					output_types = ast.literal_eval(tmp[3])
				else:
					output_types = [tmp[3]]
				relation_type = tmp[2]
				self.db.insert(self.arg['query_table'], target_type=target_type, output_types=output_types,
					index=line_num, relation_type=relation_type)
				line_num += 1


	def insert_caseolap(self,index_number):
		with open(self.arg['data_file']+str(index_number)+'_c.txt') as IN:
			for line in IN:
				tmp=line.split('\t')
				score_list=tmp[1].strip().lstrip('[').rstrip(']').split(',')
				for ele in score_list:
					temp=ele.strip().split('|')
					if len(temp)!=2:
						continue
					self.db.insert(self.arg['caseolap_table'], doc_id=index_number, sub_type=tmp[0],
				entity=temp[0], score=float(temp[1]))
	
	def query_prediction(self, name_a, name_b,relation_type):
		query_string = "SELECT count(*) FROM "+self.arg['prediction_table']+" WHERE entity_a=\'" + name_a +"\' AND entity_b=\'" + \
		name_b + "\' AND relation_type=\'" + relation_type + "\'"
		q = self.db.query(query_string)
		return q.dictresult()[0]['count'] > 0
		#print query_string

	def query_distinctive(self,target_type,output_types,relation_type, sub_types,num_records=8):
		sub_types = ast.literal_eval(sub_types)
		result=[]
		query_string = "SELECT index FROM query_table WHERE target_type=\'" + target_type + "\' AND output_types@>\'" +\
		output_types+"\' and relation_type=\'" + relation_type +"\'"
		idx = self.db.query(query_string).dictresult()[0]['index']
		for sub_type in sub_types:
			query_string = "SELECT entity,score FROM " + self.arg['caseolap_table'] + " WHERE doc_id=" + str(idx) + \
			" AND sub_type=\'" + sub_type + "\' ORDER BY score LIMIT " + str(num_records)
			q = self.db.query(query_string)
			result.append(q.dictresult())
		return result

	def insert_record(self):
		cnt = 0
		# 527.8M lines
		with open(self.arg['data_file'], 'r') as IN:
			for line in IN:
				#try:
				if cnt % 5000 == 0:
					print self.arg['data_file'],"process ", cnt, " lines"
				cnt += 1
				tmp=json.loads(line)
				type_dict = {}
				for e in tmp['entityMentions']:
					aid = str(tmp['articleId'])
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

					assert(len(self.pmid_dict[aid])<9)
					self.db.insert(self.arg['entity_table'], entity_name=e['text'], sent_id=tmp['sentId'],
						article_id=tmp['articleId'], pmid=self.pmid_dict[aid][0], 
						article_title=self.pmid_dict[aid][1], sent=tmp['sentText'])
				for r in tmp['relationMentions']:
					self.db.insert(self.arg['relation_table'], entity_a=r['em1Text'], entity_b=r['em2Text'],
						relation_type=r['label'], a_is_gene=type_dict[r['em1Start']]['go'],
						b_is_gene=type_dict[r['em2Start']]['go'], type_a_umls=type_dict[r['em1Start']]['umls'],
						type_b_umls=type_dict[r['em2Start']]['umls'], type_a_mesh=type_dict[r['em1Start']]['mesh'],
						type_b_mesh=type_dict[r['em2Start']]['mesh'], sent_id=tmp['sentId'], article_id=tmp['articleId'])
				#except:
					#print cnt

	def query_links(self, type_a, type_b, relation_type, num_edges=5, num_pps=1):
		#type_a={'mesh':0, 'name':"Chemicals_and_Drugs"}
		type_a = ast.literal_eval(type_a)
		type_b = ast.literal_eval(type_b)
		#print type_a
		#print type_b
		#print relation_type
		#print query_string
		#q = self.db.query("select exists(select relname from pg_class where relname = 'temp_network' and relkind='r')")
		#if q.dictresult()[0]['exists']:
		query_string = "SELECT * INTO " +self.identity+ " FROM (SELECT DISTINCT ON(entity_a,entity_b) entity_a,entity_b,sent_id  "+"FROM "+self.arg['relation_table']+" WHERE type_a_"+type_a['name']+"@>'"\
		+type_a['type']+"' AND type_b_"+type_b['name']+"@>'"+ type_b['type']+"' AND relation_type='"+relation_type + "') x ORDER BY RANDOM() LIMIT " +str(num_edges)
		
		#print query_string
		'''
		query_string = "SELECT R.entity_a,R.entity_b,(array_agg( DISTINCT (E1.pmid,E1.article_title)))[1:3] AS a_id,(array_agg(DISTINCT (E2.sent_id,E2.pmid,E2.article_title)))[1:3] AS b_id "+\
		"FROM " + \
		"(SELECT "+"DISTINCT entity_a,entity_b "+"FROM "+self.arg['entity_table']+" WHERE type_a_mesh["+type_a['mesh']+ \
		"]='"+type_a['name']+"' AND type_b_mesh["+type_b['mesh']+"]='"+ type_b['name']+"' AND relation_type='"+relation_type + "' LIMIT 10) R" +\
		" INNER JOIN sample_entity_table E1 ON E1.entity_name = R.entity_a" + \
		" INNER JOIN sample_entity_table E2 ON E2.entity_name = R.entity_b GROUP BY R.entity_a,R.entity_b"
		'''
		
		self.db.query(query_string)
		query_a=self.db.query("select entity_a from "+self.identity)
		#print ttt.dictresult()
		red_node = dict()
		for v in query_a.dictresult():
			#print "select distinct on (article_id) article_title, pmid, sent from entity_table where entity_name= '" + v['entity_a'] + "' LIMIT "+str(num_pps)
			#print "select distinct on (article_id) article_title, pmid, sent from entity_table where entity_name= '" + v['entity_a'] + "' LIMIT 2" 
			tmp=self.db.query("select article_title, pmid, sent from entity_table where entity_name= '" + v['entity_a'] + "' LIMIT 10")
			#tmp=self.db.query("select distinct on (article_id) article_title, pmid, sent from entity_table where entity_name= '" + v['entity_a'] + "' LIMIT "+str(num_pps))
			red_node[v['entity_a']] = map(lambda x:(x['article_title'],x['sent'],x['pmid']),tmp.dictresult())
		query_b=self.db.query("select entity_b from "+self.identity)
		blue_node = dict()
		for v in query_b.dictresult():
			#pass
			#print "select distinct on (article_id) article_title, pmid, sent from entity_table where entity_name= '" + v['entity_b'] + "' LIMIT "+str(num_pps)
			tmp=self.db.query("select article_title, pmid, sent from entity_table where entity_name= '" + v['entity_b'] + "' LIMIT 10")
			#tmp=self.db.query("select distinct on (article_id) article_title, pmid, sent from entity_table where entity_name= '" + v['entity_b'] + "' LIMIT "+str(num_pps))
			blue_node[v['entity_b']] = map(lambda x:(x['article_title'],x['sent'],x['pmid']),tmp.dictresult())
		#print red_node,blue_node
		query_edge = "SELECT DISTINCT T.entity_a as source, T.entity_b as target, E.pmid, E.article_title,E.sent FROM " + self.arg['entity_table'] + " AS E INNER JOIN "+\
		self.identity+" T ON E.sent_id = T.sent_id";
		q = self.db.query(query_edge)
		self.db.query("drop table "+self.identity)
		return {'node_a':red_node,'node_b':blue_node,'edge':q.dictresult()}
		#print query_red_node.dictresult()
		#q = self.db.query(query_red_node)
		#print q.dictresult()
		#return q.dictresult()

#class db_utils(object)
if __name__ == '__main__':
	# sys.argv[1] = "./data/sample_data.json"
	# sys.argv[2] = "entity_table"
	# sys.argv[2] = "relation_table"
	# sys.argv[3] = "./data/final_pmid_dict.m"

	#print(sys.argv)
	#t
	if sys.argv[1] == 'query':
		if sys.argv[2] == 'network':
			tmp_utils = data_utils({'entity_table': sys.argv[3], 'relation_table': sys.argv[4]})
			result = tmp_utils.query_links(type_a=sys.argv[5], type_b=sys.argv[6], relation_type=sys.argv[7], num_edges=sys.argv[8], num_pps=sys.argv[9])
		elif sys.argv[2] == 'predict':
			tmp_utils = data_utils({'prediction_table': sys.argv[3]})
			result = tmp_utils.query_prediction(name_a=sys.argv[4], name_b=sys.argv[5], relation_type=sys.argv[6])
			print result
		elif sys.argv[2] == 'caseolap':
			tmp_utils = data_utils({'caseolap_table': sys.argv[3]})
			result = tmp_utils.query_distinctive(target_type=sys.argv[4],
				output_types=sys.argv[5],relation_type=sys.argv[6],sub_types=sys.argv[7])
			print result
			
	else:
		if len(sys.argv) == 5:
			tmp_utils = data_utils({'data_file': sys.argv[1], 'entity_table': sys.argv[2], 'relation_table': sys.argv[3],'corpus_map': sys.argv[4]})
			tmp_utils.load_pmids()
			tmp_utils.insert_record()
		elif len(sys.argv) == 3:
			tmp_utils = data_utils({'data_file': sys.argv[1], 'query_table': sys.argv[2]})
			tmp_utils.insert_query()
			#tmp_utils = data_utils({'data_file': sys.argv[1], 'prediction_table': sys.argv[2]})
			#tmp_utils.insert_prediction()
		elif len(sys.argv) == 4:
			tmp_utils = data_utils({'data_file': sys.argv[1], 'caseolap_table': sys.argv[2]})
			#52
			for i in xrange(int(sys.argv[-1])):
				print "process file:",i
				tmp_utils.insert_caseolap(i)
	#tmp_utils.insert_relation()
	
	#sys.argv[1] = "relation_table"
	#sys.argv[2] = "{'name':'mesh', 'name':'Chemicals_and_Drugs'}"
	#sys.argv[3] = "{'name':'mesh', 'name':'Chemicals_and_Drugs'}"
	#sys.argv[4] = "isa"
	#tmp_utils = data_utils({'table_name': sys.argv[1]})
	#tmp_utils.query_links(type_a=sys.argv[2], type_b=sys.argv[3], relation_type=sys.argv[4])
	
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

