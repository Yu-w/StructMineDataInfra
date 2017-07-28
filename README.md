This is the repo for LifeNet system. 

## Notice

1. Under Network Visualization page, you must first run the "Show Relationships" and then run the "Show predicted relationship" buttom
2. If you want to issue multiple queries in Network Visualization page, please either refresh the page or switch to Distinctive Summarization page and then switch back. This can make sure the AngularJS will reload the data



### How to run locally

1. Change the server address in ./angularJS-front/app/js/controllers/<XXX>.js
2. Change the FLAGS_HOST_ADDR in ./config.py


### How to run

#### Front-end part

Install node and python virtualenv first. 

Start AngularJs front-end

```
$ cd ./angularJS-front
$ npm install (only for the first time)
$ npm start  
```

Start Flask (open a separated terminal)
```
$ // cd back to the root directory (where this README.md resides)
$ source venv/bin/active
$ python app.py
```

Open browser and go to **http://localhost:8080/index.html**

#### Backend Database

Please follow the README in ./db directory.

#### Note:

On the server version, the js controller in angularJS send request to 192.XXX address and
the Flask should start on 192.XXX address.


## Usage

### Network Visualization

Query-1
Argument1: Chemicals_and_Drugs
Argument2: Anatomy
Relation: is_associated_anatomy_of_gene_product

Query-2
Argument1: Nervous_System
Argument2: Anatomy
Relation: has_nerve_supply

More queries
Genes Diseases process_involve
Proteins Phenomena_and_Processes is_associated_anatomy_of_gene_product
Chromosomes Diseases cytogenetic_abnormality_involves_chromosome
Proteins Diseases biological_process_involves_gene_product

### CaseOLAP

Target Entity Type:
MeSH:::Phenomena_and_Processes::Genetic_Phenomena::Genetic_Structures::Chromosomes

Output Entity Type:
Nucleotide_Sequence

Relation:
anatomic_structure_is_physical_part_of

Target Entity Subtypes:
Chromosomes,_Archaeal
Chromosomes,_Mammalian::Chromosomes,_Human::Chromosomes,_Human,_6-12_and_X::Chromosomes,_Human,_Pair_7