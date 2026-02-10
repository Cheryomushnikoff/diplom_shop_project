ALLOWED_TRANSITIONS = {
    "new": ["paid", "canceled"],
    "paid": ["processing", "canceled"],
    "processing": ["shipped"],
    "shipped": ["completed"],
    "completed": [],
    "canceled": [],
}


def can_change_status(from_status, to_status):
    return to_status in ALLOWED_TRANSITIONS.get(from_status, [])