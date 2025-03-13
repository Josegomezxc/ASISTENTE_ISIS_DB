from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.views.decorators.cache import never_cache
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from .models import Song
from django.shortcuts import render
from .models import Music
from django.db.models import Count
from django.shortcuts import render
from django.db.models import Count
from .models import Music


def user_login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("home")
        else:
            return render(request, "login.html", {"error": "Usuario o contraseña incorrectos"})

    return render(request, "login.html")

@login_required
@never_cache
def home(request):
    return render(request, 'index.html')


def logout_view(request):
    logout(request)
    return redirect('login')


def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']

        if password == confirm_password:
            try:
                user = User.objects.create_user(username=username, password=password, email=email)
                user.save()
                messages.success(request, 'Registro exitoso. Ahora puedes iniciar sesión.')
                return redirect('login')  # Redirige al login después del registro
            except Exception as e:
                messages.error(request, 'Error al registrar el usuario. Intenta de nuevo.')
        else:
            messages.error(request, 'Las contraseñas no coinciden.')

    return render(request, 'register.html')


from django.http import JsonResponse
from .models import Music, Song

def save_song(request):
    if request.method == "POST":
        artist_name = request.POST.get('artist_name')
        song_name = request.POST.get('song_name')
        song_url = request.POST.get('song_url')
        # Verificar si la canción ya existe para el usuario actual
        user_id = request.user.id  # Obtén el ID del usuario actual
        existing_song = Music.objects.filter(artist_name=artist_name, song_name=song_name, user_id=user_id).first()

        if existing_song:
            return JsonResponse({"error": "Esta canción ya ha sido guardada."}, status=400)

        # Guarda la canción en la tabla Song
        song = Song(artist=artist_name, title=song_name, url=song_url)
        song.save()
        
        # Guarda en la tabla Music
        music = Music(artist_name=artist_name, song_name=song_name, user_id=user_id, url=song_url)
        music.save()

        return JsonResponse({"message": "Canción guardada exitosamente."})

    return JsonResponse({"error": "Solicitud no válida."}, status=400)



from django.shortcuts import render
from .models import Music

def playlist(request):
    user_id = request.user.id  # Obtiene el ID del usuario actual
    
    # Obtiene todas las canciones del usuario actual en la tabla Music
    user_songs = Music.objects.filter(user_id=user_id)

    # Usar un conjunto para evitar duplicados basado en el título y el artista
    unique_songs = {}
    for song in user_songs:
        key = (song.song_name, song.artist_name)  # Crear una clave única basada en el nombre y el artista
        unique_songs[key] = song

    # Obtener solo los valores únicos
    user_songs = list(unique_songs.values())

    return render(request, 'playlist.html', {
        'user_songs': user_songs,  # Pasamos solo las canciones únicas del usuario
    })





