# escritorios/views.py
from rest_framework import generics, status, parsers
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Escritorio, PerfilUsuario, Convite, Papel, Permissao
from django.contrib.auth.models import User
from .serializers import EscritorioSerializer, ConviteSerializer, AcceptInvitationSerializer, PerfilUsuarioSerializer, PapelSerializer, PermissaoSerializer, PerfilUsuarioPapelUpdateSerializer, InvitationDetailSerializer
from .permissions import CanCreateEscritorio, HasPermission
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

class InvitationDetailView(generics.RetrieveAPIView):
    queryset = Convite.objects.filter(status='pending')
    serializer_class = InvitationDetailSerializer
    lookup_field = 'token'

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
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        
        # Usa o e-mail como nome de usuário
        username = convite.email

        # Verifica se o nome de usuário (e-mail) já existe
        if User.objects.filter(username=username).exists():
            return Response({"detail": "Um usuário com este e-mail já existe."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=convite.email,
            password=data.get('password'),
            first_name=first_name,
            last_name=last_name
        )

        # Vincula o usuário ao escritório e atribui um papel padrão
        perfil_usuario = user.perfil
        perfil_usuario.escritorio = convite.escritorio
        perfil_usuario.save()

        # Atribui o papel de "Membro" por padrão
        try:
            papel_membro = Papel.objects.get(escritorio=convite.escritorio, nome="Membro")
            perfil_usuario.papeis.add(papel_membro)
        except Papel.DoesNotExist:
            # Opcional: logar que o papel padrão não foi encontrado
            pass

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

        # Associa o escritório ao perfil de usuário existente
        perfil_usuario = self.request.user.perfil
        perfil_usuario.escritorio = escritorio
        perfil_usuario.save()

        # --- Criação de Papéis e Permissões Padrão ---
        # Papel de Administrador com todas as permissões
        admin_papel = Papel.objects.create(nome="Administrador", escritorio=escritorio)
        todas_permissoes = Permissao.objects.all()
        admin_papel.permissoes.set(todas_permissoes)

        # Papel de Membro com permissões básicas
        membro_papel = Papel.objects.create(nome="Membro", escritorio=escritorio)
        permissoes_membro = Permissao.objects.filter(
            codename__in=[
                'ver_cliente', 'criar_cliente', 'editar_cliente',
                'ver_consulta', 'criar_consulta',
                'ver_analise', 'criar_analise',
            ]
        )
        membro_papel.permissoes.set(permissoes_membro)

        # Atribui o papel de Administrador ao usuário que criou o escritório
        perfil_usuario.papeis.add(admin_papel)

from rest_framework.exceptions import NotFound

class MinhaEscritorioView(generics.RetrieveUpdateAPIView):
    """
    View para que um usuário possa ver e atualizar seu próprio escritório.
    """
    serializer_class = EscritorioSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_object(self):
        """Retorna o escritório associado ao usuário logado."""
        try:
            escritorio = self.request.user.perfil.escritorio
            if escritorio is None:
                raise NotFound("Nenhum escritório associado a este usuário.")
            return escritorio
        except PerfilUsuario.DoesNotExist:
            raise NotFound("Nenhum perfil de usuário associado a este usuário.")

class PermissaoListView(generics.ListAPIView):
    """ Lista todas as permissões disponíveis no sistema. """
    queryset = Permissao.objects.all()
    serializer_class = PermissaoSerializer
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'gerenciar_papeis'
    pagination_class = None

class PapelListCreateView(generics.ListCreateAPIView):
    """ Lista ou cria papéis para o escritório do usuário. """
    serializer_class = PapelSerializer
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'gerenciar_papeis'
    pagination_class = None

    def get_queryset(self):
        return Papel.objects.filter(escritorio=self.request.user.perfil.escritorio)

    def perform_create(self, serializer):
        serializer.save(escritorio=self.request.user.perfil.escritorio)

class PapelDetailView(generics.RetrieveUpdateDestroyAPIView):
    """ Recupera, atualiza ou deleta um papel específico. """
    serializer_class = PapelSerializer
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'gerenciar_papeis'

    def get_queryset(self):
        return Papel.objects.filter(escritorio=self.request.user.perfil.escritorio)

class PerfilUsuarioPapelUpdateView(generics.UpdateAPIView):
    """ Atualiza os papéis de um usuário específico. """
    queryset = PerfilUsuario.objects.all()
    serializer_class = PerfilUsuarioPapelUpdateSerializer
    permission_classes = [IsAuthenticated, HasPermission]
    required_permission = 'gerenciar_membros'

    def get_queryset(self):
        # Garante que só se pode editar usuários do próprio escritório
        return PerfilUsuario.objects.filter(escritorio=self.request.user.perfil.escritorio)