import json
import sys
from pg import DB

class data_utils(object):
	"""docstring for db_utils"""
	def __init__(self, arg):
		#super(db_utils, self).__init__()
		self.arg = arg
		self.db = DB(dbname='cancer_graph', user='structnet', passwd='structnet', host='localhost')

	def extract(self):
		cnt = 0
		# cancer 386M lines
		with open(self.arg['graph_file'], 'r') as IN:
			for line in IN:
				if cnt > 1000:
					break
				cnt += 1
				tmp=json.loads(line)
				for e in tmp['entityMentions']:
					self.db.insert(self.arg['table_sent'], entity_name=e['text'], sentid=int(tmp['sentId']))
					self.db.insert(self.arg['table_arti'], entity_name=e['text'], articleid=int(tmp['articleId']))
	def query(self, query_string):
		q = self.db.query(query_string)
		print q.dictresult()
#class db_utils(object)
if __name__ == '__main__':
	tmp = data_utils({'graph_file': sys.argv[1], 'table_sent': sys.argv[2], 'table_arti': sys.argv[3]})
	#tmp.extract()
	tmp.query(sys.argv[4])
