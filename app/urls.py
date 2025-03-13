from django.conf import settings
from django.urls import path
from django.conf.urls.static import static
from .views import home, logout_view
from app import views
from django.contrib.auth import views as auth_views
from .views import register
from django.urls import path
from .views import save_song
from .views import playlist


urlpatterns = [
    path("", views.user_login, name="login"),
    path('register/', register, name='register'),
    path("home/", views.home, name="home"),
    path("logout/", auth_views.LogoutView.as_view(next_page="login"), name="logout"),
    path('logout/', logout_view, name='logout'),
    path('save_song/', save_song, name='save_song'),
    path('playlist/', playlist, name='playlist'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)