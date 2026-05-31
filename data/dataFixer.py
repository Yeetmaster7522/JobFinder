import json
import random

with open("data/applications2.json", "r") as f:
    data = json.load(f)

statuses = [
    "submitted",
    "in review",
    "offered",
    "rejected"
]

for x in data:
    x["UID"] = f"UID{random.randint(10,9999)}"
    if x["status"] > 4:
        x["status"] = 4
    x["status"] = statuses[x["status"]-1]

with open("data/applications2_edit.json", "w") as f:
    json.dump(data, f)