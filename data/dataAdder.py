from json import load, dump
from pandas import read_csv
import random as rd

#RNG to determine index i and j of skills/industries
def returnRandomSubList(array):
    i = rd.randint(0, len(array))
    j = rd.randint(i, len(array))
    
    return array[i:j]

df = read_csv("Job Finder/JobFinder/data/skills_industries.csv")

skills = df["Skills"].tolist()[:100]
industries = df["Industry"].tolist()[:100]

with open("Job Finder/JobFinder/data/data-mR36NBv3VwjMRsFCY26z5.json", "r") as f:
    jobPosts = load(f)

print(jobPosts[0].keys())

i = 0
for post in jobPosts:
    post["skills"] = returnRandomSubList(skills)
    post["industry"] = industries[rd.randint(0,len(industries)-1)]

with open("Job Finder/JobFinder/data/data-mR36NBv3VwjMRsFCY26z5.json", "w") as f:
    dump(jobPosts, f)

# check changes
with open("Job Finder/JobFinder/data/data-mR36NBv3VwjMRsFCY26z5.json", "r") as f:
    jobPosts = load(f)
    print(jobPosts)