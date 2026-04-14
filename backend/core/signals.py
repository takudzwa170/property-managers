from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import MaintenanceRequest, AuditLog, Notification

@receiver(pre_save, sender=MaintenanceRequest)
def track_history(sender, instance, **kwargs):
    if instance.pk:
        # Get existing object
        previous = MaintenanceRequest.objects.get(pk=instance.pk)
        
        # Track Status Change
        if previous.status != instance.status:
            AuditLog.objects.create(
                request=instance,
                action="Status Updated",
                previous_value=previous.status,
                new_value=instance.status,
                # changed_by will be handled in the ViewSet if possible
            )
            # Create notification for resident
            Notification.objects.create(
                user=instance.created_by,
                message=f"Status of '{instance.title}' updated to {instance.status}"
            )

        # Track Assignment Change
        if previous.assigned_to != instance.assigned_to:
            AuditLog.objects.create(
                request=instance,
                action="Task Assigned",
                previous_value=previous.assigned_to.username if previous.assigned_to else "Unassigned",
                new_value=instance.assigned_to.username if instance.assigned_to else "Unassigned"
            )
            # Create notification for staff
            if instance.assigned_to:
                Notification.objects.create(
                    user=instance.assigned_to,
                    message=f"You have been assigned to task: '{instance.title}'"
                )

@receiver(post_save, sender=MaintenanceRequest)
def initial_notification(sender, instance, created, **kwargs):
    if created:
        AuditLog.objects.create(
            request=instance,
            action="Request Created",
            new_value="Pending"
        )
        # Notify Manager? Usually managers check dashboard, 
        # but let's notify the specific staff if it was assigned immediately
        if instance.assigned_to:
            Notification.objects.create(
                user=instance.assigned_to,
                message=f"New task assigned: '{instance.title}'"
            )
