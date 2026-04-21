from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CSRFTokenView, LoginView, LogoutView, UserView, 
    StaffListView, NotificationViewSet, AnalyticsView,
    MaintenanceRequestViewSet, HealthCheckView
)

router = DefaultRouter()
router.register(r'requests', MaintenanceRequestViewSet, basename='request')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health'),
    path('csrf/', CSRFTokenView.as_view(), name='csrf'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserView.as_view(), name='user'),
    path('staff/', StaffListView.as_view(), name='staff'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('', include(router.urls)),
]
