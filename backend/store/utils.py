from .models import OrderItem, Review


def user_paid_review(user, product):
    if not user.is_authenticated:
        print('упс')
        return False
    print(OrderItem.objects.filter(
        order__user=user,
        order__status__in=["paid", "completed"],
        product=product,
    ).exists())

    return OrderItem.objects.filter(
        order__user=user,
        order__status__in=["paid", "completed"],
        product=product,
    ).exists()

def user_retry_review(user, product):
    if not user.is_authenticated:
        return False

    return Review.objects.filter(
        user=user,
        product=product
    ).exists()


