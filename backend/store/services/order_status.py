ALLOWED_TRANSITIONS = {
    "new": ["paid", "canceled"],
    "paid": ["processing", "canceled", "refunded"],
    "processing": ["shipped", "refunded"],
    "shipped": ["completed"],
    "completed": [],
    "canceled": [],
}


def can_change_status(from_status, to_status):
    return to_status in ALLOWED_TRANSITIONS.get(from_status, [])

def mark_order_paid(order):
    from django.core.exceptions import ValidationError

    if not can_change_status(order.status, "paid"):
        raise ValidationError("Недопустимый переход статуса")

    order.status = "paid"
    order.save()

def can_cancel_order(order):
    return order.status in ["new"]
