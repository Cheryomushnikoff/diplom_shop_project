from django import forms
from django.core.exceptions import ValidationError

from store.models import Order
from store.services.order_status import can_change_status


class OrderAdminForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        if not self.instance.pk:
            return cleaned_data  # новый заказ — пропускаем

        old = Order.objects.get(pk=self.instance.pk)
        new_status = cleaned_data.get("status")

        if new_status and not can_change_status(old.status, new_status):
            raise ValidationError(
                f"Нельзя изменить статус с «{old.get_status_display()}» "
                f"на «{self.instance.get_status_display()}»"
            )

        return cleaned_data
