from rest_framework import permissions

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'MANAGER'

class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'STAFF'

class IsResident(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'RESIDENT'

class MaintenanceRequestPermission(permissions.BasePermission):
    """
    Object-level permission for MaintenanceRequests
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Managers have full control
        if user.role == 'MANAGER':
            return True
            
        # Residents can only see/edit their own
        if user.role == 'RESIDENT':
            return obj.created_by == user
            
        # Staff can only see/update tasks assigned to them
        if user.role == 'STAFF':
            # Staff can't delete or fully edit title/description (usually)
            # but for simplicity we'll allow view/update if assigned.
            # In views we'll restrict what they can update.
            return obj.assigned_to == user
            
        return False
