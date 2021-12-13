#!/bin/sh

if [ -f .nvmrc ] && [ -d ~/.nvm ]
    then
        source ~/.nvm/nvm.sh
        nvm use || (nvm install && nvm use)
else
    echo -e "\e[33mPlease use NodeJS version: \e[0m"
    cat .nvmrc
    exit 1
fi