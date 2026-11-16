from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import PracticeDatabase, Question
from .serializers import (
    PracticeDatabaseSerializer,
    QuestionSerializer
)


class PracticeDatabaseListView(generics.ListAPIView):
    serializer_class = PracticeDatabaseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return PracticeDatabase.objects.filter(is_active=True).order_by('id')


class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Question.objects.filter(is_active=True)

        database = self.request.query_params.get('database')
        if database:
            if database.isdigit():
                queryset = queryset.filter(database_id=int(database))
            else:
                queryset = queryset.filter(database__slug=database)

        difficulty = self.request.query_params.get('difficulty')
        if difficulty and difficulty.lower() != 'all':
            queryset = queryset.filter(difficulty__iexact=difficulty)

        topic = self.request.query_params.get('topic')
        if topic and topic.lower() != 'all':
            queryset = queryset.filter(topic__icontains=topic)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(topic__icontains=search)
            )

        return queryset.order_by('id')
