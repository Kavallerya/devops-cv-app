from prometheus_client import Counter

VISITOR_COUNT = Counter(
    "cv_visitors_total",
    "Total number of unique CV visitors",
)
