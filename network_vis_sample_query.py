'''
__author__: Jiaming Shen
__description__: Save the network visualization sample query
'''
## Add sample network visualization query as following format
QUERY_NET = [
    {
        "argument1": "Chemicals_and_Drugs",
        "argument2": "Anatomy",
        "relation": "is_associated_anatomy_of_gene_product"
    },
    {
        "argument1": "Genetic_Phenomena",
        "argument2": "Diseases",
        "relation": "disease_may_have_cytogenetic_abnormality"
    },
    {
        "argument1": "Peripheral_Nerves",
        "argument2": "Anatomy",
        "relation": "has_nerve_supply"
    },
    {
        "argument1": "Chromosomes",
        "argument2": "Diseases",
        "relation": "cytogenetic_abnormality_involves_chromosome"
    }
]
