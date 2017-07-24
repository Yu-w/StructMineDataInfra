## KB Completion on PubMed

## Compile
To compile the codes, users may first modify the package paths in the script "make.sh", and then use the following command:
```
./make.sh
```

## Run
To run the pipeline, users may first modify the file paths in the script "run.sh", and then use the following command:
```
./run.sh
```

## Example Output
{"em2Label": "C3273290", "em1Label": "C1523368", "label": "gene_product_has_biochemical_function", "score": 0.818654, "em1Text": "t-cell mediated cytotoxicity", "em2Text": "caldag-gefii"}

"em1Text" and "em2Text" are the entity names. "label" is the relation name. "score" is the score of the fact.

## Result File
/data/mengqu2/pubmed-cotype-new/data_kbc.json
