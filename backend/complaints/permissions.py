from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):

    def has_permission(self, request, view):

        # GET requests allowed for authenticated users
        if request.method in ['GET', 'POST','PATCH']:
            return True

        # Only admin can modify
        return request.user.is_staff