#!/bin/sh

eigen_path="/home/mengqu2/software/eigen-3.2.5"
gsl_include_path="/usr/local/include"
gsl_lib_path="/usr/local/lib"

g++ -lm -pthread -Ofast -march=native -Wall -funroll-loops -ffast-math -Wno-unused-result -I${eigen_path} -I${gsl_include_path} -L${gsl_lib_path} ransampl.h ransampl.c embed.cpp -o embed
g++ -O2 data2net.cpp -o data2net
g++ -O2 -I${eigen_path} infer.cpp -o infer -lpthread
g++ -O2 select.cpp -o select
