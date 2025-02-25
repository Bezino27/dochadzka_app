from django.views.generic import TemplateView, FormView
from .forms import PlayerForm, TrainingForm, EditTrainingForm

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


class HomePageView(TemplateView):
    template_name = "home.html"
    def get_context_data(self, **kwargs):
        context= super().get_context_data(**kwargs)
        context['posts'] = Player.objects.all().order_by('birth_date')
        return context

class AddPlayerView(FormView):
    template_name = "new_player.html"
    form_class = PlayerForm
    success_url = '/'
    def dispatch(self, request, *args, **kwargs):
        self.request = request
        return super().dispatch(request, *args, **kwargs)
    def form_valid(self, form):
        new_object = Player.objects.create(
            jersey_number=form.cleaned_data['jersey_number'],
            first_name=form.cleaned_data['first_name'],
            last_name=form.cleaned_data['last_name'],
            birth_date=form.cleaned_data['birth_date'],
            email_1=form.cleaned_data['email_1'],
            email_2=form.cleaned_data['email_2'],
        )


        categories = form.cleaned_data['categories']
        new_object.categories.set(categories)
        messages.add_message(self.request, messages.SUCCESS, 'Player added!')
        return super().form_valid(form)


from .forms import TrainingForm
from django.shortcuts import redirect
from django.urls import reverse
from django.views.generic.edit import FormView
from django.contrib import messages
from .models import Training, AbsenceReason, Player, Category

class AddTraining(FormView):
    template_name = "new_training.html"
    form_class = TrainingForm
    success_url = '/'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category_name'] = self.kwargs.get("category_name")
        return context

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['category_name'] = self.kwargs.get('category_name')
        return kwargs

    def form_valid(self, form):
        category = form.cleaned_data['category']
        day = form.cleaned_data['day']
        date = form.cleaned_data['date']
        time = form.cleaned_data['time']
        players = form.cleaned_data['players']

        # Vytvorenie nového tréningu
        new_training = Training.objects.create(
            category=category,
            day=day,
            date=date,
            time=time
        )

        # Pridanie hráčov na tréning
        new_training.players.set(players)

        # Zistenie všetkých hráčov v kategórii
        all_players_in_category = category.players.all()
        absent_players = set(all_players_in_category) - set(players)

        # Aktualizácia dochádzky
        for player in all_players_in_category:
            player.all_training_count += 1
            player.save()

        for player in players:
            player.attendance_count += 1
            player.save()

        # Spracovanie absencií
        for player in absent_players:
            absence_reason = form.cleaned_data.get(f'absence_reason_{player.id}', "").strip()
            if absence_reason:
                AbsenceReason.objects.create(
                    player=player,
                    training=new_training,
                    reason=absence_reason
                )

        messages.success(self.request, "Training added successfully!")
        return redirect(reverse('dochadzka_app:category', kwargs={'category_name': category.name}))



class CategoryView(TemplateView):
    template_name = "category.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category_name = self.kwargs.get("category_name")  # Získaj meno kategórie z URL

        selected_category = Category.objects.get(name=category_name)
        players_in_database = selected_category.players.all().order_by('last_name')
        all_trainings = selected_category.trainings.all().order_by('-date')
        all_absence=AbsenceReason.objects.all()

        counter = 0
        # Inicializuj počítadlo pre každého hráča.
        for player in players_in_database:
            player.attendance_count = 0  # Resetuj počet účastí pre každého hráča
            player.all_training_count = 0

        # Prejdi všetkými tréningami a zisti, ktorí hráči sa zúčastnili
        for training in all_trainings:
            for player in players_in_database:
                player.all_training_count += 1
                if player in training.players.all():
                    player.attendance_count += 1  # Zvýš počet účastí iba pre tohto hráča

        # Vypočítaj percentuálnu účasť pre každého hráča
        for player in players_in_database:
            if player.all_training_count > 0:  # Ak má hráč nejaké tréningy
                player.attendance_percentage = (player.attendance_count / player.all_training_count) * 100
            else:
                player.attendance_percentage = 0  # Ak nemá žiadne tréningy, nastaviť 0
                # %
        players_in_database = sorted(players_in_database, key=lambda p: p.attendance_percentage, reverse=True)

        # Pridanie do kontextu
        context["players_in_category"] = players_in_database
        context["all_trainings"] = all_trainings
        context["all_absence"] = all_absence
        return context


class TrainingView(TemplateView):
    template_name = "training.html"
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category_name = self.kwargs.get("category_name")  # Získaj meno kategórie z URL
        training_id = self.kwargs.get("training_target")  # Získaj meno kategórie z URL
        selected_category = Category.objects.get(name=category_name)
        players_in_category = selected_category.players.all()

        all_absence = AbsenceReason.objects.all()


        selected_training = Training.objects.get(id=training_id)
        players_in_training = selected_training.players.all().order_by('last_name')
        context["selected_training"] = selected_training
        context["players"] = players_in_training
        context['players_in_category']=players_in_category
        context['all_absence']=all_absence
        return context

class PlayerView(TemplateView):
    template_name = "player_view.html"
    def get_context_data(self, **kwargs):
        context=super().get_context_data(**kwargs)
        player_id=self.kwargs.get("player_id")
        selected_player=Player.objects.get(id=player_id)
        player_trainings=selected_player.trainings.all().order_by('-date')
        player_categories=selected_player.categories.all()
        all_trainings=Training.objects.all().order_by('-date')
        all_absence = AbsenceReason.objects.all()


        context['all_absence']=all_absence
        context["all_trainings"]=all_trainings
        context["selected_player"]=selected_player
        context["player_trainings"]=player_trainings
        context["player_categories"]=player_categories
        return context

class TrainingEditView(TemplateView):
    template_name = "training_edit.html"
    form_class = EditTrainingForm
    success_url = '/'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category_name'] = self.kwargs.get("category_name")
        return context

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['category_name'] = self.kwargs.get('category_name')
        return kwargs

    def form_valid(self, form):
        category = form.cleaned_data['category']
        day = form.cleaned_data['day']
        date = form.cleaned_data['date']
        time = form.cleaned_data['time']
        players = form.cleaned_data['players']

        # Vytvorenie nového tréningu
        new_training = Training.objects.create(
            category=category,
            day=day,
            date=date,
            time=time
        )

        # Pridanie hráčov na tréning
        new_training.players.set(players)

        # Zistenie všetkých hráčov v kategórii
        all_players_in_category = category.players.all()
        absent_players = set(all_players_in_category) - set(players)

        # Aktualizácia dochádzky
        for player in all_players_in_category:
            player.all_training_count += 1
            player.save()

        for player in players:
            player.attendance_count += 1
            player.save()

        # Spracovanie absencií
        for player in absent_players:
            absence_reason = form.cleaned_data.get(f'absence_reason_{player.id}', "").strip()
            if absence_reason:
                AbsenceReason.objects.create(
                    player=player,
                    training=new_training,
                    reason=absence_reason
                )

        messages.success(self.request, "Training added successfully!")
        return redirect(reverse('dochadzka_app:category', kwargs={'category_name': category.name}))
