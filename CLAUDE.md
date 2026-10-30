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
- **Perfil:** perfil local demonstrativo, com foto, e-mail, data de criação, edição e exclusão (regras na seção 6).
- **Configurações:** tema, limpeza dos dados locais e créditos.
- **Formulário de tarefas:** criação e edição.

A navegação utilizará Bottom Tabs e Native Stack. A distribuição definitiva das rotas deverá respeitar os requisitos e a estrutura existente.

O cabeçalho será compartilhado, com título dinâmico conforme a tela ativa e avatar clicável para abrir o Perfil. O avatar exibe a foto do perfil quando existir e o avatar padrão caso contrário, refletindo alterações da foto sem reiniciar o aplicativo. Na própria tela Perfil, o avatar do cabeçalho deverá ser ocultado.

## 6. Perfil, imagens e temas

O aplicativo não possui autenticação real nem backend. O perfil é demonstrativo e seus dados serão armazenados localmente.

A tela Perfil deverá permitir escolher uma foto da galeria ou utilizar a câmera, respeitando as permissões do dispositivo. Trate cancelamentos, recusas de permissão e erros sem causar falhas no aplicativo.

A imagem selecionada deve continuar disponível após fechar e reabrir o aplicativo. Não dependa exclusivamente da URI temporária do seletor nem presuma que imagem em cache seja permanente. Use os recursos já instalados no projeto, verificando a API compatível com a versão atual do Expo. Dependência adicional ou alteração de configuração exige aprovação.

O usuário poderá alternar entre os temas claro e escuro. A preferência deverá persistir após o fechamento do aplicativo e ser aplicada consistentemente à interface.

### Perfil (decisões aprovadas)

Perfil local, sem autenticação real, servidor ou backend, persistido com AsyncStorage. Campos:
- `name`: obrigatório.
- `email`: obrigatório, com formato validado.
- `photoUri`: opcional (caminho ou referência da foto).
- `createdAt`: gerado automaticamente na criação e nunca alterado pela edição.
- Cor da borda da foto, persistida junto ao perfil e escolhida somente entre **azul** e **verde-claro**; outras cores exigem autorização. A espessura da borda é fixa.

Nome e e-mail permanecem obrigatórios (e-mail com formato validado). O desenvolvedor está autorizado a definir limites máximos razoáveis de entrada para ambos e a validá-los de forma coerente; são limites da interface, não regras de negócio imutáveis.

Sem perfil cadastrado, a tela exibe o avatar padrão, botões para escolher foto na galeria e tirar foto com a câmera, campos obrigatórios de nome e e-mail e o botão **Criar perfil**, que valida os campos. A câmera só é usada após a permissão do usuário. A foto é opcional; sem ela, exibe-se o avatar padrão.

Com perfil cadastrado, a tela exibe foto, nome, e-mail, data de criação e os botões **Editar perfil** (abre formulário de edição com validação), **Excluir dados do usuário** e **Excluir conta**. O cabeçalho da tela mostra apenas o título, sem o avatar.

Exclusões, independentes e irreversíveis, cada uma com diálogo de confirmação próprio e texto que deixe clara a diferença:
- **Excluir dados do usuário:** remove somente o perfil e a foto armazenada localmente. Preserva todas as tarefas e a preferência de tema atual (`light` ou `dark`). A tela Perfil volta ao estado inicial de criação de perfil.
- **Excluir conta:** remove o perfil, a foto armazenada localmente, todas as tarefas e a preferência de tema salva. O tema volta ao padrão `light` e o aplicativo retorna ao estado inicial.

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
- Excluir os dados do usuário ou a conta (seção 6).
- Excluir todos os dados locais.

Utilize diálogos adequados, preferencialmente do React Native Paper. Cancelar deve manter os dados inalterados.

Os efeitos da exclusão de dados do usuário e da conta estão definidos na seção 6. Antes de implementar a limpeza completa em Configurações, confirme quais informações serão removidas e como ela se relaciona com "Excluir conta".

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
- Relação entre "Excluir conta" e a limpeza de dados locais de Configurações.
- API de `expo-file-system` (SDK 58) para persistir a foto: decisão técnica da implementação.
- Nomes dos desenvolvedores, versão e endereço definitivo do repositório.

Quando uma decisão pendente afetar a tarefa atual, apresente a dúvida e aguarde aprovação. Não bloqueie trabalhos independentes que não dependam dela.

Este arquivo define as regras gerais do projeto. Incorpore futuras decisões aprovadas quando alterarem essas regras e mantenha a documentação concisa, evitando repetições.