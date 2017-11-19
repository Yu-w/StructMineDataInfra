## OS X Environment Set up

brew install postgresql
pg_ctl -D /usr/local/var/postgres start && brew services start postgresql

postgres=> CREATE ROLE structnet WITH LOGIN PASSWORD 'structnet';
postgres=> ALTER ROLE structnet CREATEDB;

psql postgres -U structnet
postgres=> CREATE DATABASE structnet;

psql structnet -U structnet # connect DB

create two tables in #TABLE_SCHEMA
insert records in #INSERT_RECORDS via python scripts

### TABLE_SCHEMA
CREATE TABLE entity_table (
    article_id integer,
    sent_id integer,
    pmid char(8),
    entity_name text,
    sent text,
    article_title text
);

CREATE TABLE relation_table (
    entity_a text,
    entity_b text,
    relation_type text,
    a_is_gene boolean,
    b_is_gene boolean,
    type_a_umls text[],
    type_b_umls text[],
    type_a_mesh text[],
    type_b_mesh text[],
    article_id integer,
    sent_id integer
);

CREATE TABLE prediction_table (
    entity_a text,
    entity_b text,
    relation_type text,
    score real
);

CREATE TABLE query_table (
    target_type text,
    output_types text[],
    relation_type text,
    index integer
);

CREATE TABLE caseolap_table (
    doc_id integer,
    sub_type text,
    entity text,
    score real
);

pip install PyGreSQL
pip install ast


### INSERT_RECORDS
python db/db_utils.py /data/mengqu2/pubmed-cotype-new/split_data/data_finalaa entity_table relation_table /shared/data/qiz3/StructMineDataInfra/final_pmid_dict.m &

### INDEXS
ENTITY TABLE:
Indexes:
    "entity_table_entity_name_idx" btree (entity_name)
    "entity_table_sent_id_idx" btree (sent_id)
RELATION TABLE:
Indexes:
    "relation_table_relation_type_idx" btree (relation_type)
    "relation_table_type_a_mesh_idx" gin (type_a_mesh)
    "relation_table_type_b_mesh_idx" gin (type_b_mesh)


## Example Usage on dmserv4
source /shared/data/qiz3/qiz3/bin/activate
Params: db_utils.py entity_table relation_table type_a type_b relation_type
Current settings:
Return 5 node_a, 5 node_b, each edge return one (article,sent), each node return two (article,sent)
type_a/type_b format: {'name':mesh/umls, 'type':sub_type}

### Query Network
*BOTTLE NECK:select distict article for each node, for some queries like "bone marrow", it can be really slow, more than 63642 records
python db/db_utils.py query network entity_table relation_table "{'name':'mesh', 'type':'{Chemicals_and_Drugs}'}" "{'name':'mesh', 'type':'{Anatomy}'}" is_associated_anatomy_of_gene_product 5 2
### Query with walk
python db/db_utils.py query connected_network entity_table relation_table "{'name':'mesh', 'type':'{Chemicals_and_Drugs}'}" "{'name':'mesh', 'type':'{Anatomy}'}" is_associated_anatomy_of_gene_product 5 2

### Query predictions
**version 1: query_prediction**
**return positive float or 0, represents if there is a edge or not with score**

python db/db_utils.py query predict prediction_table 'telomere maintenance' 'transcriptional regulation' is_location_of_biological_process

**version 2： query_prediction_v2**
**return a dictionary {'score':xxx} if xxx!=0, it will be like {'score':0.78,'article_title':xxx,'pmid':xxx,'sent':xxxx}**

### Query caseolap
#### Run two queries
**return list of list of dict, order by score and trucated by param [[(sub_type_1){'entity':xxxx, 'score':0.67},{},{}],[(sub_type_2)]]**
e.g.[[{'entity': 'yp'}, {'entity': 'chromosome 11 short arm'}, {'entity': 'chromosome 6 long arm'}, {'entity': 'chromosome 3 short arm'}, {'entity': 'chromosome 2 short arm'}, {'entity': 'chromosome 8 short arm'}, {'entity': 'chromosome x short arm'}, {'entity': 'chromosome 1 long arm'}], [{'entity': 'chromosome 7 short arm'}, {'entity': 'chromosome 7 long arm'}, {'entity': 'chromosome 7q'}, {'entity': '7q'}]]
usage: python db/db_util.py query caseolap caseolap_table target_type output_types relation_type sub_types
python db/db_utils.py query caseolap caseolap_table  MeSH:::Phenomena_and_Processes::Genetic_Phenomena::Genetic_Structures::Chromosomes "{Nucleotide_Sequence}" anatomic_structure_is_physical_part_of "['Chromosomes,_Archaeal','Chromosomes,_Mammalian::Chromosomes,_Human::Chromosomes,_Human,_6-12_and_X::Chromosomes,_Human,_Pair_7']"


Outputs: dict with 'node_a','node_b','edge'
key:'node_a'/'node_b' value:list of triplet (article_title,sentence,pmid)
key:'edge' value: list of dict {'sent':['article_title':xxx, 'sent':xxx, 'pmid':xxx] 'source':xxx, 'target':xxx}

## API for Exploration
All the functions related to database accessing are included in db/db_utils.py. To do exploration, first import db_util and then initiate a data_utils instance:
~~~~
import db_utils
tmp_utils = data_utils({‘entity_table’: ‘entity_table’, ‘relation_table’: ‘relation_table’})
~~~~
then, call **query_links_v2()**.

Function **query_links_v2()** has 7 paramters: 
1. *type_a*: the left category, which has the format of {'name': 'mesh', 'type':'{left category}'};
2. *type_b*: the right category, which has the format of {'name': 'mesh', 'type':'{right category}'};
3. *relation_type*: the relation type, which should be a string;
4. *entities_left*: the left entities (optional parameter, default value is an empty array []), which should be a string array;
5. *entities_right*: the right entities (optional parameter, default value is an empty array []), which should be a string array;
6. *num_edges*: maximum number of edges (optional parameter, default value is 5);
7. *num_pps*: maximum number of article sentences retrived from one node/edge (optional parameter, default value is 1)

An example would be:
~~~~
tmp_utils.query_links_v2(
	type_a={‘name’:‘mesh’, ‘type’:‘{Chemicals_and_Drugs}’}, 
	type_b={‘name’:‘mesh’, ‘type’:‘{Anatomy}’}, 
	entities_left=[‘fgf-r’, ‘amino acid transporters’], 
	entities_right=[‘plasma membrane’, ‘cell membranes’],
	relation_type=“is_associated_anatomy_of_gene_product”)
~~~~

This will do exploration based on the given two sides entities and the relation type. The returned nodes will be exactly the same as the given entities and the edge will be the given relation.

If *entities_left* or *entities_right* is empty, like:
~~~~
tmp_utils.query_links_v2(
	type_a={‘name’:‘mesh’, ‘type’:‘{Chemicals_and_Drugs}’}, 
	type_b={‘name’:‘mesh’, ‘type’:‘{Anatomy}’}, 
	entities_left=[‘fgf-r’, ‘amino acid transporters’])
~~~~
This will do exploration based on a category, one side entities (left category and right entities in this case) and a relation.

If both *entities_left* and *entities_right* are not given, like:
~~~~
tmp_utils.query_links_v2(
	type_a={‘name’:‘mesh’, ‘type’:‘{Chemicals_and_Drugs}’}, 
	type_b={‘name’:‘mesh’, ‘type’:‘{Anatomy}’})
~~~~
This will do exploration based on two categories.

The return value is a Python dictionary. It has the format of:
~~~~
{
    'nodes':[
        {
            'sents':[
                {'pmid':pmid, 'sent': sentence, 'article_title':title},
                ...
            ],
            'group': 1 or 2,
            'name': node_name
        },
        ...
    ],
    'edges':[
        {
            'sents':[
                {'article_title':article_title, 'pmid': pmid, 'sent': sentence},
                ...
            ],
            'sids':sids,
            'source':left entity,
            'target':right entity
        }
        ...
    ]
}
~~~~
An example would be:
~~~~
{
  "nodes": [
    {
      "sents": [
        {
          "pmid": "26169495",
          "artitle_title": "Expression of pre-selected TMEMs with predicted ER localization as potential classifiers of ccRCC tumors",
          "sent": "TMEM116 showed tertiary structure similarity to human B2-adrenergic G protein-coupled receptor -LRB- GPCR -RRB- and human A2A adenosine receptor , found functionally deregulated in other cancer types and associated with tumor invasiveness and evasion of immune system -LSB- 62 64 -RSB- ."
        }
      ],
      "group": 1,
      "name": "adenosine receptor"
    },
    {
      "sents": [
        {
          "pmid": "26936605",
          "artitle_title": "C1q-targeted inhibition of the classical complement pathway prevents injury in a novel mouse model of acute motor axonal neuropathy",
          "sent": "As GM1 is present on the kranocyte , a parajunctional fibroblast that caps the motor nerve terminal in rodents -LSB- 4 -RSB- and in Schwann cell membranes , binding and injury to these sites may confound rigorous interpretation of data , in comparison with wild type mice ."
        }
      ],
      "group": 2,
      "name": "cell membranes"
    }
  ],
  "edges": [
    {
      "sents": [
        {
          "article_title": "Adenosine A1 receptors and erythropoietin production.",
          "pmid": "8238318 ",
          "sent": "On the other hand , 2 - -LSB- p - -LRB- 2-carboxyethyl -RRB- phenethyl-amino -RSB- -5 ' - N-ethylcarboxamidoadenosine -LRB- CGS-21680 -RRB- , a selective adenosine A2-receptor agonist , produced no significant change in EPO production in a dose range of 10 -LRB- -10 -RRB- to 10 -LRB- -6 -RRB- M but increased cAMP accumulation at 10 -LRB- -6 -RRB- M. A1-receptor binding assays using N6 - -LSB- 3H -RSB- cyclohexyladenosine revealed a single type of adenosine receptor binding site on Hep G2 cell membranes with a dissociation constant of 71.4 nM and a binding capacity of 1,530 fmol/mg protein ."
        }
      ],
      "source": "adenosine receptor",
      "sids": [
        "25102760",
        "15766396"
      ],
      "target": "cell membranes"
    }
  ]
}
~~~~