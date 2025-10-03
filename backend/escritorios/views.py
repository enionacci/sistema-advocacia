# escritorios/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Escritorio, PerfilUsuario, Convite
from django.contrib.auth.models import User
from .serializers import EscritorioSerializer, ConviteSerializer, AcceptInvitationSerializer, PerfilUsuarioSerializer
from .permissions import CanCreateEscritorio
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

class MembroDestroyView(generics.DestroyAPIView):
    """
    View para remover um membro (PerfilUsuario) de um escritório.
    """
    serializer_class = PerfilUsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """ O usuário só pode remover membros do seu próprio escritório, e não a si mesmo. """
        escritorio = self.request.user.perfil.escritorio
        return PerfilUsuario.objects.filter(escritorio=escritorio).exclude(user=self.request.user)

class AcceptInvitationView(generics.GenericAPIView):
    serializer_class = AcceptInvitationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        token = data.get('token')

        try:
            convite = Convite.objects.get(token=token, status='pending')
        except Convite.DoesNotExist:
            return Response({"detail": "Convite inválido ou já utilizado."}, status=status.HTTP_404_NOT_FOUND)

        # Opcional: verificar se o convite expirou
        # if convite.created_at < timezone.now() - timedelta(days=7):
        #     convite.status = 'expired'
        #     convite.save()
        #     return Response({"detail": "Convite expirado."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=convite.email).exists():
            return Response({"detail": "Um usuário com este e-mail já existe."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Cria o novo usuário
        username = convite.email.split('@')[0]
        user = User.objects.create_user(
            username=username, # Ou pode pedir um username no form
            email=convite.email,
            password=data.get('password'),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )

        # Vincula o usuário ao escritório
        PerfilUsuario.objects.create(user=user, escritorio=convite.escritorio)

        # Atualiza o status do convite
        convite.status = 'accepted'
        convite.save()

        # Gera tokens para o novo usuário
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)

class EnviarConviteView(generics.CreateAPIView):
    """
    View para criar e 'enviar' um convite por e-mail.
    """
    serializer_class = ConviteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        escritorio = self.request.user.perfil.escritorio
        convite = serializer.save(
            sender=self.request.user,
            escritorio=escritorio
        )

        # Monta e envia o e-mail (para o console)
        subject = f"Você foi convidado para o escritório {escritorio.nome}"
        # ATENÇÃO: Em produção, o domínio deve ser o do seu site
        invite_url = f"http://localhost:3000/convite/{convite.token}"
        message = f"""
        Olá,

        Você foi convidado por {convite.sender.username} para se juntar ao escritório {escritorio.nome} em nosso sistema.

        Para aceitar o convite e criar sua conta, por favor, clique no link abaixo:
        {invite_url}

        Se você não esperava este convite, por favor, ignore este e-mail.

        Atenciosamente,
        A Equipe do Sistema de Advocacia
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL, # A ser configurado em settings.py
            [convite.email],
            fail_silently=False,
        )

class EscritorioCreateView(generics.CreateAPIView):
    """
    View para a criação de um novo escritório por um usuário sem um.
    """
    serializer_class = EscritorioSerializer
    permission_classes = [CanCreateEscritorio]

    def perform_create(self, serializer):
        # Define a data de expiração do teste para 120 dias a partir de agora
        trial_end_date = timezone.now() + timedelta(days=120)
        escritorio = serializer.save(data_expiracao_teste=trial_end_date)

        # Cria o PerfilUsuario para vincular o usuário logado ao novo escritório
        PerfilUsuario.objects.create(user=self.request.user, escritorio=escritorio)

class MinhaEscritorioView(generics.RetrieveUpdateAPIView):
    """
    View para que um usuário possa ver e atualizar seu próprio escritório.
    """
    serializer_class = EscritorioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Retorna o escritório associado ao usuário logado."""
        return self.request.user.perfil.escritorio