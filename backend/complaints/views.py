
from rest_framework import viewsets
from .models import Complaint
from .serializers import ComplaintSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    def get_queryset(self):
         if self.request.user.is_staff:
          return Complaint.objects.all()
         return Complaint.objects.filter(created_by=self.request.user)
    
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):

     complaint = self.get_object()

    # only admin allowed
     if not request.user.is_staff:
        return Response(
            {'error': 'Only admin can update status'},
            status=status.HTTP_403_FORBIDDEN
        )

     new_status = request.data.get('status')

     complaint.status = new_status
     complaint.save()

     return Response({
        'message': 'Status updated successfully',
        'new_status': complaint.status
    })