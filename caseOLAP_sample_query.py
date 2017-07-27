'''
__author__: Jiaming Shen
__description__: Save the giant caseolap sample query
'''
## Add sample CaseOLAP query as following format
QUERY_DB = [
    {
        "targetEntityType": "MeSH:::Phenomena_and_Processes::Genetic_Phenomena::Genetic_Structures::Chromosomes",
        "outputEntityType": "Nucleotide_Sequence", "relation": "anatomic_structure_is_physical_part_of",
        "targetEntitySubtypes": ["Chromosomes,_Archaeal","Chromosomes,_Mammalian::Chromosomes,_Human::Chromosomes,_Human,_6-12_and_X::Chromosomes,_Human,_Pair_7"]
    }
]
