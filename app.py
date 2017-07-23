'''
__author__: Jiaming Shen
__description__: the middleaware to connect DB and front-end system
'''
from flask import Flask, render_template, url_for, request, json, redirect, jsonify
import json
import datetime
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

sample_data_2 = [
    {
        "group": 'nodes',
        "data": {
            "id": 'EndocardialFibroelastosis',
            "label":'Endocardial Fibroelastosis'
        },
        "selectable": True,
        "grabbable": True
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
    type_a = str({'name':'mesh', 'type':("{"+arg1+"}") })
    type_b = str({'name':'mesh', 'type':("{"+arg2+"}") })
    relation_type = relation
    res = tmp_utils.query_links(type_a=type_a, type_b=type_b, relation_type=relation_type)
    if FLAGS_DEBUG:
        print("[INFO] Complete querying DB")

    # for k,v in res.items():
    #     print("Key = ", k)
    #     print("Value = ", v)
    #     print("="*40)



    response = app.response_class(
        response=json.dumps(sample_data_2),
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
    targetEntSubtypes = request.args.get('targetEntitySubtypes')
    print(targetEntType, outputEntType, relation, targetEntSubtypes)

    response = app.response_class(
        response=json.dumps(sample_data),
        status=200,
        mimetype='application/json'
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
    # return "Hello World!!"
    # return render_template('data/sample.json')


if __name__ == '__main__':
    # app.run(debug=True) # for local testing
    app.run(host=FLAGS_HOST_ADDR, port = FLAGS_PORT, debug=FLAGS_DEBUG) # for server

