import json
import random

with open("data/jobPosts (OLD).json", "r") as f:
    data = json.load(f)

for post in data:
    post["ID"] = random.randint(100000, 999999)


with open("data/jobPosts.json", "w") as f:
    json.dump(data, f)