from django.contrib import admin
from .models import Player, Training, Category, AbsenceReason


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class PlayerAdmin(admin.ModelAdmin):
    list_display = ('id','jersey_number', 'first_name', 'last_name', 'birth_date')  # Zabezpeč, aby kategória bola uvedená
    search_fields = ('last_name', 'email')
    filter_horizontal = ('categories',)  # Filtrovanie podľa kategórie


class TrainingAdmin(admin.ModelAdmin):
    list_display = ('id','category', 'day', 'date', 'time')
    search_fields = ('category__name', 'time')
    list_filter = ('category',)
    filter_horizontal = ('players',)  # ManyToManyField musí byť v `filter_horizontal`

class AbsenceReasonAdmin(admin.ModelAdmin):
    list_display = ("player", "training", "reason")  # Zobrazenie stĺpcov v admin rozhraní
    search_fields = ("player__first_name", "player__last_name", "training__date", "reason")  # Vyhľadávanie podľa mena hráča, dátumu tréningu a dôvodu
    list_filter = ("training__date",)  # Filter pre dátum tréningu
    ordering = ("-training__date",)  # Zoradenie podľa dátumu tréningu (najnovšie prvé)


admin.site.register(Category, CategoryAdmin)
admin.site.register(Player,PlayerAdmin)
admin.site.register(Training, TrainingAdmin)
admin.site.register(AbsenceReason, AbsenceReasonAdmin)
from django.contrib import admin

# Register your models here.

