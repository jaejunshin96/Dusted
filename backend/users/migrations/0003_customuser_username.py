# Generated by Django 5.0.4 on 2025-03-02 07:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_customuser_first_name_customuser_last_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='username',
            field=models.CharField(default='default_username', max_length=150, unique=True, verbose_name='Username'),
        ),
    ]
