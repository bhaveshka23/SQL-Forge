from django.urls import path
from .views import (
    PracticeDatabaseListView,
    QuestionListView
)

urlpatterns = [
    path('databases/', PracticeDatabaseListView.as_view(),name='database-list'),
    path('questions/', QuestionListView.as_view(),name='question-list')
]