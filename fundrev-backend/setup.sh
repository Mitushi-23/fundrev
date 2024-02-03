#!/bin/bash

# Create a virtual environment named 'venv'
python -m venv env

# Activate the virtual environment
source env/bin/activate

# Install dependencies from requirements.txt
pip install -r requirements.txt
