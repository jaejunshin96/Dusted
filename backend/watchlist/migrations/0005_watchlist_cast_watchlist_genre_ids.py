# Generated by Django 5.0.4 on 2025-05-10 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('watchlist', '0004_alter_watchlist_overview'),
    ]

    operations = [
        migrations.AddField(
            model_name='watchlist',
            name='cast',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='watchlist',
            name='genre_ids',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
