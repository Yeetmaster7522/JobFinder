import random
from datetime import datetime, timezone
import json

def random_js_date():
    start = datetime(2026, 5, 1, tzinfo=timezone.utc)
    end = datetime(2027, 12, 31, tzinfo=timezone.utc)

    rand_ts = random.randint(int(start.timestamp()), int(end.timestamp()))

    dt = datetime.fromtimestamp(rand_ts, tz=timezone.utc)

    iso_str = dt.isoformat()

    return iso_str

with open("public/database/jobPosts.json", "r") as f:
    data = json.load(f)

for post in data:
    post["datePosted"] = random_js_date()
    post["deadline"] = random_js_date()

with open("public/database/jobPosts.json", "w") as f:
    json.dump(data, f)