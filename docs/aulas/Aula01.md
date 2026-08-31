# Aula 01 — 12/08/2026

## Informações da disciplina

### Professor

Daniel Sadoc  
E-mail: `sadoc@ic.ufrj.br`

### Materiais e organização

- Classroom;
- Google Sheets — cronograma:
    - presenças;
    - agenda;
    - trabalhos em grupo;
    - provas antigas.

---

## Avaliação

Serão realizadas três provas:

\[
(P_1,P_2,P_3).
\]

A média das provas é calculada utilizando duas das três provas:

\[
MP = \frac{P_A+P_B}{2}.
\]

Além disso:

- $ME$: média dos exercícios;
- $NT$: nota do trabalho em grupo.

A média final é dada por:

\[
MF = 0{,}7MP + 0{,}15ME + 0{,}15NT + \text{bônus}.
\]

> **Observação:** há uma anotação associada à fórmula da média final
> envolvendo uma condição com $7{,}5$, mas o trecho manuscrito não está
> suficientemente legível para determinar seu significado com segurança.

---

## Livro-texto

**Computer Networking: A Top-Down Approach**, de James F. Kurose e Keith W. Ross.

Foram mencionadas as edições:

- 7ª;
- 8ª;
- 9ª.

---

## Organização do conteúdo

A disciplina está organizada em seis grandes tópicos.

### P1

1. Introdução;
2. Aplicação.

### P2

3. Transporte;
4. Rede — nível de dados.

### P3

5. Rede — nível de controle;
6. Acesso ao meio.

---

# Capítulo 1 — Uma visão geral sobre redes

## 1.1 — O que é a Internet?

A Internet pode ser estudada a partir de duas perspectivas:

- **visão física**;
- **visão lógica**.

### Visão física

Na visão física, observamos os componentes que formam a Internet e como eles estão interligados.

Entre esses componentes estão:

- **hosts** ou **end systems**;
- enlaces de comunicação;
- roteadores;
- outros equipamentos responsáveis pela comunicação entre os sistemas.

Os hosts ficam nas extremidades da rede e são os dispositivos nos quais as aplicações são executadas.

Assim:

\[
\text{host} = \text{endpoint} = \text{end system}.
\]

### Visão lógica

Na visão lógica, a Internet pode ser entendida a partir dos **serviços de comunicação** oferecidos às aplicações.

As aplicações utilizam a infraestrutura da rede para trocar informações entre sistemas diferentes.

A comunicação é realizada de acordo com **protocolos**, que estabelecem as regras utilizadas pelas partes envolvidas.

---

## 1.2 — Network Edge

A **network edge** (borda da rede) é a região da rede na qual estão localizados os sistemas finais (*end systems*).

Esses sistemas podem desempenhar diferentes funções durante uma comunicação, como:

- **cliente**;
- **servidor**.

A classificação depende da função exercida pelo sistema naquela comunicação.

Por exemplo, um cliente pode solicitar determinado serviço e um servidor pode responder a essa solicitação.

Os sistemas finais acessam o restante da Internet por meio de uma **rede de acesso**.

Assim, de forma simplificada:

\[
\text{Host}
\longrightarrow
\text{Rede de acesso}
\longrightarrow
\text{Internet}.
\]

> **[Inserir figura]** Representação feita em sala contendo um host,
> um roteador e o meio/rede de acesso.

---

## 1.3 — Network Core

A **network core** (núcleo da rede) corresponde à parte da infraestrutura responsável por interligar diferentes regiões da rede e permitir que os dados sejam encaminhados entre os sistemas finais.

Enquanto os hosts encontram-se na borda, o núcleo contém os dispositivos responsáveis por fazer com que os dados atravessem a rede até seu destino.

De maneira simplificada:

\[
\text{Network Edge}
\longleftrightarrow
\text{Network Core}
\longleftrightarrow
\text{Network Edge}.
\]

---

## 1.4 — Desempenho

Outro aspecto importante no estudo de redes é o seu **desempenho**.

Para analisar uma rede, não basta verificar se dois dispositivos conseguem se comunicar. Também é necessário observar características do comportamento da comunicação.

Uma dessas características mencionadas em aula é o **atraso**.

Como algumas propriedades da rede não são diretamente conhecidas, podemos realizar observações e utilizar ferramentas estatísticas para estimá-las.

---

## Estatística e estimadores

Uma **estatística** é uma variável aleatória definida como função de outras variáveis aleatórias.

Considere, por exemplo, três dados observados:

\[
D_1,D_2,D_3.
\]

Diferentes funções desses dados podem produzir estatísticas.

Por exemplo:

\[
P=D_1D_2D_3,
\]

\[
S=D_1+D_2+D_3,
\]

ou

\[
X=D_1^2+D_2^2+6D_1.
\]

Existem, portanto, diversas estatísticas que podem ser construídas a partir de um mesmo conjunto de dados.

### Estimador

Um **estimador** é uma estatística utilizada para estimar um parâmetro desconhecido.

Por exemplo, a média das observações pode ser utilizada como estimador:

\[
\hat{\mu}
=
\frac{D_1+D_2+D_3}{3}.
\]

A ideia é utilizar informações observáveis para inferir uma quantidade que não conhecemos diretamente.

---

## Estimadores em redes

O TCP utiliza estimadores para obter informações sobre características da rede.

Uma observação pode ser utilizada para atualizar uma estimativa:

\[
\text{observação}
\longrightarrow
\text{estimativa}.
\]

Um exemplo importante é a observação do **atraso** da comunicação.

Dessa forma, medidas realizadas durante o funcionamento da rede podem ser utilizadas para estimar características do seu comportamento.

---

## Network Tomography

A **network tomography** está relacionada à ideia de inferir características internas de uma rede a partir de informações que conseguimos observar.

A anotação feita em sala resume a ideia como:

> "Arte de ver por dentro."

Em outras palavras, busca-se obter informações sobre o que ocorre no interior da rede utilizando observações realizadas a partir de pontos acessíveis.

---

## 1.5 — Pilha de protocolos

A comunicação em uma rede é organizada por meio de **protocolos**.

### Protocolos

Um protocolo é um conjunto de regras que determina como ocorre a comunicação entre duas ou mais partes.

Um protocolo define aspectos como:

- o **formato** das mensagens;
- a **estrutura** das mensagens;
- a **sintaxe**;
- a **semântica**;
- a **ordem** em que as mensagens são trocadas;
- as **ações** realizadas quando uma mensagem é transmitida;
- as **ações** realizadas quando uma mensagem é recebida.

A **sintaxe** está relacionada à forma e à estrutura utilizadas para representar a informação.

A **semântica** está relacionada ao significado daquela informação dentro da comunicação.

Portanto, não basta que duas máquinas consigam fisicamente trocar dados: ambas precisam seguir regras compatíveis para interpretar corretamente a comunicação.

### Troca de mensagens

O funcionamento de um protocolo pode ser representado através de um diagrama temporal.

De maneira simplificada:

\[
\begin{array}{ccc}
\text{Parte A} & & \text{Parte B} \\
& \xrightarrow{\text{mensagem}} & \\
& \xleftarrow{\text{resposta}} &
\end{array}
\]

A ordem das mensagens e as ações realizadas após cada mensagem fazem parte da definição do protocolo.

> **[Inserir figura]** Diagrama temporal desenhado em sala representando
> a troca de mensagens entre duas partes.

---

## Serviços, APIs e protocolos

Na visão lógica da rede, os computadores oferecem ou utilizam serviços por meio de mecanismos bem definidos.

As aplicações podem utilizar uma **API (Application Programming Interface)** para acessar funcionalidades disponibilizadas pelo sistema.

É importante distinguir:

- **serviço**: aquilo que é oferecido;
- **API**: interface utilizada para acessar determinada funcionalidade;
- **protocolo**: conjunto de regras utilizado na comunicação entre as partes.

Assim, aplicações executadas em hosts diferentes podem utilizar os serviços da rede e se comunicar seguindo protocolos previamente estabelecidos.