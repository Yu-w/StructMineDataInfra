'''
__author__: Jiaming Shen
__description__: Save the giant caseolap sample query
'''
## Add sample CaseOLAP query as following format
QUERY_DB = [
    {
        "targetEntityType": "MeSH:::Phenomena_and_Processes::Genetic_Phenomena::Genetic_Structures::Chromosomes",
        "outputEntityType": "Nucleotide_Sequence",
        "relation": "anatomic_structure_is_physical_part_of",
        "targetEntitySubtypes": [
            "Chromosomes,_Archaeal",
            "Chromosomes,_Mammalian::Chromosomes,_Human::Chromosomes,_Human,_6-12_and_X::Chromosomes,_Human,_Pair_7"
        ]
    },
    {
        "targetEntityType": "MeSH:::Phenomena_and_Processes::Genetic_Phenomena::Genetic_Structures::Genome::Genome_Components::Genes",
        "outputEntityType": "MeSH:::Diseases",
        "relation": "process_involves_gene",
        "targetEntitySubtypes": [
            "Genes,_Neoplasm::Genes,_Tumor_Suppressor::Genes,_APC",
            "Genes,_Neoplasm::Oncogenes::Proto-Oncogenes::Genes,_jun",
            "Genes,_Neoplasm::Oncogenes::Proto-Oncogenes::Genes,_abl",
            "Genes,_Neoplasm::Oncogenes::Proto-Oncogenes::Genes,_src",
            "Genes,_Recessive::Genes,_Tumor_Suppressor::Genes,_APC",
            "Genes,_Neoplasm::Oncogenes::Proto-Oncogenes::Genes,_ras",
            "Genes,_Neoplasm::Oncogenes::Proto-Oncogenes::Genes,_myb",
            "Genes,_Neoplasm::Oncogenes::Proto-Oncogenes::Genes,_erbB::Genes,_erbB-1",
            "Genes,_Neoplasm::Oncogenes::Proto-Oncogenes::Genes,_fos",
            "Genes,_Neoplasm::Oncogenes::Proto-Oncogenes::Genes,_myc"
        ]
    },
    {
        "targetEntityType": "MeSH:::Phenomena_and_Processes::Genetic_Phenomena::Genetic_Structures::Chromosomes::Chromosomes,_Mammalian::Chromosomes,_Human",
        "outputEntityType": "MeSH:::Diseases",
        "relation": "disease_mapped_to_chromosome",
        "targetEntitySubtypes": [
            "Chromosomes,_Human,_6-12_and_X::Chromosomes,_Human,_Pair_10",
            "Chromosomes,_Human,_6-12_and_X::Chromosomes,_Human,_Pair_11",
            "Chromosomes,_Human,_6-12_and_X::Chromosomes,_Human,_Pair_12",
            "Chromosomes,_Human,_13-15::Chromosomes,_Human,_Pair_13",
            "Chromosomes,_Human,_6-12_and_X::Chromosomes,_Human,_Pair_8",
            "Chromosomes,_Human,_1-3::Chromosomes,_Human,_Pair_3",
            "Chromosomes,_Human,_21-22_and_Y::Chromosomes,_Human,_Pair_22::Philadelphia_Chromosome",
            "Chromosomes,_Human,_4-5::Chromosomes,_Human,_Pair_5",
            "Chromosomes,_Human,_16-18::Chromosomes,_Human,_Pair_17",
            "Chromosomes,_Human,_16-18::Chromosomes,_Human,_Pair_16"
        ]
    },
    {
        "targetEntityType": "MeSH:::Anatomy::Nervous_System::Peripheral_Nervous_System::Peripheral_Nerves",
        "outputEntityType": "MeSH:::Anatomy",
        "relation": "has_nerve_supply",
        "targetEntitySubtypes": [
            "Cranial_Nerves::Trochlear_Nerve",
            "Autonomic_Pathways::Celiac_Plexus",
            "Autonomic_Pathways::Hypogastric_Plexus"
        ]
    },
    {
        "targetEntityType": "MeSH:::Anatomy::Cardiovascular_System::Blood_Vessels",
        "outputEntityType": "MeSH:::Anatomy",
        "relation": "has_arterial_supply",
        "targetEntitySubtypes": [
            "Veins::Coronary_Vessels::Coronary_Sinus",
            "Arteries::Renal_Artery",
            "Arteries::Bronchial_Arteries"
        ]
    },
    {
        "targetEntityType": "MeSH:::Anatomy::Cardiovascular_System::Blood_Vessels::Veins",
        "outputEntityType": "MeSH:::Anatomy",
        "relation": "has_venous_drainage",
        "targetEntitySubtypes": [
            "Cranial_Sinuses::Cavernous_Sinus",
            "Coronary_Vessels::Coronary_Sinus",
            "Renal_Veins"
        ]
    }
]