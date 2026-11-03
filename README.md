# CorefitPro

Plataforma de gestão de alunos, avaliações físicas, exercícios e planos de treino.

## Executar

1. Inicie o PostgreSQL e o backend em `C:\Projects\ws-intelliJ\corefitpro`.
2. No backend, execute `mvn spring-boot:run`. O Flyway aplica as migrações pendentes automaticamente.
3. No frontend, execute `npm install` e `npm run dev`.
4. Acesse o endereço mostrado pelo Vite e entre com uma conta cadastrada.

A API usa `http://localhost:8080` por padrão. Para outro endereço, copie `.env.example` para `.env.local`, ajuste `VITE_API_URL` e reinicie o Vite. Configure também a origem do frontend em `cors.originPatterns` no backend. Na hospedagem, redirecione rotas do frontend para `index.html` para suportar navegação direta.

## Contas de desenvolvimento

As contas iniciais do banco usam o primeiro nome em minúsculas como usuário e senha, conforme os seeds existentes:

- Personal: `lucas` / `lucas`.
- Aluno: `mateus` / `mateus`.

O acesso usa o mesmo formulário de login. O perfil da conta determina automaticamente a área de destino. As credenciais de alunos cadastrados pelo personal são as informadas no cadastro. Não há bypass de autenticação.

## Fluxos

- Personal: alunos, cadastro de acesso, exercícios com mídia, treinamentos, plano semanal, avaliações físicas e histórico.
- Plano de treino: descrição, objetivo, meta e dias são persistidos em uma única transação. O backend mantém um plano ativo por aluno.
- Aluno: semana atual, objetivo e meta, detalhes dos exercícios com séries, repetições, imagens e vídeos; conclusão e desfazer conclusão por treino.
- A conclusão pertence à semana atual, com reinício semanal no fuso de São Paulo. O personal vê o progresso atualizado ao recarregar o painel.
- Conta: edição de dados, alteração de senha, tema persistido neste dispositivo e encerramento de sessão.

## Verificações

`npm run build` verifica TypeScript e gera o pacote de produção em `dist/`.
`npm run lint` verifica o código frontend.
No backend, `mvn package -DskipTests` compila e empacota sem executar testes.

As imagens e vídeos armazenados dependem do serviço B2 configurado no backend. Links do YouTube são exibidos por incorporação; a disponibilidade depende das permissões do vídeo.

## Organização

Os serviços concentram as chamadas HTTP; os hooks das páginas concentram estado, consultas e ações. A área do aluno está em `src/pages/AlunoPortal`. Seus endpoints usam a identidade autenticada em `/api/student/v1`, e não um identificador de aluno enviado pelo navegador.
