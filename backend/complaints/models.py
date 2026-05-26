
from django.db import models
from django.contrib.auth.models import User

class Complaint(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=50, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(
    upload_to='complaint_images/',
    null=True,
    blank=True
)
    created_by = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name='complaints'
)
    
    def __str__(self):
        return self.title