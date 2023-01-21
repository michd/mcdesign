#!/bin/bash
# Deployment script for on my server
eval "$(rbenv init - )"
bundle install
touch tmp/restart.txt
