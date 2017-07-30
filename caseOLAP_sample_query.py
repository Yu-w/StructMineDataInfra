'''
__author__: Jiaming Shen
__description__: Save the giant caseolap sample query
'''
## Add sample CaseOLAP query as following format
QUERY_DB = [
    {
        "targetEntityType": "Genetic_Phenomena",
        "outputEntityType": "MeSH:::Diseases",
        "relation": "disease_may_have_cytogenetic_abnormality",
        "targetEntitySubtypes": [
            "Ring_Chromosomes",
            "Philadelphia_Chromosome",
            "Chromosomes,_Human,_Pair_7",
            "Trisomy"
        ]
    },
    {
        "targetEntityType": "Chemical_Actions_and_Uses",
        "outputEntityType": "MeSH:::Chemicals_and_Drugs",
        "relation": "has_therapeutic_class",
        "targetEntitySubtypes": [
            "Antipsychotic_Agents",
            "Antifungal_Agents",
            "Antidepressive_Agents,_Second-Generation",
            "Antimalarials",
            "Anticonvulsants",
            "CCR5_Receptor_Antagonists",
            "Anti-Arrhythmia_Agents",
            "Antitreponemal_Agents"
        ]
    },
    {
        "targetEntityType": "Chromosomes,_Human",
        "outputEntityType": "MeSH:::Diseases",
        "relation": "disease_mapped_to_chromosome",
        "targetEntitySubtypes": [
            "Chromosomes,_Human,_Pair_11",
            "Philadelphia_Chromosome",
            "Chromosomes,_Human,_Pair_16",
            "Chromosomes,_Human,_Pair_17"
        ]
    },
    {
        "targetEntityType": "Pharmacologic_Actions",
        "outputEntityType": "Pharmacologic_Substance",
        "relation": "has_mechanism_of_action",
        "targetEntitySubtypes": [
            "Serotonin_Uptake_Inhibitors",
            "HIV_Protease_Inhibitors",
            "Adrenergic_alpha-1_Receptor_Antagonists"
        ]
    }
]
