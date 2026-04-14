from rest_framework import serializers
from .models import User, MaintenanceRequest, AuditLog, Notification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'first_name', 'last_name')

class AuditLogSerializer(serializers.ModelSerializer):
    changed_by_name = serializers.ReadOnlyField(source='changed_by.username')
    class Meta:
        model = AuditLog
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class MaintenanceRequestSerializer(serializers.ModelSerializer):
    created_by_name = serializers.ReadOnlyField(source='created_by.username')
    assigned_to_name = serializers.ReadOnlyField(source='assigned_to.username')
    audit_logs = AuditLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = MaintenanceRequest
        fields = (
            'id', 'title', 'description', 'location', 
            'status', 'priority', 'created_by', 'created_by_name',
            'assigned_to', 'assigned_to_name', 'created_at', 'updated_at',
            'audit_logs'
        )
        read_only_fields = ('created_by', 'created_at', 'updated_at')

    def create(self, validated_data):
        # Set created_by to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
