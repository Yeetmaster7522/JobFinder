from json import load, dump

workTypes = {
    1: "full-time",
    2: "part-time",
    3: "casual"
}

employmentTypes = {
    1: ""
}

with open("data-mR36NBv3VwjMRsFCY26z5.json", "r") as f:
    content = load(f)

print(content[0].keys())

for i in content:
    print(i["workType"])
    print(i["employmentType"])

# add array of timeranges for hours
data = ""

with open("data-mR36NBv3VwjMRsFCY26z5.json", "w") as f:
    dump(data, f)