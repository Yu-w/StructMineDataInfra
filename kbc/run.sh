#!/bin/sh

name2cui_file="/shared/data/mengqu2/umls/name2cui.txt"
name2go_file="/shared/data/mengqu2/cotype-fmt/goname2gocui.txt"
name2stop_file="/shared/data/mengqu2/cotype-fmt/stopwords.txt"
text_file="/shared/data/mengqu2/cotype-fmt/corpus_final.txt"
python ds-kbc.py ${name2cui_file} ${name2go_file} ${text_file} text_mapping.txt vocab.txt ${name2stop_file}

./data2net -train text_mapping.txt -output net.txt -debug 2 -window 5 -min-count 20

data_file="/shared/data/mengqu2/cotype-fmt/data_final.json"
python generate_facts.py ${data_file} facts.txt

python generate_vocab_for_kbc.py net.txt vocab_kbc.txt
python generate_relation_for_kbc.py facts.txt relation_kbc.txt

./embed -train vocab.txt -output vec.emb -debug 2 -binary 1 -size 100 -order 3 -negative 5 -samples 30000 -threads 30
./select -vocab vocab_kbc.txt -vector vec.emb -output vec.sel -debug 2 -binary 1
./infer -train facts.txt -infer facts.txt -output out.txt -entity vec.sel -threads 30 -k-max 10 -filter 0

result_file="result.txt"
python generate_result.py vocab.txt out.txt ${result_file}
