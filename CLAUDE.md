# TarefaFacil — Instruções do Projeto

## 1. Contexto

O **TarefaFacil** é um aplicativo acadêmico de lista de tarefas (To-Do List), desenvolvido para dispositivos móveis.

**Estrutura do projeto:**
- Repositório Git: raiz `TarefaFacil/`.
- Projeto Expo: diretório `TarefaFacil/app/`.

Execute comandos relacionados ao aplicativo dentro de `app/`, salvo necessidade técnica justificada. Antes de agir, identifique a estrutura real do projeto.

## 2. Stack obrigatória

- Expo
- React Native
- React
- TypeScript
- React Navigation: Bottom Tabs e Native Stack
- React Native Paper
- Expo Vector Icons
- AsyncStorage

Respeite as tecnologias definidas. Antes de instalar ou atualizar dependências, verifique as versões existentes, a compatibilidade com o SDK do Expo e a necessidade da alteração. Solicite autorização antes de adicionar dependências ou substituir tecnologias.

## 3. Regras de atuação

### Inspeção e planejamento

Antes de implementar:
1. Leia estas instruções e inspecione os arquivos relevantes.
2. Verifique a implementação existente e o estado do Git.
3. Identifique dependências, riscos e possíveis impactos.
4. Defina um plano proporcional à tarefa.

Não recrie estruturas ou funcionalidades existentes sem justificativa.

### Decisões e autorização

Não transforme suposições em requisitos. Quando uma decisão funcional ou técnica relevante estiver em aberto, apresente as alternativas, explique suas consequências e aguarde aprovação antes de implementar a parte afetada.

Diferencie requisitos aprovados, decisões pendentes e recomendações.

### Proteção do projeto

- Não sobrescreva alterações existentes sem autorização.
- Não exclua arquivos nem execute operações Git destrutivas.
- Não realize commits, pushes, merges ou alterações de histórico sem solicitação explícita.
- Não altere arquivos fora do escopo autorizado.
- Não recrie o projeto Expo existente.
- Não exponha nem registre segredos, tokens ou credenciais.
- Não instale ferramentas ou dependências desnecessárias.

## 4. Código e arquitetura

Mantenha uma arquitetura simples, organizada e proporcional ao projeto acadêmico.

- Separe telas, componentes compartilhados, navegação, tipos e persistência conforme a necessidade real.
- Utilize TypeScript com tipos explícitos; evite `any`.
- Prefira funções pequenas, nomes descritivos e responsabilidades claras.
- Evite duplicação de código, estados redundantes e abstrações desnecessárias.
- Centralize configurações compartilhadas quando isso simplificar a manutenção.
- Reaproveite componentes quando houver benefício concreto, sem criar camadas artificiais.

Respeite a estrutura existente. Defina novos diretórios somente após inspecionar o projeto.

## 5. Interface e navegação

A interface deve ser organizada, convencional e adequada a um aplicativo de produtividade. Evite estética futurista, efeitos excessivos e complexidade visual desnecessária.

Utilize React Native Paper e Expo Vector Icons, mantendo consistência de cores, espaçamentos, tipografia, acessibilidade e feedback visual. Considere estados de carregamento, erro e lista vazia quando aplicáveis.

O aplicativo terá as seguintes telas:
- **Principal:** indicadores de todas as tarefas, pendentes e vencidas; listagem com `FlatList`; ações de editar, concluir e excluir; botão flutuante para criar tarefas.
- **Concluídas:** listagem das tarefas concluídas e indicador do total concluído.
- **Perfil:** cadastro demonstrativo, foto, email, data de criação, edição e exclusão.
- **Configurações:** tema, limpeza dos dados locais e créditos.
- **Formulário de tarefas:** criação e edição.

A navegação utilizará Bottom Tabs e Native Stack. A distribuição definitiva das rotas deverá respeitar os requisitos e a estrutura existente.

O cabeçalho será compartilhado, com título dinâmico conforme a tela ativa e avatar clicável para abrir o Perfil. Na própria tela Perfil, o avatar do cabeçalho deverá ser ocultado.

## 6. Perfil, imagens e temas

O aplicativo não possui autenticação real nem backend. O perfil é demonstrativo e seus dados serão armazenados localmente.

A tela Perfil deverá permitir escolher uma foto da galeria ou utilizar a câmera, respeitando as permissões do dispositivo. Trate cancelamentos, recusas de permissão e erros sem causar falhas no aplicativo.

Defina a estratégia de persistência da imagem considerando sua disponibilidade após reinicializações. Não presuma que uma URI temporária ou imagem em cache seja permanente. Se a solução exigir uma dependência adicional ou decisão arquitetural relevante, solicite aprovação.

O usuário poderá alternar entre os temas claro e escuro. A preferência deverá persistir após o fechamento do aplicativo e ser aplicada consistentemente à interface.

## 7. Persistência e validação

Utilize AsyncStorage para persistir as tarefas, os dados do perfil e as preferências necessárias.

- Trate corretamente operações assíncronas e erros de leitura e gravação.
- Evite fontes de verdade duplicadas.
- Valide dados carregados quando houver possibilidade de inconsistência.
- Mantenha a interface sincronizada com os dados persistidos.
- Não armazene senhas ou credenciais.
- Não introduza backend, banco remoto ou sincronização externa.

Valide todos os campos manipuláveis pelo usuário, sem exigir bibliotecas externas de validação. Conforme cada campo, considere obrigatoriedade, espaços em branco, formato, limites, coerência dos valores e datas válidas.

Apresente mensagens claras e específicas. Não implemente regras de negócio ainda não aprovadas.

### Tarefas (decisões aprovadas)

Campos de `Task`: `id`, `title` (obrigatório), `description` (opcional), `dueDate` (data e horário obrigatórios), `completed`, `createdAt`, `updatedAt`. Datas armazenadas como strings ISO 8601. Sem categorias, etiquetas ou prioridades. Datas passadas são permitidas no formulário.

Indicadores, calculados a partir das tarefas carregadas e do horário local do dispositivo:
- **Todas:** todas as tarefas, inclusive as concluídas.
- **Pendentes:** `!completed && dueDate > agora`.
- **Vencidas:** `!completed && dueDate <= agora`.
- **Concluídas:** `completed`, independentemente do vencimento.

Pendentes e vencidas são grupos separados; tarefa concluída não entra em nenhum dos dois. Na tela Principal, Todas, Pendentes e Vencidas são clicáveis e filtram a lista, sem telas adicionais.

## 8. Exclusões e ações irreversíveis

Exija confirmação explícita antes de executar ações irreversíveis, incluindo:
- Excluir uma tarefa.
- Excluir o cadastro do perfil.
- Excluir todos os dados locais.

Utilize diálogos adequados, preferencialmente do React Native Paper. Cancelar deve manter os dados inalterados.

Antes de implementar a exclusão do perfil ou a limpeza completa, confirme quais informações serão removidas e os efeitos sobre tarefas e preferências.

## 9. Testes e qualidade

Identifique os comandos disponíveis antes de executar verificações.

Após as alterações, execute as verificações pertinentes e autorizadas, como TypeScript, lint, testes existentes e compilação ou exportação do Expo, conforme aplicável.

Nunca afirme que uma verificação passou sem executá-la. Informe falhas, limitações e verificações não realizadas. Não remova testes nem altere configurações apenas para ocultar erros.

## 10. Fluxo de trabalho

Trabalhe de forma incremental:

1. Inspecione o escopo e os arquivos afetados.
2. Apresente o plano e identifique decisões pendentes.
3. Obtenha autorização para mudanças de escopo, dependências novas ou decisões não aprovadas.
4. Implemente somente o que foi autorizado.
5. Execute verificações e revise possíveis regressões.
6. Apresente um relatório com alterações, arquivos afetados, verificações realizadas, problemas restantes e decisões pendentes.

Não avance automaticamente para outra funcionalidade após concluir a tarefa autorizada.

## 11. Decisões pendentes

Não presuma as seguintes definições:
- Ordenação das listas.
- Campos definitivos do perfil.
- Efeitos da exclusão do perfil sobre tarefas e preferências.
- Estratégia de persistência da foto.
- Nomes dos desenvolvedores, versão e endereço definitivo do repositório.

Quando uma decisão pendente afetar a tarefa atual, apresente a dúvida e aguarde aprovação. Não bloqueie trabalhos independentes que não dependam dela.

Este arquivo define as regras gerais do projeto. Incorpore futuras decisões aprovadas quando alterarem essas regras e mantenha a documentação concisa, evitando repetições.