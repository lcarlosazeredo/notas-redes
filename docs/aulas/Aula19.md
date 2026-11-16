# Aula 19 — 23/10/2026

> **Base principal:** anotações manuscritas da aula.  
> **Complementos:** *Computer Networking: A Top-Down Approach*, 8ª ed., Kurose & Ross, principalmente Seções 3.7.2–3.8 e Capítulo 4.  
> Quando o livro esclarece ou corrige uma anotação abreviada feita em sala, isso é indicado explicitamente.

## Controle de Congestionamento — Continuação

A aula começou retomando as diferentes formas de implementar controle de congestionamento.

De maneira geral, podemos separar os mecanismos em:

- mecanismos que **não recebem ajuda explícita da rede**;
- mecanismos que recebem **sinalização da rede**.

---

## Controle sem ajuda explícita da rede

Quando o protocolo não recebe uma indicação explícita dos roteadores, precisa inferir o estado da rede a partir do comportamento observado fim a fim.

Nas anotações aparecem duas ideias.

### Controle reativo

O transmissor reage depois que observa um sinal de problema.

No TCP clássico, os principais sinais são:

- **três ACKs duplicados**;
- **timeout**.

Esses eventos são utilizados como indícios de perda e, consequentemente, de possível congestionamento.

Protocolos/variantes discutidos nas aulas anteriores incluem:

- TCP Tahoe;
- TCP Reno;
- TCP CUBIC.

Esses mecanismos são predominantemente **loss-based**, isto é, utilizam eventos de perda como sinal importante para ajustar a janela.

### Controle baseado em medidas do caminho

Também foi anotada a ideia de mecanismos que tentam perceber o congestionamento antes ou sem depender exclusivamente da perda.

Entre os sinais possíveis estão:

- atraso;
- RTT;
- estimativas de banda disponível;
- quantidade de dados em trânsito.

O **BBR** aparece nas anotações associado a essa segunda linha de mecanismos.

> **Complemento do Kurose:** o livro apresenta BBR junto aos mecanismos de controle que utilizam medições do caminho. A ideia é modelar características como largura de banda disponível e RTT, em vez de utilizar somente perdas como sinal.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.2, pp. 275–276.

---

## Controle com ajuda da rede — ECN

Outra possibilidade é a própria rede informar que está entrando em congestionamento.

O mecanismo citado foi:

**ECN — Explicit Congestion Notification**

De forma simplificada:

```text
Sender
   |
   v
Router congestionado
   |
   | marca o pacote
   v
Receiver
   |
   | informa no ACK
   v
Sender
```

Assim, o roteador pode sinalizar congestionamento antes que seja necessário descartar o pacote.

No mecanismo ECN:

1. um roteador marca o datagrama IP;
2. o receptor identifica essa marca;
3. o receptor informa o transmissor através do ACK TCP;
4. o transmissor reduz sua taxa/janela.

Portanto:

$$
\boxed{
\text{ECN permite sinalização explícita de congestionamento}
}
$$

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.2, pp. 274–275.

---

## Variantes de TCP e estratégias de controle

As anotações agrupam diferentes estratégias estudadas:

### TCP Tahoe / Reno

O comportamento clássico utiliza:

- Slow Start;
- AIMD;
- perdas detectadas por timeout ou ACKs duplicados.

A janela apresenta o conhecido comportamento em dente de serra.

### TCP CUBIC

O CUBIC modifica a maneira como a janela cresce em Congestion Avoidance.

Em vez de crescer sempre linearmente, busca retornar mais rapidamente para próximo da janela anterior à perda:

$$
W_{\max}.
$$

Depois aproxima-se de $W_{\max}$ de forma mais cautelosa.

### TCP BBR

O BBR busca controlar a taxa a partir de um modelo do caminho, levando em conta características como:

- largura de banda;
- RTT.

Nas anotações aparece novamente a relação com o produto delay-banda:

$$
\boxed{
BDP
=
\text{bandwidth}\times RTT
}
$$

---

## Atraso × Throughput

Foi destacada novamente a relação entre:

- atraso;
- throughput.

Aumentar muito a quantidade de dados em trânsito pode aumentar a utilização da rede, mas também pode fazer com que filas cresçam.

Assim, existe um compromisso:

$$
\boxed{
\text{alta utilização}
\not\Rightarrow
\text{baixo atraso}
}
$$

Uma rede pode possuir throughput elevado e, ao mesmo tempo, apresentar atrasos de fila muito grandes.

O objetivo de um bom mecanismo de controle é utilizar bem a capacidade disponível sem criar filas excessivas.

---

## `cwnd`

A variável:

$$
cwnd
$$

é a **congestion window** do TCP.

Ela limita a quantidade de dados que o transmissor pode manter na rede sem ainda ter recebido confirmação.

De maneira simplificada:

$$
\boxed{
cwnd
\approx
\text{quantidade máxima de dados não confirmados permitida pelo controle de congestionamento}
}
$$

A taxa de envio está relacionada aproximadamente a:

$$
\boxed{
\text{TCP rate}
\approx
\frac{cwnd}{RTT}
}
$$

Portanto:

- `cwnd` maior $\Rightarrow$ maior taxa potencial;
- `cwnd` menor $\Rightarrow$ menor taxa.

---

## Fairness — Justiça no compartilhamento da rede

A aula retoma o problema de **fairness**.

Considere duas conexões TCP compartilhando um enlace gargalo de capacidade:

$$
R.
$$

Sejam:

- $x_1$: throughput da conexão 1;
- $x_2$: throughput da conexão 2.

### Linha de eficiência

Para utilizar toda a capacidade disponível:

$$
\boxed{
x_1+x_2=R
}
$$

Essa é a linha de **utilização completa da banda**.

### Linha de justiça

Para que as duas conexões recebam a mesma parcela:

$$
\boxed{
x_1=x_2
}
$$

O ponto simultaneamente justo e eficiente é:

$$
\boxed{
x_1=x_2=\frac{R}{2}
}
$$

Graficamente:

```text
x2
^
| R •
|   \
|    \
|     \       x1 + x2 = R
|      \
|       •  ponto justo e eficiente
|      /
|     /  x1 = x2
|    /
|___/________________________> x1
    R
```

### AIMD converge para uma divisão justa

Sob hipóteses simplificadoras, o AIMD tende a aproximar duas conexões TCP do ponto:

$$
\left(
\frac{R}{2},
\frac{R}{2}
\right).
$$

A ideia é:

- **Additive Increase:** ambas aumentam aproximadamente a mesma quantidade;
- **Multiplicative Decrease:** ambas reduzem proporcionalmente quando ocorre congestionamento.

Esse movimento tende a aproximar as taxas da linha de justiça ao mesmo tempo em que as conexões continuam sondando a capacidade disponível.

### Hipóteses da análise

A análise de fairness apresentada pelo Kurose considera condições como:

- mesmo RTT;
- mesmo MSS;
- conexões de longa duração;
- ambas compartilhando o mesmo enlace gargalo;
- ausência de tráfego UDP interferindo;
- análise na região de Congestion Avoidance.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.3, pp. 276–278.

---

## A justiça do TCP é por conexão

Foi feita uma correção importante em aula:

> A justiça do TCP é **por conexão**, e não necessariamente por usuário ou aplicação.

Se um usuário abre várias conexões TCP paralelas, pode obter uma parcela maior da capacidade total.

Por exemplo, se existem:

- usuário A com 1 conexão;
- usuário B com 3 conexões;

o controle de congestionamento enxerga, de forma simplificada:

$$
4\text{ conexões TCP}
$$

e não:

$$
2\text{ usuários}.
$$

Assim, B pode acabar recebendo uma parcela maior da banda.

> **Complemento do Kurose:** o livro usa justamente conexões HTTP paralelas como exemplo de como uma aplicação pode obter uma parcela maior da largura de banda.

---

## Estados do controle de congestionamento TCP

As anotações retomam três estados principais:

- **Slow Start**;
- **Congestion Avoidance**;
- **Fast Recovery**.

Uma representação simplificada é:

```text
          cwnd >= ssthresh
+------------+ -------------> +----------------------+
| Slow Start |                | Congestion Avoidance |
+------------+                +----------------------+
      |                                 |
      | 3 ACKs duplicados               | 3 ACKs duplicados
      v                                 v
              +------------------+
              |  Fast Recovery   |
              +------------------+
```

### Slow Start

Crescimento aproximadamente exponencial:

$$
1,\ 2,\ 4,\ 8,\ 16,\ldots
$$

em unidades de MSS por RTT.

### Congestion Avoidance

Crescimento aproximadamente linear:

$$
\boxed{
+1\ MSS
\text{ por RTT}
}
$$

### Fast Recovery

Permite reagir a perdas detectadas por ACKs duplicados sem retornar necessariamente ao início completo do Slow Start.

> **Observação:** esses são estados do algoritmo de controle de congestionamento. A máquina de estados completa do TCP inclui também estados relacionados ao estabelecimento e à finalização da conexão.

---

## QUIC

Foi citado:

**QUIC — Quick UDP Internet Connections**

Nas anotações aparece a ideia de:

> “basicamente uma implementação do TCP em cima do UDP”.

### Correção / precisão conceitual

Essa frase é útil como intuição, mas não é tecnicamente exata.

O QUIC:

- utiliza UDP como transporte subjacente;
- implementa confiabilidade;
- implementa controle de congestionamento;
- possui múltiplos streams;
- integra mecanismos criptográficos;
- executa essas funções acima do UDP.

Portanto, uma descrição mais precisa é:

$$
\boxed{
\text{QUIC oferece sobre UDP vários serviços que tradicionalmente associamos ao TCP + TLS}
}
$$

mas **QUIC não é simplesmente TCP encapsulado em UDP**.

Uma representação é:

```text
HTTP/3
  |
QUIC
  |
UDP
  |
IP
```

### Latência de estabelecimento

Nas anotações aparece a ideia de reduzir RTTs necessários para começar a transferência.

A vantagem do QUIC é integrar estabelecimento de conexão e segurança de forma mais eficiente.

> **Observação:** não é correto afirmar de forma universal que QUIC “sempre gasta exatamente 1 RTT enquanto TCP gasta RTT + TLS”. O número exato depende da situação, incluindo se a conexão é nova ou retomada.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.8, pp. 279–282.

---

# Fim do Capítulo 3

A aula marca o encerramento do Capítulo 3.

Os dois grandes blocos finais foram:

- **confiabilidade**;
- **controle de congestionamento**.

A partir daqui, a disciplina passa da camada de transporte para a **camada de rede** e, em especial, para os roteadores.

---

# Capítulo 4 — Camada de Rede: Data Plane

Nas anotações:

> **Capítulo 4: Encaminhamento (*forwarding*)**

O estudo passa agora dos hosts nas bordas da rede para o funcionamento interno dos roteadores.

Também aparecem como próximos tópicos:

- endereçamento;
- funcionamento interno de um roteador.

> **Prova 2:** anotada para **18/11**.

---

## Forwarding × Routing

Uma distinção central é entre:

- **forwarding**;
- **routing**.

### Forwarding — Encaminhamento

Forwarding responde à pergunta:

> Um pacote acabou de chegar a um roteador. Para qual porta de saída ele deve ser enviado?

É uma operação **local ao roteador**.

De forma simplificada:

$$
\boxed{
\text{pacote chega}
\rightarrow
\text{consulta à tabela}
\rightarrow
\text{porta de saída}
}
$$

O roteador utiliza uma tabela já preenchida para decidir a saída correspondente.

### Routing — Roteamento

Routing responde a uma pergunta mais global:

> Qual caminho os pacotes devem seguir da origem até o destino?

O roteamento é responsável por determinar os caminhos na rede e, consequentemente, ajudar a construir/preencher as tabelas utilizadas no forwarding.

Assim:

$$
\boxed{
\text{Routing}
\Rightarrow
\text{define caminhos}
}
$$

e:

$$
\boxed{
\text{Forwarding}
\Rightarrow
\text{executa localmente a decisão}
}
$$

**Referência:** Kurose & Ross, 8ª ed., Capítulo 4, Seção 4.1.

---

## Próximos tópicos de roteamento

Nas anotações são citados para a sequência:

- Dijkstra;
- Bellman-Ford;
- BGP.

No Kurose, esses temas aparecem principalmente no **Capítulo 5 — Network Layer: Control Plane**:

- Dijkstra → algoritmo de Link State;
- Bellman-Ford → algoritmo de Distance Vector;
- BGP → roteamento entre sistemas autônomos.

---

## Como funciona um roteador

Um roteador pode ser visto, em alto nível, como formado por:

- portas de entrada;
- *switching fabric*;
- portas de saída;
- processador de roteamento.

Uma representação simplificada:

```text
Portas de entrada
       |
       v
+------------------+
| Switching Fabric |
+------------------+
       |
       v
Portas de saída

        ^
        |
Routing Processor
```

**Referência:** Kurose & Ross, 8ª ed., Seção 4.2, Figura 4.4.

---

## Porta de entrada

Quando um pacote chega a uma porta de entrada, são realizadas funções relacionadas a:

- camada física;
- camada de enlace;
- consulta/lookup para encaminhamento;
- eventual enfileiramento.

Para encaminhamento tradicional baseado no destino, o roteador analisa o:

$$
\boxed{
\text{IP de destino}
}
$$

e consulta a tabela de forwarding para determinar a porta de saída.

> **Complemento:** no forwarding generalizado, estudado mais adiante, decisões podem utilizar diversos campos do cabeçalho, e não apenas o endereço IP de destino.

---

## Switching Fabric

O **switching fabric** conecta internamente:

$$
\text{portas de entrada}
\longrightarrow
\text{portas de saída}.
$$

Sua função é transferir o pacote internamente para a saída correta.

O Kurose apresenta diferentes formas de implementação:

- via memória;
- via barramento (*bus*);
- via rede de interconexão.

**Referência:** Kurose & Ross, 8ª ed., Seção 4.2.2, pp. 317–319.

---

## Filas dentro do roteador

Filas podem aparecer:

- nas portas de entrada;
- nas portas de saída.

### Filas na entrada

Se pacotes chegam mais rapidamente do que o switching fabric consegue transferi-los, pode ocorrer fila na entrada.

### Head-of-Line Blocking — HOL

Foi destacado em aula o problema de:

**Head-of-Line Blocking**

ou:

**HOL blocking**.

Considere uma fila FIFO na entrada:

```text
entrada
  |
  v

[A][B][C][D]
 ^
 primeiro pacote
```

Se o primeiro pacote deseja uma saída momentaneamente ocupada, ele pode bloquear os pacotes que estão atrás dele, mesmo que alguns desses pacotes desejem outras saídas livres.

Assim:

$$
\boxed{
\text{pacote no início da fila}
\Rightarrow
\text{pode bloquear pacotes posteriores}
}
$$

Esse é o **Head-of-Line Blocking**.

---

## Filas na saída

Mesmo que o switching fabric seja rápido, vários pacotes provenientes de diferentes entradas podem querer utilizar simultaneamente a mesma porta de saída.

Nesse caso:

$$
\text{taxa agregada chegando à saída}
>
\text{taxa do enlace de saída}
$$

e forma-se uma fila na saída.

É nessa fila que podem ocorrer:

- atraso;
- descarte de pacotes quando o buffer enche;
- necessidade de uma política de escalonamento.

---

## FIFO e outras disciplinas

Uma forma simples de atender a fila é:

**FIFO — First In, First Out**

ou seja:

$$
\boxed{
\text{primeiro a chegar}
\rightarrow
\text{primeiro a sair}
}
$$

Entretanto, nem sempre FIFO é a melhor estratégia.

Dependendo do serviço desejado, pode ser necessário utilizar outras políticas, por exemplo:

- prioridades;
- divisão de serviço entre classes;
- políticas de escalonamento diferentes.

A aula deixa essa ideia ligada à necessidade de implementar serviços mais sofisticados do que um simples FIFO.

---

## Plano de Dados e Plano de Controle

A camada de rede pode ser dividida conceitualmente em:

- **Data Plane**;
- **Control Plane**.

### Data Plane

O plano de dados executa o forwarding.

Ele responde localmente:

> Dado este pacote, para qual saída ele deve ir?

O plano de dados precisa operar muito rapidamente.

Por isso, grande parte dessas funções é implementada em hardware.

### Control Plane

O plano de controle cuida da lógica de rede responsável por determinar como as tabelas devem ser construídas.

Entre suas funções estão:

- roteamento;
- cálculo de caminhos;
- atualização de tabelas;
- gerenciamento da rede.

Essas operações ocorrem em escalas de tempo muito maiores do que o forwarding.

Assim:

$$
\boxed{
\text{Data Plane}
\rightarrow
\text{rápido e local}
}
$$

$$
\boxed{
\text{Control Plane}
\rightarrow
\text{lógica de rede e mais lento}
}
$$

O Kurose destaca que o plano de dados pode operar em escala de nanossegundos, enquanto funções de controle tipicamente operam em milissegundos ou segundos.

**Referência:** Kurose & Ross, 8ª ed., Seção 4.2, pp. 311–313.

---

## Arquitetura tradicional

Na arquitetura tradicional, o próprio roteador possui:

- plano de dados;
- plano de controle.

Cada roteador executa seus protocolos de roteamento e utiliza essas informações para manter sua tabela de forwarding.

De forma simplificada:

```text
+------------------------+
|       Roteador         |
|                        |
|   Control Plane        |
|   - routing            |
|   - tabela             |
|         |              |
|         v              |
|   Data Plane           |
|   - forwarding         |
+------------------------+
```

---

## Software-Defined Networking — SDN

O **SDN — Software-Defined Networking** separa mais claramente:

- plano de dados;
- plano de controle.

Nas anotações:

> o roteador passa a se preocupar principalmente em encaminhar, enquanto a lógica de controle fica a cargo de uma entidade separada.

### Arquitetura simplificada

```text
        Control Plane
+---------------------------+
| Controlador SDN           |
| aplicações de controle    |
+---------------------------+
             |
             | instala regras/tabelas
             v
-----------------------------------------
             |
       Data Plane
   +---------+  +---------+
   | Switch  |  | Switch  |
   +---------+  +---------+
```

Os dispositivos do plano de dados continuam executando as decisões de forwarding rapidamente.

O controlador calcula e gerencia as regras que serão instaladas nesses dispositivos.

### Controlador logicamente centralizado

Uma precisão importante do Kurose é que o controlador é:

$$
\boxed{
\text{logicamente centralizado}
}
$$

Isso não significa necessariamente um único servidor físico.

Ele pode ser implementado de forma distribuída para:

- escalabilidade;
- disponibilidade;
- tolerância a falhas.

**Referência:** Kurose & Ross, 8ª ed., Capítulo 5, Seção 5.5.

### Correção sobre a evolução histórica

Nas anotações aparece a ideia de que, antes do SDN, plano de dados e plano de controle ficavam juntos no roteador.

Isso representa corretamente o modelo tradicional predominante.

Entretanto, dizer que “até 2000 só existia isso” é uma simplificação histórica. O Kurose destaca que ideias de separação entre planos já possuíam antecedentes, enquanto a arquitetura SDN moderna ganhou força posteriormente.

---

## O que o roteador observa para encaminhar?

Para o forwarding tradicional baseado em destino, uma informação fundamental do cabeçalho é:

$$
\boxed{
\text{IP de destino}
}
$$

A partir desse valor, o roteador realiza um lookup e decide para qual porta de saída enviar o datagrama.

Assim:

```text
Datagrama recebido
       |
       v
Lê IP de destino
       |
       v
Consulta tabela de forwarding
       |
       v
Escolhe porta de saída
```

Esse processo precisa ocorrer para cada datagrama recebido.

---

## Resumo

Os principais tópicos desta aula foram:

- continuação do controle de congestionamento;
- mecanismos sem ajuda explícita da rede;
- controle loss-based;
- mecanismos baseados em medições do caminho;
- ECN;
- Tahoe, Reno, CUBIC e BBR;
- `cwnd`;
- atraso × throughput;
- fairness;
- linha de utilização completa:

$$
x_1+x_2=R;
$$

- linha de justiça:

$$
x_1=x_2;
$$

- AIMD convergindo para uma divisão justa sob hipóteses simplificadoras;
- justiça TCP por conexão;
- estados:
  - Slow Start;
  - Congestion Avoidance;
  - Fast Recovery;
- QUIC;
- fim do Capítulo 3;
- início do Capítulo 4;
- forwarding × routing;
- funcionamento interno de roteadores;
- filas de entrada e saída;
- FIFO;
- Head-of-Line Blocking;
- Data Plane;
- Control Plane;
- arquitetura tradicional;
- SDN;
- IP de destino e tabela de forwarding.
