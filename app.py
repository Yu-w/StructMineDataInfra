'''
__author__: Jiaming Shen
__description__: the middleaware to connect DB and front-end system
'''
from flask import Flask, render_template, url_for, request, json, redirect, jsonify
import json
import random
import re
import marshal
from db.db_utils import data_utils
from config import *
from caseOLAP_sample_query import *
from network_vis_sample_query import *

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
]

### The following example is a placeholder for "bad" query with invalid entity/relation types.
invalid_query_data = [
    {
        "group": 'nodes',
        "data": {
            "id": "Invalidentity/relationtypes",
            "label": "Invalid entity/relation types."
        },
        "selectable": True,
        "grabbable": True
    }
]

### The following example is a placeholder for "bad" query without any returned network relation.
empty_result_query_data = [
    {
        "group": 'nodes',
        "data": {
            "id": "Noreturnednetwork",
            "label": "No returned network."
        },
        "selectable": True,
        "grabbable": True
    }
]

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
        },
        "classes": 'edge1'
    }
]

### sample_query_id
sample_query_id = -1


# all_types = marshal.load(open("./data/all_types.m","rb"))
# for k in all_types.keys():
#     # convert list to set for faster check
#     all_types[k] = set(all_types[k])
if FLAGS_DEBUG:
    print("[INFO] Complete loading marshal !!!")

def check_types(element):
    """
    :param element: a string
    :return: one of "umls", "mesh", "relation", "none"
    """
    # global all_types
    # element_type = "none"
    # for k in all_types.keys():
    #     if element in all_types[k]:
    #         element_type = k
    #         break
    # return element_type
    return "mesh" 

def seg_long_sent(sent, entity):
    '''
    :param sent: a string
    :param entity: a string
    :return:
        a list of seged sents
    '''
    window_char_size = 50
    res = []
    # entity = " " + entity + " "
    for pair in [(m.start(), m.end()) for m in re.finditer(entity, sent, flags=re.IGNORECASE)]:
        start = max(0, pair[0] - window_char_size)
        end = min(len(sent) - 1, pair[1] + window_char_size)
        seg = "... " + sent[start:m.start()] + "<font color=\"red\">" + entity + "</font>" + sent[m.end()+1:end] + " ..."
        res.append(seg)
    if len(res) == 0:
        res.append(sent)
    return res



## This variable cache the previous network in near-json format
## Useful when we want to show the predicted relationships
# cached_previous_json_network = []
# cached_relation = ""
cached_json_and_relation = []

app = Flask(__name__)

@app.route('/network_exploration/get_relations', methods=['GET', 'POST'])
def get_relations():
    type_b = request.args.get('type_a').replace(' ', '_')
    type_a = request.args.get('type_b').replace(' ', '_')
    if 'entities_left' in request.args:
        entities_right = request.args.get('entities_left')
    else:
        entities_right = []
    if 'entities_right' in request.args:
        entities_left = request.args.get('entities_right')
    else:
        entities_left = []	
   
    tmp_utils = data_utils({'entity_table': 'entity_table', 'relation_table': 'relation_table'})
    res = tmp_utils.get_relations(type_a=type_a, type_b=type_b, entities_left=entities_left, entities_right=entities_right)
    response = app.response_class(
        response=json.dumps(res, ensure_ascii = False),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response 

@app.route('/network_exploration', methods=['GET','POST'])
def network_exploration():
    '''
    arg1: corresponds to type a (node_a)
    arg2: corresponds to type b (node_b)

    :return:
    '''
    # global cached_previous_json_network, cached_relation
    global cached_json_and_relation, sample_query_id

    type_b = request.args.get('type_a').replace(' ', '_')
    type_a = request.args.get('type_b').replace(' ', '_')
    relation_type = request.args.get('relation_type')
    if 'entities_left' in request.args:
	entities_right = request.args.get('entities_left')
    else:
	entities_right = []
    if 'entities_right' in request.args:
	entities_left = request.args.get('entities_right')
    else:
	entities_left = []
    '''
    if 'num_edges' in request.args:
    	num_edges = request.args.get('num_edges')
    else:
	num_edges = 5
    if 'num_pps' in request.args:
	num_pps = request.args.get('num_pps')
    else:
	num_pps = 1
    '''
    num_edges = 35
    num_pps = 5 
    print("Parameters in http request: ", type_a, type_a, relation_type, entities_left, entities_right, num_edges, num_pps)

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
    '''
    arg1_type = check_types(arg1)
    arg2_type = check_types(arg2)
    relation_type = check_types(relation)
    if FLAGS_DEBUG:
        print("[INFO] marshal returned types = ", (arg1_type, arg2_type, relation_type))
    if (arg1_type == "none" or arg2_type == "none" or relation_type == "none"):
        ## Return a placeholder response showing invalid query
        response = app.response_class(
            response=json.dumps(invalid_query_data, ensure_ascii = False),
            status=200,
            mimetype='application/json'
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    '''
    type_a = str({'name':'mesh', 'type':("{"+type_a+"}") })
    type_b = str({'name':'mesh', 'type':("{"+type_b+"}") })

    if sample_query_id == -1:
        res = tmp_utils.query_links_v2(type_a=type_a, type_b=type_b, relation_type=relation_type, entities_left=entities_left, entities_right=entities_right,
                                num_edges=int(num_edges), num_pps=int(num_pps))
    else:
        print("[INFO] load from dump query: ", sample_query_id)
        res = marshal.load(open("./data/dumped-query/"+str(sample_query_id)+".m","rb"))
        sample_query_id = -1 # reset
        print("[INFO] reset sample query_id")
    # res = tmp_utils.query_links(type_a=type_a, type_b=type_b, relation_type=relation_type, num_edges=number_of_edges)
    # res = tmp_utils.query_links_with_walk(type_a=type_a, type_b=type_b, relation_type=relation_type,
    #                             num_edges=number_of_edges, num_pps=number_of_papers)
    if FLAGS_DEBUG:
        print("[INFO] Complete querying DB")
    if (len(res['nodes']) == 0 and len(res['edges']) == 0):
        ## SQL returns empty, return the corresponding placeholder
        response = app.response_class(
            response=json.dumps({}, ensure_ascii = False),
            status=200,
            mimetype='application/json'
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if FLAGS_SAVE_DATA:
        with open("./db_res.txt", "w") as fout:
            fout.write(str(res))
            print("[DATA] DB output data:", res)
        with open("./db_res.txt", "r") as fin:
            raw_data = fin.read().strip()
            res = eval(raw_data)
    
    response = app.response_class(
        response=json.dumps(res, ensure_ascii = False),
        # response=json.dumps(sample_data_2, ensure_ascii = False),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response 
    '''
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
                data_docs_title = "Title:" + doc_info[0]
                data_docs_pmid = doc_info[2]
                data_docs_sents = seg_long_sent(doc_info[1], data_label) # front-end requires sentences send as a list

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
                data_docs_title = "Title:" + doc_info[0]
                data_docs_pmid = doc_info[2]
                data_docs_sents = seg_long_sent(doc_info[1], data_label) # front-end requires sentences send as a list

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

    ## Add edges
    for edge in res["edge"]:
        # edge is a dict {'article_title':xxx, 'sents':[{'article_title':xxx, 'sent': xxx}], 'pmid':xxx, 'source':xxx, 'target':xxx}
        data_source = "".join(edge["source"].split())
        data_target = "".join(edge["target"].split())
        data_doc = []
        for document in edge['sents']:
            data_doc_title = "Title:" + document['article_title']
            data_doc_pmid = document['pmid']
            data_doc_sentences = []
            data_doc_sentences.extend(seg_long_sent(document["sent"], edge["source"]))
            data_doc_sentences.extend(seg_long_sent(document["sent"], edge["target"]))
            data_doc.append({
                "title": data_doc_title,
                "pmid": data_doc_pmid,
                "sentences": data_doc_sentences
            })

        ## Reverse the edge direction
        data = {
            # "source": data_source,
            # "target": data_target,
            "source": data_target,
            "target": data_source,
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

    ## store the cache json_data for later relation prediction
    # cached_json_and_relation.clear() ## not applicable on python 2.7
    while (len(cached_json_and_relation) != 0):
        cached_json_and_relation.pop()
    cached_json_and_relation.append([json_data, relation])

    response = app.response_class(
        response=json.dumps(json_data, ensure_ascii = False),
        # response=json.dumps(sample_data_2, ensure_ascii = False),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
    '''
@app.route('/distinctive_summarization', methods=['GET','POST'])
def distinctive_summarization():
    if FLAGS_DEBUG:
        print(request.args)
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
        # response=json.dumps(sample_data, ensure_ascii = False),
        response=json.dumps(json_data, ensure_ascii = False),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/network_exploration_prediction', methods=['GET','POST'])
def network_exploration_prediction():
    global cached_json_and_relation
    print(request.args)
    if len(cached_json_and_relation) == 0:
        print("[ERROR] Wrong usage of predict relationship"
              "should provide previous networks and relation")
        json_data = []
    else:
        ## use a shallow list copy to avoid override the cached list
        ## json_data will be of the same format as the sample_data_2
        json_data = cached_json_and_relation[0][0][:]
        cached_relation = cached_json_and_relation[0][1]

        if FLAGS_DEBUG:
            print("json_data = ", json_data)
            print("cached_relation = ", cached_relation)
            print("[INFO] Start quering prediction DB table for relation prediction")

        ### First extract all candidate nodes from cached network
        node_a_list = []
        node_b_list = []
        existed_edges = set()

        for ele in json_data:
            if ele["group"] == "nodes":
                entity_name = ele["data"]["label"]
                if "classes" in ele.keys(): # type_b_node
                    node_b_list.append(entity_name)
                else:
                    node_a_list.append(entity_name)
            if ele["group"] == "edges":
                source_name = "".join(ele["data"]["source"].split())
                target_name = "".join(ele["data"]["target"].split())
                existed_edges.add((source_name, target_name))

        ### Second for all possible candidate pair (node_a, node_b), query DB for relation prediction
        tmp_utils = data_utils({'prediction_table': "prediction_table"})
        relation_type = cached_relation
        new_edge_cnt = 0
        # if FLAGS_DEBUG:
        #     print("[INFO] start testing each edge")
        #     print("[INFO] node_a_list = ", node_a_list)
        #     print("[INFO] node_b_list = ", node_b_list)
        for i in range(len(node_a_list)):
            for j in range(len(node_b_list)):
                name_a = node_a_list[i]
                name_b = node_b_list[j]
                if FLAGS_DEBUG:
                    print("[INFO] testing edge", (name_a, name_b))

                res = tmp_utils.query_prediction_v2(name_a=name_a, name_b=name_b, relation_type=relation_type)
                if (res['score'] >= 0.77):
                    print("Res = ", res)
                    source_label = "".join(name_a.split())
                    target_label = "".join(name_b.split())
                    ## do not add existed edges
                    if (target_label, source_label) in existed_edges:
                        continue
                    score = res['score']
                    if (len(res.keys()) == 1):
                        json_data.append({
                            "group": "edge",
                            "data": {
                                "source": target_label,
                                "target": source_label,
                                "docs": [{
                                    "title": "Confidence Score = " + str(score),
                                    "pmid": "#",
                                    "sentences": [""]
                                }]
                            },
                            "classes": "edge1"
                        })
                    else:
                        data_doc_sentences = []
                        data_doc_sentences.extend(seg_long_sent(res.get("sent",""), name_a))
                        data_doc_sentences.extend(seg_long_sent(res.get("sent",""), name_b))
                        json_data.append({
                            "group": "edge",
                            "data": {
                                # "source": source_label,
                                # "target": target_label,
                                "source": target_label,
                                "target": source_label,
                                "docs": [{
                                    ## Show the prediction confidence score as the paper title
                                    "title": "Confidence Score = " + str(score),
                                    "pmid": "#",
                                    "sentences": [""]
                                }, {
                                    "title": "Title: " + res.get("article_title",""),
                                    "pmid": res.get("pmid",""),
                                    "sentences": data_doc_sentences
                                }]
                            },
                            "classes": "edge1"
                        })
                    new_edge_cnt += 1

                # res = tmp_utils.query_prediction(name_a=name_a, name_b=name_b, relation_type=relation_type)
                # if res != 0: # one predicted relation, add a new edge
                #     source_label = "".join(name_a.split())
                #     target_label = "".join(name_b.split())
                #     score = res
                #     if (score < 0.79):
                #         continue
                #     ## do not add existed edges
                #     # if (source_label, target_label) in existed_edges:
                #     #     continue
                #     if (target_label, source_label) in existed_edges:
                #         continue
                #     json_data.append({
                #         "group": "edge",
                #         "data": {
                #             # "source": source_label,
                #             # "target": target_label,
                #             "source": target_label,
                #             "target": source_label,
                #             "docs": [{
                #                 ## Show the prediction confidence score as the paper title
                #                 "title": "Confidence Score = " + str(score),
                #                 "pmid": "#",
                #                 "sentences": [""]
                #             }]
                #         },
                #         "classes": "edge1"
                #     })
                #     new_edge_cnt += 1

        if FLAGS_DEBUG:
            print("[INFO] Complete quering prediction DB table for relation prediction")
            print("[INFO] Add %s new edges" % new_edge_cnt)


    response = app.response_class(
        # response=json.dumps(sample_data_2, ensure_ascii = False),
        response=json.dumps(json_data, ensure_ascii = False),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/distinctive_summarization/get_sample', methods=['GET','POST'])
def distinctive_summarization_get_sample():
    ## select a random query from QUERY_DB (defined in caseOLAP_sample_query.py)
    query_data = random.choice(QUERY_DB)
    if FLAGS_DEBUG:
        print("[INFO] query_data = ", query_data)
    response = app.response_class(
        # response=json.dumps(sample_data, ensure_ascii = False),
        response=json.dumps(query_data, ensure_ascii = False),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/network_exploration/get_sample', methods=['GET','POST'])
def network_exploration_get_sample():
    global sample_query_id
    if FLAGS_DEBUG:
        print("[INFO] Generate sample network exploration query")
    # sample_query_id = random.choice(range(len(QUERY_NET))) # save to sample query id
    # query_data = QUERY_NET[sample_query_id]
    query_data = random.choice(QUERY_NET)
    query_data["number_of_edges"] = 15
    query_data["number_of_papers"] = 6
    if FLAGS_DEBUG:
        print("[INFO] network visualization query_data = ", query_data)
    response = app.response_class(
        # response=json.dumps(sample_data, ensure_ascii = False),
        response=json.dumps(query_data, ensure_ascii = False),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run(host=FLAGS_HOST_ADDR, port = FLAGS_PORT, debug=FLAGS_DEBUG) # for server

