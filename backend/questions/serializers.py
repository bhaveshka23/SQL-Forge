from rest_framework import serializers
from .models import PracticeDatabase, Question

class PracticeDatabaseSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = PracticeDatabase
        fields = ['id', 'name', 'slug', 'description', 'question_count']


class QuestionSerializer(serializers.ModelSerializer):
    database_slug = serializers.CharField(source='database.slug', read_only=True)
    database_name = serializers.CharField(source='database.name', read_only=True)

    class Meta:
        model = Question
        fields = [
            'id',
            'database',
            'database_slug',
            'database_name',
            'title',
            'description',
            'difficulty',
            'topic',
            'is_active',
        ]
