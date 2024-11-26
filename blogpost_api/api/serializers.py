from rest_framework import serializers
from .models import BlogPost, Category, Comment, Like
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BlogPostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    categories = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
        )
    class Meta:
        model = BlogPost
        fields = ["id", "title", "content", "published_date", "author", "categories"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'username', 'password', 'email']


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'blog_post', 'created_at']
        read_only_fields = ['id', 'author', 'created_at',]  # Pola tylko do odczytu

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'author', 'blog_post', 'created_at'] 
        read_only_fields = ['id', 'created_at', 'author']  # author będzie ustawiany automatycznie

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_superuser']