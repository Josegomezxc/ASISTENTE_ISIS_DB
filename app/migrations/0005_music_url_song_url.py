# Generated by Django 4.2 on 2025-03-11 21:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_remove_music_video_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='music',
            name='url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='song',
            name='url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
