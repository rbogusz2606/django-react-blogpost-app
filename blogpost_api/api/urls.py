from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,)

urlpatterns = [
    path("", views.endpoints, name="endpoints"),
    path("blogposts/", views.BlogPostListView.as_view(), name="blogpost-list"),
    path('blogposts/create/', views.BlogPostCreateView.as_view(), name='blogpost-create'),
    path('blogposts/<uuid:pk>/update/', views.BlogPostUpdateView.as_view(), name='blogpost-update'),
    path('blogposts/<uuid:pk>/delete/', views.BlogPostDeleteView.as_view(), name='blogpost-delete'),

    path("comment/create/", views.CommentCreateView.as_view(), name="comment-create"),
    path("comment/<uuid:pk>/update/", views.CommentUpdateView.as_view(), name="comment-update"),
    path("comment/<uuid:pk>/delete/", views.CommentDeleteView.as_view(), name="comment-delete"),
    path('comments/<uuid:blog_post>/', views.CommentByPost.as_view(), name='comments-by-post'),
    path('comments/count/<uuid:blog_post_id>/', views.CommentCountView.as_view(), name='comments-count'),

    path("post_filter_by/category/<str:category_name>/", views.BlogPostByCategory.as_view(), name='posts-by-category'),

    path("like/create/", views.LikeCreateView.as_view(), name="like"),
    path("like/<uuid:id>/delete/", views.LikeDeleteView.as_view(), name="like-delete"),
    path('likes-count/<uuid:blog_post>/', views.LikesCountView.as_view(), name='likes-count-by-post'),
    path('likes-status/<uuid:blog_post>/', views.LikeStatusView.as_view(), name='like-status'),

    path("category-list/", views.CategoryList.as_view(), name="category-list"),

    path('auth/user/', views.UserDetailView.as_view(), name='user-detail'),

    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("signup/", views.signup, name="signup"),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
