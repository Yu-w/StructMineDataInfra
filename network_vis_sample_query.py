'''
__author__: Jiaming Shen
__description__: Save the network visualization sample query
'''
import marshal
from db.db_utils import data_utils
## Add sample network visualization query as following format
QUERY_NET = [
    {
        'argument1': 'Chromosomes',
        'argument2': 'Diseases',
        'relation': 'cytogenetic_abnormality_involves_chromosome'
    },
    {
        'argument1': 'Peripheral_Nerves',
        'argument2': 'Anatomy',
        'relation': 'has_nerve_supply'
    },
    {
        'argument1': 'Veins',
        'argument2': 'Anatomy',
        'relation': 'has_venous_drainage'
    },
    {
        'argument1': 'Proteins',
        'argument2': 'Psychiatry_and_Psychology',
        'relation': 'associated_with_malfunction_of_gene_product'
    },
    {
        'argument1': 'Antifungal_Agents',
        'argument2': 'Chemicals_and_Drugs',
        'relation': 'has_therapeutic_class'
    },
    {
        'argument1': 'Genetic_Phenomena',
        'argument2': 'Diseases',
        'relation': 'disease_may_have_cytogenetic_abnormality'
    },
    {
        'argument1': 'Chemical_Actions_and_Uses',
        'argument2': 'Chemicals_and_Drugs',
        'relation': 'has_therapeutic_class'
    },
    {
        'argument1': 'Hematologic_Diseases',
        'argument2': 'Phenomena_and_Processes',
        'relation': 'is_not_cytogenetic_abnormality_of_disease'
    },
    {
        "argument1": "Anti-Arrhythmia_Agents",
        "argument2": "Chemicals_and_Drugs",
        "relation": "has_therapeutic_class"
    },
    {
        "argument1": "Genetic_Variation",
        "argument2": "Diseases",
        "relation": "disease_may_have_cytogenetic_abnormality"
    },
    {
        "argument1": "Lymphoproliferative_Disorders",
        "argument2": "Anatomy",
        "relation": "is_not_abnormal_cell_of_disease"
    }
]
if __name__ == '__main__':
    out_dir='dumped-query/'
    types = marshal.load(open('all_types.m', 'rb'))
    tmp_utils = data_utils({'entity_table': 'entity_table', 'relation_table': 'relation_table'})
    for i,query in enumerate(QUERY_NET):
        arg1={'name':'umls','type':'{'+query['argument1']+'}'}
        arg2={'name':'umls','type':'{'+query['argument2']+'}'}
        if query['argument1'] in types['mesh']:
            arg1['name']='mesh'
        if query['argument2'] in types['mesh']:
            arg2['name']='mesh'
        
        result = tmp_utils.query_links(type_a=arg1, type_b=arg2, relation_type=query['relation'], num_edges=15, num_pps=6)
        marshal.dump(result, open(out_dir+str(i)+'.m','wb'))
        print "processing",i

