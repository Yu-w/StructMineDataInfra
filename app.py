'''
__author__: Jiaming Shen
__description__: the middleaware to connect DB and front-end system
'''
from flask import Flask, render_template, url_for, request, json, redirect, jsonify
import json
from db.db_utils import data_utils
from config import *

sample_data = [
  {
    "name":"CARDIOMYOPATHY2",
    "keyWords":[
      {
        "name":"interferon_gamma2",
        "number":3.341
      },
      {
        "name":"interleukin-42",
        "number":2.81
      },
      {
        "name":"tumor_necrosis_factor2",
        "number":2.72
      },
      {
        "name":"interleukin-17a2",
        "number":2.542
      }
    ]
  },

  {
    "name":"BEATING2",
    "keyWords":[
      {
        "name":"alpha-galactosidase_a2",
        "number":4.60
      },
      {
        "name":"brain-derived_neurotrophic2",
        "number":3.99
      },
      {
        "name":"tissue-type_plasminogen2",
        "number":3.65
      },
      {
        "name":"apolipoprotein_e2",
        "number":3.30
      }

    ]
  }
];

### The following example is workable for network visualization page
sample_data_2 = [
    {
        "group": 'nodes',
        "data": {
            "id": 'EndocardialFibroelastosis',
            "label":'Endocardial Fibroelastosis',
            "docs": [{
                "pmid": "22507220",
                "sentences": ["In these studies , variants of genes encoding phase "],
                "title": 'Epidemiologic differences'
            }]
        },
        "selectable": True,
        "grabbable": True
    },
    {
        "group": 'nodes',
        "data": {
            "id": 'Node2',
            "label": 'Node2',
            "docs": [{
                "pmid": "22507220",
                "sentences": ["In these studies , variants of genes encoding phase "],
                "title": 'Epidemiologic differences'
            }]
        },
        "selectable": True,
        "grabbable": True
    },
    {
        "group": "edges",
        "data": {
            "source": "EndocardialFibroelastosis",
            "target": "Node2",
            "docs": [{
                "pmid": "12345",
                "title": "tese sent",
                "sentences": ["test-edge-sentences"]
            }]
        }
    }
];


app = Flask(__name__)

@app.route('/network_exploration', methods=['GET','POST'])
def network_exploration():
    '''
    arg1: corresponds to type a (node_a)
    arg2: corresponds to type b (node_b)

    :return:
    '''
    arg1 = request.args.get('argument1')
    arg2 = request.args.get('argument2')
    relation = request.args.get('relation')
    print("Parameters in http requestion: ", arg1, arg2, relation)

    '''
    Following the query format from @bran
    Example:
    python db/db_utils.py entity_table relation_table 
    "{'name':'mesh', 'type':'{Chemicals_and_Drugs}'}" 
    "{'name':'mesh', 'type':'{Anatomy}'}" 
    is_associated_anatomy_of_gene_product
    '''
    if FLAGS_DEBUG:
        print("[INFO] Start querying DB")
    tmp_utils = data_utils({'entity_table': 'entity_table', 'relation_table': 'relation_table'})
    ## TODO: the umls is also applicable, extend it later
    type_a = str({'name':'mesh', 'type':("{"+arg1+"}") })
    type_b = str({'name':'mesh', 'type':("{"+arg2+"}") })
    relation_type = relation

    num_edges = 5
    num_pps = 1
    res = tmp_utils.query_links(type_a=type_a, type_b=type_b, relation_type=relation_type,
                                num_edges=num_edges, num_pps=num_pps)
    if FLAGS_DEBUG:
        print("[INFO] Complete querying DB")

    if FLAGS_SAVE_DATA:
        with open("./db_res.txt", "w") as fout:
            fout.write(str(res))
            print("[DATA] DB output data:", res)
        with open("./db_res.txt", "r") as fin:
            raw_data = fin.read().strip()
            res = eval(raw_data)

    if FLAGS_DEBUG:
        print("[INFO] Start formatting DB output results into JSON")
    json_data = []
    ## Add Type A nodes
    for k,v in res["node_a"].items():
        # k is the entity name
        # v is a list of triplets (article_title, sentence, pmid)
        data_label = k
        data_id = ''.join(k.split()) # front-end id should not contain space
        data_docs = []
        existed_doc = set()
        for doc_info in v:
            if len(doc_info) != 3:
                print("[ERROR] wrongly formated document", doc_info)
                data_docs_title = "NONE"
                data_docs_pmid = "0"
                data_docs_sents = ["NONE-SENT"]
            else:
                data_docs_title = doc_info[0]
                data_docs_pmid = doc_info[2]
                data_docs_sents = [doc_info[1]] # front-end requires sentences send as a list

            if data_docs_pmid in existed_doc: # skip and doc it occurred before
                continue
            else:
                existed_doc.add(data_docs_pmid)
                data_docs.append({
                    "title": data_docs_title,
                    "pmid": data_docs_pmid,
                    "sentences": data_docs_sents
                })
        ## Add type-a nodes
        data = {
            "id": data_id,
            "label": data_label,
            "docs": data_docs
        }
        json_data.append({
            "group": "nodes",
            "data": data,
            "selectable": True,
            "grabbable": True
        })

    ## Add Type B nodes
    for k,v in res["node_b"].items():
        # k is the entity name
        # v is a list of triplets (article_title, sentence, pmid)
        data_label = k
        data_id = ''.join(k.split()) # front-end id should not contain space
        data_docs = []
        existed_doc = set()
        for doc_info in v:
            if len(doc_info) != 3:
                print("[ERROR] wrongly formated document", doc_info)
                data_docs_title = "NONE"
                data_docs_pmid = "0"
                data_docs_sents = ["NONE-SENT"]
            else:
                data_docs_title = doc_info[0]
                data_docs_pmid = doc_info[2]
                data_docs_sents = [doc_info[1]] # front-end requires sentences send as a list

            if data_docs_pmid in existed_doc:
                continue
            else:
                existed_doc.add(data_docs_pmid)
                data_docs.append({
                    "title": data_docs_title,
                    "pmid": data_docs_pmid,
                    "sentences": data_docs_sents
                })
        data = {
            "id": data_id,
            "label": data_label,
            "docs": data_docs
        }
        json_data.append({
            "group": "nodes",
            "data": data,
            "selectable": True,
            "grabbable": True,
            "classes": "type2"
        })

    ## Add edges, notice that each edge has only one attached document
    for edge in res["edge"]:
        # edge is a dict {'article_title':xxx, 'sent':xxx, 'pmid':xxx, 'source':xxx, 'target':xxx}
        data_source = "".join(edge["source"].split())
        data_target = "".join(edge["target"].split())
        data_doc_title = edge["article_title"]
        data_doc_sentences = [edge["sent"]]
        data_doc_pmid = edge["pmid"]
        data_doc = [{
            "title": data_doc_title,
            "pmid": data_doc_pmid,
            "sentences": data_doc_sentences
        }]
        data = {
            "source": data_source,
            "target": data_target,
            "docs": data_doc
        }
        json_data.append({
            "group": "edges",
            "data": data
        })

    if FLAGS_DEBUG:
        print("[INFO] Complete formatting DB output results into JSON")

    if FLAGS_SAVE_DATA:
        with open("./example_json.txt", "w") as fout:
            fout.write(str(json_data))
        print("[DATA] test json data:", json_data)


    response = app.response_class(
        response=json.dumps(json_data),
        # response=json.dumps(sample_data_2),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/distinctive_summarization', methods=['GET','POST'])
def distinctive_summarization():

    targetEntType = request.args.get('targetEntityType')
    outputEntType = request.args.get('outputEntityType')
    relation = request.args.get('relation')
    targetEntSubtypes = request.args.getlist('targetEntitySubtypes')
    if FLAGS_DEBUG:
        print(targetEntType, outputEntType, relation, targetEntSubtypes)

    if FLAGS_DEBUG:
        print("[INFO] Start querying DB")
    target_type = targetEntType
    output_types = str("{"+outputEntType+"}")
    relation_type = relation
    sub_types = str(targetEntSubtypes)
    tmp_utils = data_utils({'caseolap_table': "caseolap_table"})
    res = tmp_utils.query_distinctive(target_type=target_type,
                                      output_types=output_types,
                                      relation_type=relation_type,
                                      sub_types=sub_types,
                                      num_records=8)
    if FLAGS_DEBUG:
        print("[INFO] Complete querying DB")
        print(res)

    if FLAGS_DEBUG:
        print("[INFO] Start formatting DB output result into JSON")

    json_data = []
    for i in range(len(targetEntSubtypes)):
        sub_type_name = targetEntSubtypes[i]
        sub_type_keyWords = []
        ## reverse the list to obtain a score descending order
        for entity in reversed(res[i]):
            entity_score = entity['score']
            entity_name = entity['entity']
            sub_type_keyWords.append({
                "name": entity_name,
                "number": entity_score
            })
        json_data.append({
            "name": sub_type_name,
            "keyWords": sub_type_keyWords
        })

    if FLAGS_DEBUG:
        print("[INFO] Complete formatting DB output result into JSON")

    response = app.response_class(
        # response=json.dumps(sample_data),
        response=json.dumps(json_data),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run(host=FLAGS_HOST_ADDR, port = FLAGS_PORT, debug=FLAGS_DEBUG) # for server

