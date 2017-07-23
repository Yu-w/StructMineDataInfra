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

	def query_links(self, type_a, type_b, relation_type, num_nodes=1):
		#type_a={'mesh':0, 'name':"Chemicals_and_Drugs"}
		type_a = ast.literal_eval(type_a)
		type_b = ast.literal_eval(type_b)
		print type_a
		print type_b
		print relation_type
		#print query_string
		query_string = "SELECT * INTO temp_network FROM (SELECT DISTINCT ON(entity_a,entity_b) entity_a,entity_b,sent_id  "+"FROM "+self.arg['relation_table']+" WHERE type_a_"+type_a['name']+"@>'"\
		+type_a['type']+"' AND type_b_"+type_b['name']+"@>'"+ type_b['type']+"' AND relation_type='"+relation_type + "' ORDER BY entity_a,entity_b,RANDOM()) x ORDER BY RANDOM() LIMIT " +str(num_nodes)
		
		print query_string
		'''
		query_string = "SELECT R.entity_a,R.entity_b,(array_agg( DISTINCT (E1.pmid,E1.article_title)))[1:3] AS a_id,(array_agg(DISTINCT (E2.sent_id,E2.pmid,E2.article_title)))[1:3] AS b_id "+\
		"FROM " + \
		"(SELECT "+"DISTINCT entity_a,entity_b "+"FROM "+self.arg['entity_table']+" WHERE type_a_mesh["+type_a['mesh']+ \
		"]='"+type_a['name']+"' AND type_b_mesh["+type_b['mesh']+"]='"+ type_b['name']+"' AND relation_type='"+relation_type + "' LIMIT 10) R" +\
		" INNER JOIN sample_entity_table E1 ON E1.entity_name = R.entity_a" + \
		" INNER JOIN sample_entity_table E2 ON E2.entity_name = R.entity_b GROUP BY R.entity_a,R.entity_b"
		'''
		
		self.db.query(query_string)
		query_a=self.db.query("select entity_a from temp_network")
		#print ttt.dictresult()
		red_node = dict()
		for v in query_a.dictresult():
			tmp=self.db.query("select article_title, (array_agg(pmid))[1] as pmid, (array_agg(sent))[1] as sent from entity_table where entity_name= '" + v['entity_a'] + "' group by article_title LIMIT 2")
			red_node[v['entity_a']] = map(lambda x:(x['article_title'],x['sent'],x['pmid']),tmp.dictresult())
		query_b=self.db.query("select entity_b from temp_network")
		blue_node = dict()
		for v in query_b.dictresult():
			tmp=self.db.query("select article_title, (array_agg(pmid))[1] as pmid, (array_agg(sent))[1] as sent from entity_table where entity_name= '" + v['entity_b'] + "' group by article_title LIMIT 2")
			blue_node[v['entity_b']] = map(lambda x:(x['article_title'],x['sent'],x['pmid']),tmp.dictresult())
		#print red_node,blue_node
		query_edge = "SELECT DISTINCT T.entity_a as source, T.entity_b as target, E.pmid, E.article_title,E.sent FROM " + self.arg['entity_table'] + " AS E INNER JOIN temp_network T ON E.sent_id = T.sent_id";
		q = self.db.query(query_edge)
		self.db.query("drop table temp_network")
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
	if len(sys.argv) == 6:
		tmp_utils = data_utils({'entity_table': sys.argv[1], 'relation_table': sys.argv[2]})
		result = tmp_utils.query_links(type_a=sys.argv[3], type_b=sys.argv[4], relation_type=sys.argv[5])
		print result
	elif len(sys.argv) ==5:
		tmp_utils = data_utils({'data_file': sys.argv[1], 'entity_table': sys.argv[2], 'relation_table': sys.argv[3],'corpus_map': sys.argv[4]})
		tmp_utils.load_pmids()
		tmp_utils.insert_record()
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

