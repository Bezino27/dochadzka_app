from django.urls import path
from .views import \
    players_list, add_player, trainings_list, get_categories, get_players_by_category, get_trainings_by_category, \
    get_player_by_id, get_trainings_by_player, absences, add_training, add_absence

app_name = 'dochadzka_app'

urlpatterns = [
    path('players/', players_list, name='players-list'),
    path('trainings/', trainings_list, name='trainings-list'),
    path("addplayer/", add_player, name="add_player"),
    path("categories/", get_categories, name="get_categories"),
    path('players/<str:category_name>/', get_players_by_category, name='get_players_by_category'),
    path('trainings/<str:category_name>/', get_trainings_by_category, name='get_trainings_by_category'),
    path('players/<int:playerid>/', get_player_by_id, name='get_player_by_id'),
    path('players/<int:playerid>/trainings/', get_trainings_by_player, name='get_trainings_by_player'),
    path('absence/', absences, name='get_absence_for_player'),
    path("addtraining/", add_training, name="add_training"),
    path('addabsence/', add_absence, name='get_absence_for_player'),


]