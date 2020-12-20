**RF**  ->  Requisitos Funcionais
**RNF** ->  Requisitos Não Funcionais
**RN**  ->  Regras de Negócio 

# Recuperação de senha

**RF**
- ✅ O usuário deve poder recuperar sua senha informando seu e-mail
- ✅ O usuário deve receber um e-mail com instruções de recuperação de senha
- ✅ O Usuário deve poder resetar sua senha

**RNF**
- ✅ Utilizar Mailtrap para testar envios em embiente de desenvolvimento
- ✅ Utilizar Amazon SES(Simple Email Service) para envios em produção
- ✅ O envio de e-mails deve acontecer em segundo plano (background job)

**RN**
- ✅ O link enviado por e-mail para resetar senha, deve expirar em 2h
- ✅ O usuário precisa confirmar a nova senha antes de resetar a sua senha

# Atualização de perfil

**RF**
- ✅ O usuário deve poder atualizar seu perfil (nome, email, senha)

**RNF**
- ✅ Nada

**RN**
- ✅ O usuário não pode alterar seu e-mail para um e-mail já utilizado
- ✅ Para atualizar sua senha, o usuário deve informar a senha antiga
- ✅ Para atualizar sua senha, o usuário precisa confirmar a nova senha

# Agendamento de serviços

**RF**
- O usuário deve poder listar todos os prestadores de serviço cadastrados
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador em específico
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador
- O usuário deve poder realizar um novo agendamento com um prestador

**RF**
- A listagem de prestadores deve ser armazenada em cache

**RNF**
- Cada agendamento deve durar uma hora
- Os agendamentos devem estar disponíveis entre 8h às 18h (primeiro horário às 8h, último às 17h)
- O usuário não pode agendar em um horário já ocupado
- O usuário não pode agendar um um horário que já passou
- O usuário não pode agendar serviços consigo mesmo

# Painel do prestador

**RN**
- O usuário deve poder listar seus agendamentos de um dia específico
- O prestador deve receber uma notificação sempre que houver um novo agendamento
- O prestador deve poder visualizar as notificações não lidas

**RNF**
- Os agendamentos do prestador no dia devem ser armazenados em cache
- As notificações do prestador devem ser armazenadas no MongoDB
- As notificações do prestador devem ser enviadas em tempo real utilizando Socket.io

**RN**
- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar