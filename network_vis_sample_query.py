'''
__author__: Jiaming Shen
__description__: Save the network visualization sample query
'''
## Add sample network visualization query as following format
QUERY_NET = [
    {
        "argument2": "Chromosomes",
        "argument1": "Diseases",
        "relation": "cytogenetic_abnormality_involves_chromosome"
    },
    {
        "argument2": "Peripheral_Nerves",
        "argument1": "Anatomy",
        "relation": "has_nerve_supply"
    },
    {
        "argument2": "Veins",
        "argument1": "Anatomy",
        "relation": "has_venous_drainage"
    },
    {
        "argument2": "Proteins",
        "argument1": "Psychiatry_and_Psychology",
        "relation": "associated_with_malfunction_of_gene_product"
    },
    {
        "argument2": "Antifungal_Agents",
        "argument1": "Chemicals_and_Drugs",
        "relation": "has_therapeutic_class"
    },
    {
        "argument2": "Genetic_Phenomena",
        "argument1": "Diseases",
        "relation": "disease_may_have_cytogenetic_abnormality"
    },
    {
        "argument2": "Chemical_Actions_and_Uses",
        "argument1": "Chemicals_and_Drugs",
        "relation": "has_therapeutic_class"
    },
    {
        "argument2": "Hematologic_Diseases",
        "argument1": "Phenomena_and_Processes",
        "relation": "is_not_cytogenetic_abnormality_of_disease"
    },
    {
        "argument2": "Anti-Arrhythmia_Agents",
        "argument1": "Chemicals_and_Drugs",
        "relation": "has_therapeutic_class"
    },
    {
        "argument2": "Genetic_Variation",
        "argument1": "Diseases",
        "relation": "disease_may_have_cytogenetic_abnormality"
    },
    {
        "argument2": "Lymphoproliferative_Disorders",
        "argument1": "Anatomy",
        "relation": "is_not_abnormal_cell_of_disease"
    }
]
