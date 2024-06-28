#!/bin/bash
# Deployment script for on my server
export RBENV_ROOT=/usr/local/rbenv/bin
export PATH="$RBENV_ROOT/bin:$PATH"
eval "$(rbenv init - )"
bundle install
touch tmp/restart.txt
