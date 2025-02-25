from django.urls import path

from .models import Training, Player
from .views import HomePageView, AddPlayerView, AddTraining, CategoryView, TrainingView, PlayerView, TrainingEditView, \
    players_list, add_player, trainings_list, get_categories, get_players_by_category, get_trainings_by_category, \
    get_player_by_id, get_trainings_by_player, absences, add_training, add_absence

app_name = 'dochadzka_app'

urlpatterns = [
    path('', HomePageView.as_view(), name='index'),
    path('players/', players_list, name='players-list'),
    path('trainings/', trainings_list, name='trainings-list'),
    path("addplayer/", add_player, name="add_player"),
    path("categories/", get_categories, name="get_categories"),
    path('api/players/<str:category_name>/', get_players_by_category, name='get_players_by_category'),
    path('api/trainings/<str:category_name>/', get_trainings_by_category, name='get_trainings_by_category'),
    path('players/<int:playerid>/', get_player_by_id, name='get_player_by_id'),
    path('players/<int:playerid>/trainings/', get_trainings_by_player, name='get_trainings_by_player'),
    path('absence/', absences, name='get_absence_for_player'),
    path("addtraining/", add_training, name="add_training"),
    path('addabsence/', add_absence, name='get_absence_for_player'),

    path('player/',AddPlayerView.as_view(), name='post'),
    path("training/<str:category_name>/",AddTraining.as_view(), name='training'),
    path("category/<str:category_name>/", CategoryView.as_view(), name="category"),
    path("training_view/<int:training_target>/<str:category_name>/'", TrainingView.as_view(), name="training_view"),
    path("player_view/<int:player_id>", PlayerView.as_view(), name='player_view'),
    path("training_edit/<int:training_id>/<str:category_name>/", TrainingEditView.as_view(), name='training_edit')
]