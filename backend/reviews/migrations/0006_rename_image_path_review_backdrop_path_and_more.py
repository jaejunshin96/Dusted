# Generated by Django 5.0.4 on 2025-04-18 13:12

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0005_alter_review_review'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameField(
            model_name='review',
            old_name='image_path',
            new_name='backdrop_path',
        ),
        migrations.AddField(
            model_name='review',
            name='directors',
            field=models.CharField(default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='review',
            name='poster_path',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='review',
            name='movie_id',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterUniqueTogether(
            name='review',
            unique_together={('user', 'movie_id')},
        ),
    ]
