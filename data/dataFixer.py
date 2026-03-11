from json import load, dump
from random import randint

# to help replace things
workTypes = {
    1: "onsite",
    2: "remote",
    3: "hybrid"
}

employmentTypes = {
    1: "full-time",
    2: "part-time",
    3: "casual"
}

def generateRandTime():
    """
    Generates a random time in format
    hr:min
    """
    
    hr = randint(9,17)
    minute = randint(0,59)

    return f"{hr}:{minute}"

# load data
with open("data-mR36NBv3VwjMRsFCY26z5.json", "r") as f:
    jobPosts = load(f)

print(jobPosts[0].keys()) # check program is working

# replace numerical values that are supposed to be words
# and append hours
for post in jobPosts:
    workType = post["workType"]
    employType = post["employmentType"]
    
    # work type replacement
    post["workType"] = workTypes[workType]

    # employment type replacement
    post["employmentType"] = employmentTypes[employType]

    # add array of timeranges for hours
    hours = []
    days = randint(1,5)
    for d in range(days):
        hours.append([generateRandTime(), generateRandTime()])
    post["hours"] = hours

# write changes
with open("data-mR36NBv3VwjMRsFCY26z5.json", "w") as f:
    dump(jobPosts, f)

# check changes
with open("data-mR36NBv3VwjMRsFCY26z5.json", "r") as f:
    jobPosts = load(f)
    print(jobPosts)