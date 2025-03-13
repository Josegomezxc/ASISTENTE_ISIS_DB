from django.db import models

# models.py
from django.db import models

class Song(models.Model):
    artist = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    url = models.URLField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.title} by {self.artist}"

class Music(models.Model):  
    artist_name = models.CharField(max_length=255)
    song_name = models.CharField(max_length=255)
    user_id = models.IntegerField()
    url = models.URLField(max_length=200, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.artist_name} - {self.song_name}"