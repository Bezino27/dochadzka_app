from .models import Training, AbsenceReason, Player, Category
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import PlayerSerializer, TrainingSerializer, CategorySerializer, AbsenceReasonSerializer


@api_view(['GET'])
def players_list (request):
    players = Player.objects.all().order_by('birth_date')
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def trainings_list(request):
    trainings = Training.objects.all()
    serializer = TrainingSerializer(trainings, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def add_player(request):
    serializer = PlayerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_players_by_category(request, category_name):
    players = Player.objects.filter(categories__name=category_name).order_by('last_name', 'first_name')
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_trainings_by_category(request, category_name):
    trainings = Training.objects.filter(category__name=category_name).order_by('-date')
    serializer = TrainingSerializer(trainings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_player_by_id(request, playerid):
    player = get_object_or_404(Player, id=playerid)  # Ak ID je uložené v `player_id`
    serializer = PlayerSerializer(player)  # Nepotrebujeme many=True, lebo vraciame len jeden objekt
    return Response(serializer.data)


@api_view(['GET'])
def get_trainings_by_player(request, playerid):
    player = get_object_or_404(Player, id=playerid)  # Získame hráča alebo 404
    categories=player.categories.all()
    trainings = Training.objects.filter(category__in=categories).order_by('category') # Nájdeme tréningy, kde hráč figuruje
    serializer = TrainingSerializer(trainings, many=True)  # Použijeme many=True, pretože ide o zoznam
    return Response(serializer.data)

@api_view(['GET'])
def absences(request):
    absence_reason = AbsenceReason.objects.all()
    serializer = AbsenceReasonSerializer(absence_reason,many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def add_training(request):
    serializer = TrainingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def add_absence(request):
    serializer = AbsenceReasonSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


