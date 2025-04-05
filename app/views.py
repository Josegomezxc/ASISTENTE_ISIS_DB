from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.views.decorators.cache import never_cache
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from .models import Profile, Song
from django.shortcuts import render
from .models import Music
from django.db.models import Count
from django.shortcuts import render
from django.db.models import Count
from .models import Music
from django.http import JsonResponse
from .models import Music, Song
from django.shortcuts import render
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

def perfil(request):
    return render(request, 'perfil.html')

@login_required
def editar_perfil(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        first_name = request.POST.get('nombre')
        last_name = request.POST.get('lastname')
        email = request.POST.get('email')
        phone = request.POST.get('teléfono')
        profile_picture = request.FILES.get('profile_picture')  # Asegúrate de obtener la imagen subida

        user = request.user

        # Verificar si el nuevo username ya existe en otro usuario
        if User.objects.exclude(id=user.id).filter(username=username).exists():
            messages.error(request, 'El nombre de usuario ya está en uso.')
            return redirect('editar_perfil')

        user.username = username
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()

        profile, created = Profile.objects.get_or_create(user=user)
        profile.phone = phone
        if profile_picture:  # Solo guarda si se ha subido una nueva imagen
            profile.profile_picture = profile_picture
        profile.save()

        messages.success(request, 'Perfil actualizado correctamente.')
        return redirect('perfil')

    return render(request, 'editar_perfil.html')




