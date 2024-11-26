from rest_framework import generics, status 
from rest_framework.response import Response
from .models import BlogPost, Category, Like, Comment
from .serializers import BlogPostSerializer, UserSerializer,  CommentSerializer, LikeSerializer, CategorySerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import RetrieveUpdateAPIView

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def endpoints(request):
    return Response ("/blogposts/ , /blogposts/<uuid:pk>/, /signup/, /logout/, /login/', /token/refresh/, /comment/, comment/<uuid:pk>/, /like/, /like/<int:pk>/delete/ , /post_filter_by/<str:category_name>/, NAZWY KATEGORII: Sport, Finances, Adventures")
    
class CustomPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 10
    
class BlogPostListView(generics.ListAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

class BlogPostCreateView(generics.CreateAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]  # Dostęp tylko dla zalogowanych użytkowników

    def perform_create(self, serializer):
        # Automatycznie przypisuje autora na podstawie zalogowanego użytkownika
        serializer.save(author=self.request.user)


class BlogPostUpdateView(generics.RetrieveUpdateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        # Upewniamy się, że tylko autor lub superużytkownik może edytować post
        if not self.request.user.is_superuser and obj.author != self.request.user:
            self.permission_denied(self.request, message="Nie masz uprawnień do edytowania tego posta.")
        return obj
    
class BlogPostDeleteView(generics.DestroyAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        # Upewniamy się, że tylko autor lub superużytkownik może usunąć post
        if not self.request.user.is_superuser and obj.author != self.request.user:
            self.permission_denied(self.request, message="Nie masz uprawnień do usunięcia tego posta.")
        return obj
    

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()
        return Response({
            'Rejestracja udana. Możesz się teraz zalogować.'
        })
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token is None:
                return Response({"detail": "Brak tokenu odświeżania."}, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Wylogowano pomyślnie."}, status=status.HTTP_205_RESET_CONTENT)
        except TokenError:
            return Response({"detail": "Token jest nieprawidłowy lub już został unieważniony."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

@permission_classes([IsAuthenticated])
class BlogPostByCategory(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        # Pobierz nazwę kategorii z parametru URL
        category_name = self.kwargs.get('category_name')
        
        # Znajdź kategorię o podanej nazwie
        category = get_object_or_404(Category, name=category_name)
        
        # Zwróć posty przypisane do tej kategorii
        return BlogPost.objects.filter(categories=category)

class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]  

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  


class CommentUpdateView(RetrieveUpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]  # Tylko zalogowani użytkownicy mogą edytować

    def get_object(self):
        # Pobranie obiektu i sprawdzenie uprawnień
        obj = super().get_object()
        if obj.author != self.request.user and not self.request.user.is_superuser:
            # Jeśli użytkownik nie jest autorem i nie jest superużytkownikiem
            raise PermissionDenied("Nie możesz edytować tego komentarza.") 
        return obj
    
class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]  

    def get_object(self):
        obj = super().get_object()
        if obj.author != self.request.user:
            raise PermissionDenied("Nie możesz usunąć tego komentarza.") 
        return obj

@permission_classes([IsAuthenticated])
class CommentByPost(generics.ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        blog_post = self.kwargs['blog_post']
        return Comment.objects.filter(blog_post=blog_post)
    
class CommentCountView(APIView):
    def get(self, request, blog_post_id):
        comment_count = Comment.objects.filter(blog_post_id=blog_post_id).count()
        return Response({"blog_post_id": blog_post_id, "comment_count": comment_count})


class LikeCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        blog_post_id = request.data.get('blog_post')

        # Walidacja istnienia posta
        try:
            blog_post = BlogPost.objects.get(id=blog_post_id)
        except BlogPost.DoesNotExist:
            return Response({'error': 'Blog post not found'}, status=status.HTTP_404_NOT_FOUND)

        # Sprawdzenie, czy użytkownik już polubił ten post
        if Like.objects.filter(author=request.user, blog_post=blog_post).exists():
            return Response({'error': 'You have already liked this post'}, status=status.HTTP_400_BAD_REQUEST)

        # Utworzenie "like"
        like = Like.objects.create(author=request.user, blog_post=blog_post)
        serializer = LikeSerializer(like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LikeDeleteView(generics.DestroyAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        like = self.get_object()
        
        # Sprawdzenie, czy użytkownik jest autorem polubienia
        if not self.request.user.is_superuser and like.author != request.user:
            return Response({"detail": "Nie masz uprawnień do usunięcia tego polubienia."},
                            status=status.HTTP_403_FORBIDDEN)
        
        # Usunięcie polubienia
        like.delete()
        return Response({"detail": "Polubienie zostało usunięte."}, status=status.HTTP_204_NO_CONTENT)
    
class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@permission_classes([IsAuthenticated])
class LikesCountView(APIView):
    def get(self, request, blog_post):
        likes_count = Like.objects.filter(blog_post=blog_post).count()
        return Response({'likes_count': likes_count}, status=status.HTTP_200_OK)

class LikeStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, blog_post):
        try:
            blog_post_instance = BlogPost.objects.get(id=blog_post)
        except BlogPost.DoesNotExist:
            return Response(
                {'error': 'Blog post not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Sprawdź, czy użytkownik polubił post
        like = Like.objects.filter(author=request.user, blog_post=blog_post_instance).first()
        
        if like:
            return Response({
                'liked': True,
                'like_id': like.id
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'liked': False
            }, status=status.HTTP_200_OK)
        

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


