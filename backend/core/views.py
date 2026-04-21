from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from .models import User, MaintenanceRequest, Notification, AuditLog
from .serializers import (
    UserSerializer, MaintenanceRequestSerializer, 
    NotificationSerializer, AuditLogSerializer
)
from .permissions import IsManager, IsStaff, IsResident, MaintenanceRequestPermission
from django.db.models import Count, Avg, F
import logging

logger = logging.getLogger(__name__)

class HealthCheckView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        return Response({"status": "ok", "detail": "DispatchPro Backend is healthy"})

class CSRFTokenView(views.APIView):
    permission_classes = [permissions.AllowAny]
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return Response({"detail": "CSRF cookie set"})

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return Response(UserSerializer(user).data)
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(views.APIView):
    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out"})

class UserView(views.APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)

class StaffListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsManager]
    def get(self, request):
        staff = User.objects.filter(role='STAFF')
        return Response(UserSerializer(staff, many=True).data)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsManager]

    def get(self, request):
        # Stats for Manager Dashboard
        total_requests = MaintenanceRequest.objects.count()
        status_counts = MaintenanceRequest.objects.values('status').annotate(count=Count('id'))
        priority_counts = MaintenanceRequest.objects.values('priority').annotate(count=Count('id'))
        
        # Avg resolution time (days) for COMPLETED requests
        completed = MaintenanceRequest.objects.filter(status='COMPLETED', updated_at__isnull=False)
        avg_res_time = "N/A"
        if completed.exists():
            # Simplistic calculation
            total_time = sum([(r.updated_at - r.created_at).days for r in completed])
            avg_res_time = total_time / completed.count()

        return Response({
            "total_requests": total_requests,
            "status_counts": {item['status']: item['count'] for item in status_counts},
            "priority_counts": {item['priority']: item['count'] for item in priority_counts},
            "avg_resolution_days": avg_res_time
        })

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [permissions.IsAuthenticated, MaintenanceRequestPermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'MANAGER':
            return MaintenanceRequest.objects.all().order_by('-created_at')
        if user.role == 'RESIDENT':
            return MaintenanceRequest.objects.filter(created_by=user).order_by('-created_at')
        if user.role == 'STAFF':
            return MaintenanceRequest.objects.filter(assigned_to=user).order_by('-created_at')
        return MaintenanceRequest.objects.none()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        # Staff can only update status
        if request.user.role == 'STAFF':
            allowed_fields = {'status'}
            if not set(request.data.keys()).issubset(allowed_fields):
                return Response(
                    {"detail": "Maintenance staff can only update task status."},
                    status=status.HTTP_403_FORBIDDEN
                )
        return super().partial_update(request, *args, **kwargs)
