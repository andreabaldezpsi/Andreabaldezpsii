# Andréa Baldez | Psicóloga e Neuropsicóloga

Site profissional de atendimento psicológico online.

## Informações
- Andréa Conceição Baldez de Souza
- Psicóloga e Neuropsicóloga
- CRP 05/78747
- Agendamentos pelo WhatsApp: (21) 96571-8806

## Formação acadêmica
- Graduação em Psicologia — Centro Universitário Celso Lisboa
- Pós-graduação em Neuropsicologia
- Pós-graduação em Psicologia Aplicada ao Trânsito
- Pós-graduação em Psicanálise

## Executar o site
Requer Node.js 18 ou superior.

```bash
npm install
npm start
```

Depois, acesse `http://localhost:3000`.

## Publicação
O projeto inclui a sala online de áudio e vídeo, que utiliza `server.js` e WebSocket. Para manter essa função, publique o projeto em uma hospedagem que execute Node.js e configure HTTPS. O GitHub Pages pode armazenar o código, mas não executa o servidor Node.js. Se publicar apenas no GitHub Pages, o site institucional e os botões de WhatsApp funcionarão, mas a sala de áudio e vídeo não ficará operacional.

## Arquivos
- `public/index.html`: conteúdo e seções do site.
- `public/style.css`: aparência e layout responsivo.
- `public/app.js`: menu e sala de áudio/vídeo.
- `public/andrea-baldez.webp`: foto da capa.
- `public/favicon.png` e `public/favicon.ico`: ícone do site.
- `server.js`: servidor web e sinalização da sala online.
