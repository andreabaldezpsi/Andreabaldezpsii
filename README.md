# Site Andréa Baldez — Psicóloga e Neuropsicóloga

Site responsivo de apresentação profissional e atendimento online. O agendamento é feito exclusivamente pelo WhatsApp: **(21) 96571-8806**.

## Conteúdo
- Página inicial com a fotografia fornecida.
- Sobre, serviços e formação acadêmica.
- Mensagens de acolhimento e saúde mental.
- Botões de WhatsApp.
- Favicon próprio.
- Sala experimental de áudio e vídeo com WebRTC e servidor de sinalização por WebSocket (sem Google Meet).

## Rodar localmente
É necessário Node.js 18 ou superior.

```bash
npm install
npm start
```

Abra `http://localhost:3000`. Em localhost, os navegadores normalmente permitem câmera e microfone. Para acesso externo, configure HTTPS/WSS.

## Publicar no GitHub
1. Crie um repositório no GitHub.
2. Envie todos os arquivos e a pasta `public`.
3. Para executar o servidor, publique em um serviço que aceite aplicações Node.js (por exemplo, Render, Railway ou VPS). O GitHub Pages sozinho hospeda arquivos estáticos e **não executa** `server.js`, portanto não habilita a sala de vídeo.
4. Configure domínio e certificado TLS/HTTPS no serviço de hospedagem.
5. Teste a sala com dois dispositivos e redes diferentes. Algumas redes podem exigir um servidor TURN para estabelecer chamadas; este projeto inclui STUN, mas não inclui TURN.

## Sobre a sala de áudio e vídeo
O servidor encaminha apenas mensagens de sinalização para iniciar a conexão. O áudio e o vídeo são transmitidos entre os navegadores via WebRTC. O protótipo permite duas pessoas por sala; compartilhe o código apenas com o paciente agendado. O código da sala não substitui autenticação profissional.

**Importante antes de usar com pacientes reais:** esta é uma base técnica inicial, não uma plataforma clínica pronta ou certificada. Antes de oferecer atendimentos reais, contrate revisão técnica e de segurança, implemente autenticação individual, códigos de sala temporários e não previsíveis, controle de acesso, política de privacidade e tratamento de dados conforme a LGPD, gestão de incidentes e avaliação das exigências éticas e profissionais aplicáveis. Não grave chamadas nem armazene dados clínicos neste protótipo. Use apenas após validação de segurança e adequação profissional.

## Personalização
- Foto: `public/andrea-baldez.webp`
- Conteúdo: `public/index.html`
- Aparência: `public/style.css`
- Interações e chamada: `public/app.js`
- Ícone: `public/favicon.svg`
- Servidor de sinalização: `server.js`

As formações e dados profissionais exibidos foram inseridos conforme as informações fornecidas no pedido.
