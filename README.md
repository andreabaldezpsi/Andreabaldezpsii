# Andréa Baldez — site com base de atendimento online protegido

Este pacote contém o site estático para GitHub Pages e um backend Supabase Edge Function que cria salas privadas no Daily.co. **É um ponto de partida técnico; não é certificação LGPD nem uma implantação pronta para uso clínico.**

## Arquitetura
- **GitHub Pages:** apenas arquivos públicos do site.
- **Supabase Auth:** login por e-mail e senha para a psicóloga.
- **Supabase Postgres + RLS:** perfil e metadados mínimos de salas; sem prontuários.
- **Supabase Edge Function:** valida JWT e verifica `profiles.role = psychologist`.
- **Daily.co:** salas privadas e tokens de reunião com expiração; token do profissional tem privilégio de owner, token do paciente não.

A documentação do Supabase recomenda validar JWT em Edge Functions e manter chaves secretas fora do navegador. Consulte os links no fim deste documento.

## 1. Criar os serviços
1. Crie um projeto no Supabase.
2. Crie uma conta para Andréa em **Authentication → Users**. Desative cadastro público de usuários; crie contas de pacientes por processo controlado, caso implemente portal de paciente no futuro.
3. Copie a URL do projeto e a chave **publishable** (ou anon legada).
4. Crie uma conta Daily.co e obtenha uma API key no painel.
5. Leia e aprove os termos, contrato de tratamento de dados, subprocessadores, região de processamento, retenção, transferências internacionais e controles de segurança de cada fornecedor antes de usar com pacientes.

## 2. Configurar o Supabase
1. No **SQL Editor**, execute `supabase/schema.sql`.
2. Em **Authentication → Users**, copie o UUID da conta da psicóloga.
3. No SQL Editor, execute o INSERT comentado no final do schema, substituindo o UUID real. Não dê a role `psychologist` a pacientes.
4. Mantenha RLS habilitado. Não crie políticas que permitam ao público ler ou alterar perfis/sessões.

## 3. Configurar o site
Edite `config.js`:
- `SUPABASE_URL`: URL do projeto.
- `SUPABASE_ANON_KEY`: chave publishable/anon.

Esses valores identificam o projeto e podem estar no navegador quando RLS está corretamente configurado. **Nunca coloque a chave `service_role` ou `DAILY_API_KEY` em `config.js`, HTML, JavaScript público ou GitHub.**

## 4. Configurar e publicar a função
Instale o Supabase CLI e faça login. Na pasta do projeto:
```bash
supabase link --project-ref SEU_PROJECT_REF
supabase secrets set DAILY_API_KEY=SUA_CHAVE_DAILY SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
supabase functions deploy create-session
```
A função mantém `verify_jwt = true` em `supabase/config.toml`. Não desative essa validação.
A `service_role` ignora RLS e deve existir somente como secret no backend. Proteja também a conta do painel Supabase com MFA e acesso restrito.

## 5. Publicar no GitHub Pages
1. Envie os arquivos do projeto ao repositório.
2. GitHub → **Settings → Pages** → **Deploy from a branch** → `main` → `/ (root)`.
3. Aguarde a URL HTTPS do GitHub Pages.
4. Em Supabase Auth → URL Configuration, configure a URL do site e os redirect URLs apropriados.
5. Teste o login, criação de sala, convite e entrada em dois dispositivos diferentes. Faça teste de expiração e de tentativa de acesso sem token.

## Fluxo da sessão
1. Andréa faz login no bloco “Área reservada”.
2. Clica em “Criar sala privada”.
3. O backend verifica a identidade e o papel da psicóloga.
4. O Daily cria sala privada e tokens temporários para profissional e paciente.
5. O site abre a sala da profissional e mostra um convite individual para enviar ao paciente por canal privado.
6. A sala expira após uma hora. Ajuste esse período conforme a política de atendimento.

O link do paciente funciona como uma credencial temporária: envie somente ao paciente correto e não publique em redes sociais. O exemplo não implementa convite de uso único, confirmação de identidade do paciente, agenda, prontuário ou controle de pagamento.

## Segurança, criptografia e LGPD — limites importantes
- A conexão com o site e APIs deve ser HTTPS/TLS. A mídia WebRTC usa os mecanismos de segurança do provedor/navegador. SSH serve para administração segura de servidores; não é o protocolo que criptografa a chamada de vídeo no navegador.
- AES-256 em repouso depende da configuração e das garantias verificáveis do provedor de banco/armazenamento. Não se deve afirmar que todo dado está criptografado com AES-256 sem confirmação contratual e técnica do fornecedor.
- O projeto não grava áudio/vídeo e não armazena conteúdo clínico. Não acrescente prontuários, anotações ou dados sensíveis sem arquitetura própria, controle de acesso, retenção, backup e avaliação jurídica/técnica.
- Antes de uso real, a profissional deve definir base legal, finalidade, transparência, aviso de privacidade, minimização, retenção e descarte, atendimento aos direitos dos titulares, plano de incidentes, controle de operadores/suboperadores e transferências internacionais.
- Faça avaliação profissional de risco e valide a adequação com assessoria jurídica/encarregado de dados e com as orientações atuais do CFP/CRP para serviços psicológicos mediados por tecnologia.
- Não prometa “conformidade LGPD” apenas por usar JWT, AES ou SSH. Conformidade depende também de processos, contratos, pessoas e operação.

## Arquivos
- `index.html`, `styles.css`, `script.js`: site e interface de sessão.
- `config.js`: somente URL e chave pública do Supabase.
- `supabase/schema.sql`: tabelas e políticas RLS.
- `supabase/functions/create-session/index.ts`: endpoint protegido para criar salas e tokens.
- `.gitignore`: evita arquivos locais de segredos.

## Documentação oficial
- Supabase — segurança de Edge Functions: https://supabase.com/docs/guides/functions/auth
- Supabase — secrets de Edge Functions: https://supabase.com/docs/guides/functions/secrets
- Supabase — proteção de dados e RLS: https://supabase.com/docs/guides/database/secure-data
- Daily — tokens e controle de acesso: https://www.daily.co/blog/get-started-with-the-daily-api/
