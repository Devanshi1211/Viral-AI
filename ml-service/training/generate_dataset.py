import pandas as pd
import numpy as np

np.random.seed(42)

base = pd.read_csv("ml-service/data/virality_dataset.csv")

rows = []

for _ in range(500):
    row = base.sample(1).iloc[0]

    likes = max(100, int(row["likes"] * np.random.uniform(0.7, 1.3)))
    comments = max(20, int(row["comments"] * np.random.uniform(0.7, 1.3)))
    shares = max(20, int(row["shares"] * np.random.uniform(0.7, 1.3)))
    watch_time = max(30, int(row["watchTime"] * np.random.uniform(0.8, 1.2)))
    caption_length = max(5, int(row["captionLength"] * np.random.uniform(0.7, 1.3)))
    hashtags = max(1, min(15, int(row["hashtagsCount"] + np.random.randint(-1, 2))))
    posting_hour = int(np.clip(row["postingHour"] + np.random.randint(-2, 3), 0, 23))
    engagement = max(1, row["engagementRate"] * np.random.uniform(0.8, 1.2))

    score = (
        0.20 * min(likes / 100, 100)
        + 0.20 * min(comments / 30, 100)
        + 0.25 * min(shares / 40, 100)
        + 0.15 * min(watch_time / 4, 100)
        + 0.15 * min(engagement * 5, 100)
        + 0.05 * min(hashtags * 7, 100)
    )

    score += np.random.normal(0, 3)
    score = float(np.clip(score, 20, 100))

    rows.append([
        likes,
        comments,
        shares,
        watch_time,
        caption_length,
        hashtags,
        posting_hour,
        round(engagement, 2),
        round(score, 2)
    ])

columns = [
    "likes",
    "comments",
    "shares",
    "watchTime",
    "captionLength",
    "hashtagsCount",
    "postingHour",
    "engagementRate",
    "viralityScore"
]

df = pd.DataFrame(rows, columns=columns)

df.to_csv("ml-service/data/virality_dataset_large.csv", index=False)

print("DATASET CREATED")
print("Samples:", len(df))
print("Features:", len(columns) - 1)
print("Saved: ml-service/data/virality_dataset_large.csv")
