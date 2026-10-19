# Aula 17 — 16/10/2026

> **Base da transcrição:** anotações manuscritas da aula.  
> **Complementos:** *Computer Networking: A Top-Down Approach*, 8ª ed., Kurose & Ross, principalmente Capítulo 3, Seções 3.5.4–3.7.2.  
> Quando o livro esclarece um trecho pouco legível ou corrige uma anotação, isso é indicado explicitamente.

## Retomada da aula anterior

Nas anotações aparece como referência a continuação a partir de aproximadamente **slide 88**.

### TCP combinando GBN e SR

O TCP foi retomado como uma combinação de características de:

- **GBN — Go-Back-N**:
  - ACKs cumulativos;
- **SR — Selective Repeat**:
  - retransmissões mais seletivas do que no GBN.

A anotação resume essa ideia como:

> **“O melhor do que os dois oferecem.”**

O Kurose classifica o mecanismo de recuperação de erros do TCP como um **híbrido entre GBN e SR**:

- os ACKs TCP são cumulativos, lembrando GBN;
- muitos receptores TCP armazenam segmentos fora de ordem;
- quando ocorre perda, o TCP não necessariamente retransmite toda a sequência posterior, como faria o GBN;
- com SACK (*Selective Acknowledgment*), o comportamento se aproxima ainda mais de SR.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.5.4, p. 246.

---

## Como o TCP detecta perda

Foi levantada a seguinte questão:

> Se a rede normalmente não informa diretamente que houve perda, quais sinais o TCP utiliza para perceber que algo deu errado?

No TCP clássico, dois sinais principais de perda são:

1. **timeout**;
2. recebimento de **três ACKs duplicados**.

Assim:

$$
\boxed{
\text{evento de perda}
=
\text{timeout}
\;\text{ou}\;
3\text{ ACKs duplicados}
}
$$

O TCP interpreta esses eventos como indícios de congestionamento na rede.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, pp. 264–265.

### Por que três ACKs duplicados são importantes?

Se um segmento se perde, mas segmentos posteriores continuam chegando ao receptor, o receptor continua indicando no campo de ACK o **próximo byte esperado**.

Isso gera ACKs repetidos.

Ao receber três ACKs duplicados, o transmissor possui evidência de que:

- a comunicação ainda está funcionando;
- segmentos posteriores chegaram;
- provavelmente existe uma lacuna causada por um segmento perdido.

Por isso, essa situação permite realizar **fast retransmit**, sem esperar pelo timeout.

### Timeout × três ACKs duplicados

As duas situações não são exatamente equivalentes.

**Timeout.**

Pode indicar uma situação de congestionamento mais severa, pois durante algum período o transmissor não recebeu confirmação suficiente para avançar.

**Três ACKs duplicados.**

Indicam que segmentos continuam chegando ao receptor, mas há uma lacuna na sequência.

Essa diferença será importante quando o TCP ajustar sua janela de congestionamento.

---

## ACK cumulativo no TCP

No TCP, o campo de ACK contém o **número do próximo byte esperado**.

Por exemplo, se todos os bytes até o byte 99 chegaram corretamente, o receptor pode enviar:

$$
ACK=100.
$$

Esse ACK confirma cumulativamente todos os bytes anteriores.

Portanto:

$$
\boxed{
ACK=n
\Rightarrow
\text{o receptor espera o byte }n
}
$$

Se existir uma lacuna, segmentos posteriores podem chegar, mas o receptor continua repetindo o mesmo ACK correspondente ao primeiro byte ausente.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.5.2, pp. 231–233.

---

## ECN — Explicit Congestion Notification

Nas anotações aparece **ECN** como uma forma moderna de sinalização de congestionamento.

No TCP clássico, o transmissor normalmente **infere congestionamento a partir de perda**.

Com **ECN**, a rede pode sinalizar congestionamento **antes que seja necessário descartar o pacote**.

O mecanismo envolve IP e TCP:

1. um roteador detecta congestionamento;
2. o roteador marca bits ECN no cabeçalho IP;
3. o receptor recebe essa indicação;
4. o receptor informa o transmissor usando o bit **ECE** no ACK TCP;
5. o transmissor reduz sua janela de congestionamento;
6. o transmissor pode indicar essa redução usando o bit **CWR**.

Assim:

$$
\boxed{
\text{ECN permite sinalizar congestionamento sem depender exclusivamente de perda}
}
$$

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.2, pp. 274–275.

---

## Controle de fluxo

O **controle de fluxo** serve para impedir que o transmissor envie dados mais rapidamente do que a aplicação receptora consegue consumi-los.

O receptor TCP possui um buffer de recepção.

Se a aplicação receptora lê os dados lentamente, esse buffer pode encher.

Para evitar o transbordamento, o receptor informa ao transmissor o espaço disponível por meio da:

**receive window — `rwnd`**

Assim:

$$
\boxed{
\text{controle de fluxo}
\Rightarrow
\text{proteger o buffer do receptor}
}
$$

O transmissor deve manter:

$$
\text{LastByteSent}
-
\text{LastByteAcked}
\leq
rwnd.
$$

**Referência:** Kurose & Ross, 8ª ed., Seção 3.5.5, pp. 246–248.

---

## Controle de fluxo × controle de congestionamento

Esses mecanismos possuem objetivos diferentes.

| Mecanismo | O que protege? | Informação principal |
|---|---|---|
| **Controle de fluxo** | receptor | `rwnd` |
| **Controle de congestionamento** | rede | `cwnd` |

No controle de fluxo, o próprio receptor conhece o estado de seu buffer e pode informar quanto espaço possui.

No controle de congestionamento, o transmissor normalmente precisa **inferir** o estado da rede a partir de sinais como:

- ACKs;
- perdas;
- três ACKs duplicados;
- timeout;
- eventualmente ECN.

### Janela efetiva do TCP

O Kurose explicita que a quantidade de dados ainda não confirmados deve respeitar tanto o controle de fluxo quanto o controle de congestionamento:

$$
\boxed{
\text{LastByteSent}
-
\text{LastByteAcked}
\leq
\min(cwnd,rwnd)
}
$$

Assim, de maneira simplificada:

$$
\boxed{
W_{\text{efetiva}}
=
\min(cwnd,rwnd)
}
$$

onde:

- `rwnd`: limite imposto pelo receptor;
- `cwnd`: limite imposto pelo estado estimado da rede.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, p. 264.

---

## TCP e máquina de estados

Nas anotações aparece:

> **TCP possui máquina de estados.**

Isso está relacionado ao fato de o TCP ser orientado à conexão e manter estado associado à conexão, incluindo:

- números de sequência;
- ACKs;
- buffers;
- variáveis de controle;
- estado da abertura e encerramento da conexão.

---

## Estabelecimento da conexão TCP

### 2-way handshake

A aula discute limitações de um handshake com apenas duas mensagens.

A ideia central é que mensagens antigas, duplicadas ou atrasadas podem causar ambiguidades sobre o estado real da conexão.

### 3-way handshake

O TCP utiliza um **3-way handshake**.

De forma simplificada:

```text
Cliente                               Servidor

SYN, seq = client_isn
------------------------------------->

                    SYNACK,
              seq = server_isn,
              ack = client_isn + 1
<-------------------------------------

ACK,
ack = server_isn + 1
------------------------------------->
```

As três etapas permitem que:

- o cliente informe seu número de sequência inicial;
- o servidor confirme o número do cliente e informe o seu próprio;
- o cliente confirme o número de sequência inicial do servidor.

Depois disso, a conexão está estabelecida.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.5.6, pp. 249–250, Figura 3.39.

### Correção importante sobre alocação de recursos

Nas anotações manuscritas aparece uma ideia semelhante a:

> “o recurso só é reservado quando se tem a confirmação de que haverá uma conexão”.

Para o **TCP convencional descrito pelo Kurose**, isso não está correto de forma geral.

O servidor, ao receber o SYN, pode **alocar buffers e variáveis antes do terceiro passo do handshake**.

É justamente essa característica que possibilita o ataque de **SYN flooding**, no qual várias conexões ficam parcialmente abertas consumindo recursos.

Uma defesa é o uso de **SYN cookies**, em que o servidor evita manter estado para o SYN inicial e só cria a conexão quando recebe o ACK válido.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.5.6 e quadro *The SYN Flood Attack*, pp. 249–254.

---

## Introdução ao controle de congestionamento

O problema central é:

> muitas fontes tentando enviar dados a taxas altas demais para a capacidade disponível na rede.

A retransmissão corrige a consequência de uma perda, mas não elimina sua causa.

Se pacotes são descartados porque filas de roteadores estão cheias, simplesmente retransmitir pode aumentar ainda mais a carga.

Assim:

$$
\boxed{
\text{perda pode ser sintoma de congestionamento}
}
$$

O objetivo do controle de congestionamento é limitar a taxa dos transmissores quando a rede está congestionada.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.6, pp. 255–262.

---

## Cenário 1 — Dois transmissores e buffer infinito

O primeiro cenário do Kurose considera:

- dois transmissores;
- um enlace compartilhado;
- capacidade do enlace igual a $R$;
- buffer do roteador infinito;
- nenhuma perda.

Se as duas conexões possuem a mesma taxa de envio $\lambda_{in}$, a carga total que chega ao enlace é:

$$
2\lambda_{in}.
$$

Para que exista equilíbrio:

$$
2\lambda_{in}<R.
$$

Equivalentemente:

$$
\lambda_{in}<\frac{R}{2}.
$$

### Throughput

Enquanto:

$$
0\leq\lambda_{in}<\frac{R}{2},
$$

cada conexão consegue throughput aproximadamente igual à sua taxa de envio:

$$
\lambda_{out}=\lambda_{in}.
$$

Quando a taxa tenta ultrapassar:

$$
\frac{R}{2},
$$

o throughput de cada conexão não consegue superar:

$$
\boxed{
\lambda_{out}\leq\frac{R}{2}
}
$$

porque ambas compartilham um enlace de capacidade total $R$.

### Atraso

O principal problema aparece no atraso.

Quando:

$$
\lambda_{in}\rightarrow\frac{R}{2}^{-},
$$

o atraso de fila cresce rapidamente.

Com buffer infinito, se:

$$
\lambda_{in}>\frac{R}{2},
$$

a fila cresce sem limite e o atraso médio tende ao infinito.

Portanto:

> alta utilização pode produzir throughput elevado, mas atraso extremamente grande.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.6.1, pp. 256–257, Figura 3.44.

---

## Cenário 2 — Buffer finito e retransmissões

O segundo cenário considera:

- dois transmissores;
- buffer finito;
- perdas quando o buffer está cheio;
- protocolo confiável com retransmissão.

É necessário distinguir:

- $\lambda_{in}$: taxa de **dados originais** gerados pela aplicação;
- $\lambda'_{in}$: carga efetivamente oferecida à rede, incluindo:
  - dados originais;
  - retransmissões.

Assim:

$$
\lambda'_{in}
\geq
\lambda_{in}.
$$

### Caso ideal

Primeiro, o livro considera um caso idealizado no qual o transmissor só envia quando há espaço disponível no buffer.

Nesse caso:

- não há perda;
- não há retransmissão;
- tudo o que é enviado é entregue.

### Retransmissão apenas quando a perda é certa

Em um cenário mais realista, pacotes que realmente se perdem precisam ser retransmitidos.

Parte da capacidade da rede passa então a ser usada para transportar **retransmissões**, e não novos dados.

Isso reduz o throughput útil.

### Timeout prematuro

Há ainda um custo adicional.

Um pacote pode estar apenas **atrasado na fila**, sem ter sido perdido.

Se o timeout ocorrer cedo demais:

1. o transmissor retransmite;
2. o pacote original eventualmente chega;
3. a cópia retransmitida também pode chegar;
4. uma das cópias é inútil;
5. a rede gastou capacidade transportando dados desnecessários.

Assim:

$$
\boxed{
\text{timeout prematuro}
\Rightarrow
\text{retransmissão desnecessária}
}
$$

Essa retransmissão adicional aumenta ainda mais a carga da rede.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.6.1, pp. 258–259, Figuras 3.45 e 3.46.

---

## Cenário 3 — Múltiplos saltos e congestion collapse

O terceiro cenário adiciona:

- múltiplos transmissores;
- caminhos com vários roteadores;
- buffers finitos;
- rotas que compartilham enlaces.

Nesse caso, um pacote pode consumir recursos de vários enlaces e ser descartado somente mais adiante.

Todo o trabalho realizado nos enlaces anteriores é desperdiçado.

Por exemplo:

```text
origem
  |
  | transmissão útil
  v
roteador 1
  |
  | transmissão útil
  v
roteador 2
  |
  X  pacote descartado
```

A capacidade usada antes do descarte não contribuiu para entregar dados ao destino.

Se a carga continuar aumentando, mais recursos podem ser gastos com:

- pacotes que serão descartados posteriormente;
- retransmissões;
- cópias desnecessárias.

Em situações extremas:

$$
\boxed{
\text{aumentar a carga pode diminuir o throughput útil}
}
$$

Esse comportamento está associado ao chamado:

**congestion collapse**.

O gráfico do Kurose para esse cenário mostra o throughput aumentando inicialmente e, depois de certo ponto, diminuindo conforme a carga oferecida continua crescendo.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.6.1, pp. 260–261, Figura 3.48.

---

## Custos do congestionamento

A partir dos três cenários, podemos resumir vários custos.

### 1. Grandes atrasos

Mesmo sem perdas:

$$
\lambda\rightarrow\mu
\Rightarrow
\text{atraso de fila cresce fortemente}.
$$

### 2. Retransmissões necessárias

Pacotes descartados precisam ser enviados novamente.

Isso consome capacidade que poderia ser usada para dados novos.

### 3. Retransmissões desnecessárias

Timeouts prematuros podem fazer o transmissor reenviar pacotes que ainda estavam apenas atrasados.

### 4. Trabalho desperdiçado em caminhos com vários saltos

Um pacote pode consumir capacidade em vários enlaces antes de ser descartado.

Esse trabalho anterior é perdido.

---

## Externalidade do congestionamento

Nas anotações aparece a ideia de **externalidade negativa**:

> a decisão de um transmissor pode prejudicar os demais.

Se uma fonte aumenta excessivamente sua taxa:

- ocupa buffers;
- aumenta filas;
- aumenta atraso;
- pode provocar perdas;
- pode forçar outras conexões a retransmitirem.

Assim, o desempenho de uma conexão não depende apenas de suas próprias decisões.

> **Observação:** as anotações também citam “NUM” e funções de utilidade. Esse desenvolvimento não aparece de forma explícita nas seções do Kurose usadas nesta aula, então a sigla foi mantida sem expansão para evitar acrescentar conteúdo de outra fonte.

---

## Como o TCP limita sua taxa

O TCP mantém uma variável chamada:

**congestion window — `cwnd`**

Ela limita a quantidade de dados que podem permanecer enviados e ainda não confirmados.

A taxa de envio pode ser aproximada por:

$$
\boxed{
\text{taxa TCP}
\approx
\frac{cwnd}{RTT}
}
$$

Assim, alterar `cwnd` altera a taxa com que o transmissor injeta dados na rede.

### Princípio básico

O TCP usa sinais locais:

- **ACK chegando**:
  - indica que dados estão sendo entregues;
  - permite aumentar a janela;
- **evento de perda**:
  - indica possível congestionamento;
  - leva à redução da janela.

Esse comportamento permite ao TCP sondar (*probe*) a largura de banda disponível.

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, pp. 264–266.

---

## Próxima aula — TCP Congestion Control

As anotações terminam indicando como próximo tópico:

> **Como o TCP implementa o controle de congestionamento.**

No Kurose, a sequência envolve três componentes principais:

1. **Slow Start**;
2. **Congestion Avoidance**;
3. **Fast Recovery**.

Esses mecanismos ajustam dinamicamente a variável:

$$
cwnd.
$$

**Referência:** Kurose & Ross, 8ª ed., Seção 3.7.1, pp. 263–270.

---

## Resumo

Os principais pontos desta aula foram:

- TCP como híbrido de GBN e SR;
- ACK cumulativo e próximo byte esperado;
- timeout e três ACKs duplicados como sinais de perda;
- ECN como sinalização explícita de congestionamento;
- controle de fluxo por `rwnd`;
- controle de congestionamento por `cwnd`;
- janela efetiva limitada por:

$$
\min(cwnd,rwnd);
$$

- 3-way handshake TCP;
- diferença entre controle de fluxo e controle de congestionamento;
- causas e custos do congestionamento;
- cenário 1:
  - buffer infinito;
  - throughput limitado;
  - atraso crescente;
- cenário 2:
  - buffer finito;
  - perdas;
  - retransmissões;
  - retransmissões desnecessárias;
- cenário 3:
  - múltiplos saltos;
  - trabalho desperdiçado;
  - congestion collapse;
- `cwnd` como mecanismo para controlar a taxa TCP;
- introdução a Slow Start, Congestion Avoidance e Fast Recovery.

