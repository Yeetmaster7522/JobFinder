import json

filepath = "data/userAccounts.json"

with open(filepath, "r") as f:
    data = json.load(f)

# data = data * 1000
for x in range(0,1000):
    data[x] = {
        "email": "jane.doe@gmail.com",
        "password": "67",
        "role": "student",
        "profilePic": "",
        "student": {
            "name": "Jane Doe",
            "age": "20",
            "phoneNumber": "0401 234 567",
            "suburb": "Chatswood",
            "workEligibility": "Australian citizen",
            "availability": "",
            "experienceLevel": "College",
            "resume": {
                "source": "lskdajfl.asjdfl",
                "date": "10.04.22"
            },
            "preferences": {
                "workType": "onsite",
                "employmentType": "part-time",
                "minSalary": "10",
                "locationRadius": "5",
                "industries": [
                    "IT",
                    "customer service",
                    "fashion"
                ]
            },
            "skills": [
                "Naval Architecture", 
                "Emergency Nursing", 
                "Immigration Law", 
                "Art History"
            ],
            "certifications": [
                "first aid",
                "Python foundations"
            ],
            "timeIntervals": [
                { "start": "06:00", "end": "09:00" },
                { "start": "09:00", "end": "12:00" },
                { "start": "12:00", "end": "15:00" },
                { "start": "15:00", "end": "18:00" },
                { "start": "18:00", "end": "21:00" },
                { "start": "21:00", "end": "00:00" },
                { "start": "00:00", "end": "03:00" },
                { "start": "03:00", "end": "06:00" }
            ],
            "applications": [
            ]
        }
    }

with open(filepath, "w") as f:
    json.dump(data, f)