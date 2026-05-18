from json import load, dump
from pandas import read_csv

df = read_csv("Job Finder/JobFinder/data/articles.csv")

df.to_json("Job Finder/JobFinder/data/articles.json", orient="records")

# check changes
with open("Job Finder/JobFinder/data/articles.json", "r") as f:
    data = load(f)
    print(data[0])